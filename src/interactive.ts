import Anthropic from "@anthropic-ai/sdk";
import { Sandbox } from "@e2b/desktop";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

// Initialize OpenCode Zen client for MiniMax M2.1 model
const client = new Anthropic({
  apiKey: process.env.OPENCODE_ZEN_API_KEY,
  baseURL: "https://opencode.ai/zen/v1",
});

const MODEL = process.env.OPENCODE_ZEN_MODEL || "minimax-m2.1-free";

class InteractiveComputerAgent {
  private desktop: InstanceType<typeof Sandbox> | null = null;
  private conversationHistory: Array<{
    role: "user" | "assistant";
    content: unknown;
  }> = [];
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async initialize(): Promise<void> {
    console.log("🚀 Initializing Interactive Computer Use Agent...");
    console.log("Creating E2B Desktop Sandbox...");

    try {
      this.desktop = await Sandbox.create();
      console.log(
        `✓ Desktop sandbox created: ${this.desktop.sandboxId}\n`
      );
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

    console.log(`\n  🔧 Executing: ${toolName}`);

    try {
      switch (toolName) {
        case "screenshot":
          const base64Image = await this.takeScreenshot();
          return JSON.stringify({ success: true, image_base64: base64Image });

        case "click":
          const { x, y } = toolInput as { x: number; y: number };
          await this.desktop.click({
            x: Math.round(x),
            y: Math.round(y),
          });
          return JSON.stringify({ success: true });

        case "type":
          const { text } = toolInput as { text: string };
          await this.desktop.write(text);
          return JSON.stringify({ success: true });

        case "key":
          const { key } = toolInput as { key: string };
          await this.desktop.press(key);
          return JSON.stringify({ success: true });

        case "scroll":
          const { direction, amount = 3 } = toolInput as {
            direction: string;
            amount?: number;
          };
          const scrollKey =
            direction === "down" ? "Page_Down" : "Page_Up";
          for (let i = 0; i < (amount || 3); i++) {
            await this.desktop.press(scrollKey);
          }
          return JSON.stringify({ success: true });

        case "launch_app":
          const { app } = toolInput as { app: string };
          await this.desktop.launch(app);
          await this.sleep(3000);
          return JSON.stringify({ success: true });

        case "wait":
          const { duration } = toolInput as { duration: number };
          await this.sleep(duration);
          return JSON.stringify({ success: true });

        default:
          return JSON.stringify({ error: `Unknown tool: ${toolName}` });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return JSON.stringify({ error: errorMessage });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async chat(userMessage: string): Promise<string> {
    console.log(`\n👤 You: ${userMessage}`);

    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    try {
      const screenshotBase64 = await this.takeScreenshot();

      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: `You are a helpful computer use agent. You can interact with the desktop using provided tools.

Available tools: screenshot, click, type, key, scroll, launch_app, wait

Use tools to help accomplish the user's task. Be methodical and efficient.`,
        messages: [
          ...this.conversationHistory.map((msg) => ({
            role: msg.role,
            content: Array.isArray(msg.content)
              ? msg.content
              : [{ type: "text", text: msg.content }],
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
              } as unknown,
              {
                type: "text",
                text: userMessage,
              },
            ],
          },
        ],
      });

      let fullResponse = "";
      const toolCalls: Array<{ id: string; name: string; input: unknown }> =
        [];

      for (const block of response.content) {
        if (block.type === "text") {
          fullResponse += block.text;
          console.log(`\n🤖 Agent: ${block.text}`);
        } else if (block.type === "tool_use") {
          const toolBlock = block as {
            type: string;
            id: string;
            name: string;
            input: unknown;
          };
          toolCalls.push({
            id: toolBlock.id,
            name: toolBlock.name,
            input: toolBlock.input,
          });
        }
      }

      // Execute tool calls
      if (toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          const result = await this.executeToolCall(
            toolCall.name,
            toolCall.input as Record<string, unknown>
          );
          console.log(`    ✓ Result: ${result.substring(0, 100)}...`);
        }
      }

      this.conversationHistory.push({
        role: "assistant",
        content: fullResponse,
      });

      return fullResponse;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Error: ${errorMessage}`);
      throw error;
    }
  }

  async startInteractiveSession(): Promise<void> {
    console.log("\n" + "=".repeat(60));
    console.log("💻 Interactive Computer Use Agent");
    console.log("=".repeat(60));
    console.log("Type your commands. Type 'exit' to quit.\n");

    const prompt = (): void => {
      this.rl.question("You: ", async (input) => {
        if (input.toLowerCase() === "exit") {
          await this.cleanup();
          this.rl.close();
          return;
        }

        try {
          await this.chat(input);
        } catch (error) {
          console.error("Error:", error);
        }

        prompt();
      });
    };

    prompt();
  }

  async cleanup(): Promise<void> {
    if (this.desktop) {
      try {
        await this.desktop.kill();
        console.log("✓ Desktop sandbox terminated");
      } catch (error) {
        console.error("Failed to cleanup:", error);
      }
    }
  }
}

// Main
async function main() {
  const agent = new InteractiveComputerAgent();

  try {
    await agent.initialize();
    await agent.startInteractiveSession();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
