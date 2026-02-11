import Anthropic from "@anthropic-ai/sdk";
import { Sandbox } from "@e2b/desktop";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { OpenCodeController } from "./opencode-client.js";

dotenv.config();

interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

interface TextBlock {
  type: "text";
  text: string;
}

type ContentBlock = ToolUseBlock | TextBlock;

// Initialize OpenCode Zen client (using Anthropic SDK with custom endpoint for MiniMax M2.1)
const client = new Anthropic({
  apiKey: process.env.OPENCODE_ZEN_API_KEY,
  baseURL: "https://opencode.ai/zen/v1",
});

const MODEL = process.env.OPENCODE_ZEN_MODEL || "minimax-m2.1-free";

class ComputerUseAgent {
  private desktop: InstanceType<typeof Sandbox> | null = null;
  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: string | ContentBlock[];
  }> = [];

  async initialize(): Promise<void> {
    console.log("Initializing Computer Use Agent...");
    console.log("Creating E2B Desktop Sandbox...");

    try {
      this.desktop = await Sandbox.create();
      console.log(`✓ Desktop sandbox created: ${this.desktop.sandboxId}`);
    } catch (error) {
      console.error("Failed to create desktop sandbox:", error);
      throw error;
    }
  }

  async takeScreenshot(): Promise<string> {
    if (!this.desktop) {
      throw new Error("Desktop sandbox not initialized");
    }

    try {
      // Get current window screenshot
      const screenshotPath = await this.desktop.screenshot();
      const imageData = fs.readFileSync(screenshotPath);
      return imageData.toString("base64");
    } catch (error) {
      console.error("Failed to take screenshot:", error);
      throw error;
    }
  }

  async executeToolCall(
    toolName: string,
    toolInput: Record<string, unknown>
  ): Promise<string> {
    if (!this.desktop) {
      throw new Error("Desktop sandbox not initialized");
    }

    console.log(`\nExecuting tool: ${toolName}`);
    console.log(`Input: ${JSON.stringify(toolInput)}`);

    try {
      switch (toolName) {
        case "screenshot":
          const base64Image = await this.takeScreenshot();
          console.log("✓ Screenshot captured");
          return JSON.stringify({ success: true, image_base64: base64Image });

        case "click":
          const { x, y } = toolInput as { x: number; y: number };
          await this.desktop.click({
            x: Math.round(x),
            y: Math.round(y),
          });
          console.log(`✓ Clicked at (${x}, ${y})`);
          return JSON.stringify({ success: true });

        case "type":
          const { text } = toolInput as { text: string };
          await this.desktop.write(text);
          console.log(`✓ Typed: "${text}"`);
          return JSON.stringify({ success: true });

        case "key":
          const { key } = toolInput as { key: string };
          await this.desktop.press(key);
          console.log(`✓ Pressed key: ${key}`);
          return JSON.stringify({ success: true });

        case "scroll":
          const { direction, amount } = toolInput as {
            direction: string;
            amount: number;
          };
          // E2B Desktop may not have scroll, use arrow keys instead
          const key = direction === "down" ? "Page_Down" : "Page_Up";
          for (let i = 0; i < amount; i++) {
            await this.desktop.press(key);
          }
          console.log(`✓ Scrolled ${direction} ${amount} times`);
          return JSON.stringify({ success: true });

        case "launch_app":
          const { app } = toolInput as { app: string };
          await this.desktop.launch(app);
          console.log(`✓ Launched ${app}`);
          await this.sleep(3000); // Wait for app to open
          return JSON.stringify({ success: true });

        case "wait":
          const { duration } = toolInput as { duration: number };
          await this.sleep(duration);
          console.log(`✓ Waited ${duration}ms`);
          return JSON.stringify({ success: true });

        default:
          return JSON.stringify({ error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Tool execution failed: ${errorMessage}`);
      return JSON.stringify({ error: errorMessage });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async chat(userMessage: string): Promise<string> {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`User: ${userMessage}`);
    console.log("=".repeat(60));

    // Add user message to conversation history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    // Take screenshot for context
    try {
      const screenshotBase64 = await this.takeScreenshot();

      // Call MiniMax M2.1 with vision capability via OpenCode Zen
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: `You are a computer use agent with the ability to control a desktop. You can interact with applications, navigate the screen, and perform tasks.

Available tools:
1. screenshot - Take a screenshot of the current desktop
2. click - Click at coordinates (x, y)
3. type - Type text into the currently focused element
4. key - Press a keyboard key (e.g., "Return", "Tab", "Escape")
5. scroll - Scroll in a direction ("up" or "down") for a certain amount
6. launch_app - Launch an application (e.g., "google-chrome", "code", "gedit")
7. wait - Wait for a specified duration in milliseconds

When you need to interact with the computer:
1. First take a screenshot to see the current state
2. Identify what needs to be done
3. Use the appropriate tools to accomplish the task
4. Take another screenshot to verify the action
5. Repeat until the task is complete

Be methodical and describe what you're doing at each step.`,
        messages: [
          ...this.conversationHistory.map((msg) => ({
            role: msg.role,
            content: Array.isArray(msg.content)
              ? msg.content
              : [
                  {
                    type: "text" as const,
                    text: msg.content,
                  },
                ],
          })),
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: screenshotBase64,
                },
              } as unknown as { type: string; source: unknown },
              {
                type: "text",
                text:
                  userMessage === this.conversationHistory[this.conversationHistory.length - 1].content
                    ? ""
                    : userMessage,
              },
            ],
          },
        ],
      });

      // Process the response
      let assistantMessage = "";
      const toolCalls: Array<{ id: string; name: string; input: unknown }> =
        [];

      for (const block of response.content) {
        if (block.type === "text") {
          assistantMessage += block.text;
          console.log(`\nAssistant: ${block.text}`);
        } else if (block.type === "tool_use") {
          const toolBlock = block as ToolUseBlock;
          toolCalls.push({
            id: toolBlock.id,
            name: toolBlock.name,
            input: toolBlock.input,
          });
        }
      }

      // Execute any tool calls
      const toolResults = [];
      for (const toolCall of toolCalls) {
        const result = await this.executeToolCall(
          toolCall.name,
          toolCall.input as Record<string, unknown>
        );
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolCall.id,
          content: result,
        });
      }

      // If there were tool calls, continue the conversation with results
      if (toolCalls.length > 0) {
        this.conversationHistory.push({
          role: "assistant",
          content: response.content as ContentBlock[],
        });

        // Add tool results as user message
        const toolResultsMessage = toolResults.map((result) => ({
          type: "tool_result",
          tool_use_id: (result as Record<string, unknown>).tool_use_id,
          content: (result as Record<string, unknown>).content,
        }));

        // Continue the conversation with tool results
        const followUpResponse = await client.messages.create({
          model: MODEL,
          max_tokens: 4096,
          system:
            "You are a computer use agent. Continue working on the task based on the tool results.",
          messages: [
            ...this.conversationHistory.map((msg) => ({
              role: msg.role,
              content: Array.isArray(msg.content)
                ? msg.content
                : [{ type: "text", text: msg.content }],
            })),
            {
              role: "user",
              content: toolResultsMessage as unknown as Array<{ type: string }>,
            },
          ],
        });

        for (const block of followUpResponse.content) {
          if (block.type === "text") {
            console.log(`\nAssistant: ${block.text}`);
            assistantMessage += `\n${block.text}`;
          }
        }
      }

      // Update conversation history
      if (!assistantMessage) {
        assistantMessage =
          "Task completed. Ready for the next instruction.";
      }

      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Error during chat: ${errorMessage}`);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.desktop) {
      try {
        await this.desktop.kill();
        console.log("✓ Desktop sandbox terminated");
      } catch (error) {
        console.error("Failed to cleanup desktop sandbox:", error);
      }
    }
  }
}

// Main execution
async function main() {
  const agent = new ComputerUseAgent();

  try {
    // Initialize the agent
    await agent.initialize();

    // Example tasks - you can modify these
    console.log("\n📋 Computer Use Agent Started");
    console.log("━".repeat(60));

    // Task 1: Launch Chrome and search for something
    await agent.chat(
      "Please launch Google Chrome and search for 'Weather in San Francisco'"
    );

    // Add a pause between tasks
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Task 2: Launch VS Code and create a file
    await agent.chat(
      "Now please launch VS Code and create a new file called 'example.txt' with the content 'Hello, Computer Use Agent!'"
    );

    console.log("\n✓ All tasks completed!");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await agent.cleanup();
  }
}

main();
