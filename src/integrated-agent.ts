import ComputerUseAgent from "./index.js";
import { OpenCodeController } from "./opencode-client.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Integrated Agent: Computer Use + OpenCode SDK
 * 
 * This demonstrates how to combine:
 * 1. E2B Desktop Sandbox for computer control
 * 2. OpenCode SDK for programmatic OpenCode control
 */
class IntegratedAgent {
  private computerAgent: ComputerUseAgent;
  private openCodeController: OpenCodeController;

  constructor() {
    this.computerAgent = new ComputerUseAgent();
    this.openCodeController = new OpenCodeController({
      baseUrl: "http://localhost:4096",
    });
  }

  async initialize(): Promise<void> {
    console.log("\n🚀 Initializing Integrated Agent...\n");
    
    // Initialize computer agent
    await this.computerAgent.initialize();
    
    // Check OpenCode connection
    try {
      const health = await this.openCodeController.health();
      console.log(`✓ OpenCode server v${health.version} is healthy`);
    } catch (error) {
      console.log("⚠️  OpenCode server not available, some features disabled");
    }
    
    console.log("\n✅ Integrated Agent ready!\n");
  }

  /**
   * Use Case 1: OpenCode controls the computer
   * OpenCode sends commands, Computer Use Agent executes them
   */
  async openCodeControlsComputer(sessionId: string): Promise<void> {
    console.log("\n🎯 Use Case: OpenCode controls the computer\n");
    
    // Send a command to OpenCode
    await this.openCodeController.sendPrompt(
      sessionId,
      "I want you to help me automate desktop tasks. I'll provide you with desktop screenshots and you tell me what actions to take."
    );

    // Get messages
    const messages = await this.openCodeController.getMessages(sessionId);
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage) {
      console.log("OpenCode suggests:", lastMessage.parts);
      
      // Execute on computer
      // This is a simplified example - in practice you'd parse the suggestion
      await this.computerAgent.chat("Take a screenshot and tell me what you see");
    }
  }

  /**
   * Use Case 2: Computer agent controls OpenCode
   * Computer agent automates OpenCode through the UI
   */
  async computerControlsOpenCode(): Promise<void> {
    console.log("\n🎯 Use Case: Computer agent controls OpenCode UI\n");
    
    // Launch OpenCode in browser
    await this.computerAgent.chat(
      "Launch Google Chrome and navigate to http://localhost:4096"
    );

    // Interact with OpenCode UI
    await this.computerAgent.chat(
      "Click on the prompt input field and type 'Hello from Computer Agent'"
    );

    await this.computerAgent.chat("Press Enter to submit the prompt");
  }

  /**
   * Use Case 3: Bi-directional integration
   * Both systems work together
   */
  async bidirectionalIntegration(): Promise<void> {
    console.log("\n🎯 Use Case: Bi-directional integration\n");
    
    // Create OpenCode session via SDK
    const session = await this.openCodeController.createSession(
      "Integrated Session"
    );
    console.log("✓ Created OpenCode session:", session.id);

    // Use computer agent to open OpenCode UI
    await this.computerAgent.chat(
      "Launch Chrome and navigate to http://localhost:4096"
    );

    // Send prompt via SDK
    await this.openCodeController.sendPrompt(
      session.id,
      "Please analyze the current workspace and provide a summary."
    );

    // Computer agent watches and interacts
    await this.computerAgent.chat(
      "Wait for 3 seconds, then take a screenshot to see OpenCode's response"
    );

    // Get results via SDK
    const messages = await this.openCodeController.getMessages(session.id);
    console.log("✓ Retrieved", messages.length, "messages from OpenCode");

    // Clean up
    await this.openCodeController.deleteSession(session.id);
  }

  /**
   * Use Case 4: Automated workflow
   * Complete automated task using both systems
   */
  async automatedWorkflow(task: string): Promise<void> {
    console.log("\n🎯 Automated Workflow:", task, "\n");

    // Step 1: OpenCode analyzes the task
    const analysisSession = await this.openCodeController.createSession(
      "Task Analysis"
    );
    
    await this.openCodeController.sendPrompt(
      analysisSession.id,
      `Break down this task into steps: ${task}. Return a JSON array of steps.`
    );

    const messages = await this.openCodeController.getMessages(analysisSession.id);
    console.log("✓ Task analyzed");

    // Step 2: Computer agent executes each step
    await this.computerAgent.chat(
      `Execute this task: ${task}. Break it down into steps and complete each one.`
    );

    // Step 3: OpenCode verifies completion
    await this.openCodeController.sendPrompt(
      analysisSession.id,
      "The task has been completed. Please verify and summarize what was done."
    );

    await this.openCodeController.deleteSession(analysisSession.id);
  }

  /**
   * Use Case 5: File operations with visual feedback
   * Use OpenCode SDK for file ops, Computer agent for visual confirmation
   */
  async fileOperationsWithVisualFeedback(): Promise<void> {
    console.log("\n🎯 Use Case: File operations with visual feedback\n");

    // OpenCode SDK: Find files
    const files = await this.openCodeController.findFiles("*.ts");
    console.log("✓ Found files via SDK:", files.length);

    // Computer agent: Open file manager
    await this.computerAgent.chat(
      "Open the file manager and navigate to the project folder to show the files"
    );

    // OpenCode SDK: Read a file
    if (files.length > 0) {
      const content = await this.openCodeController.readFile(files[0]);
      console.log(`✓ Read ${files[0]} via SDK`);

      // Computer agent: Open in editor
      await this.computerAgent.chat(
        `Open VS Code: and open the file ${files[0]}`
      );
    }
  }

  async cleanup(): Promise<void> {
    await this.computerAgent.cleanup();
    console.log("✓ Cleanup complete");
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const useCase = args[0] || "1";

  console.log("\n" + "=".repeat(70));
  console.log("🔗 OpenCode SDK + Computer Use Agent Integration Demo");
  console.log("=".repeat(70));

  const agent = new IntegratedAgent();

  try {
    await agent.initialize();

    switch (useCase) {
      case "1":
        // Requires: OpenCode running on localhost:4096
        const session = await agent["openCodeController"].createSession("Demo");
        await agent.openCodeControlsComputer(session.id);
        await agent["openCodeController"].deleteSession(session.id);
        break;
      
      case "2":
        await agent.computerControlsOpenCode();
        break;
      
      case "3":
        await agent.bidirectionalIntegration();
        break;
      
      case "4":
        const task = args.slice(1).join(" ") || "Create a new project structure";
        await agent.automatedWorkflow(task);
        break;
      
      case "5":
        await agent.fileOperationsWithVisualFeedback();
        break;
      
      case "all":
        await agent.fileOperationsWithVisualFeedback();
        await agent.bidirectionalIntegration();
        break;
      
      default:
        console.log("\nUsage: tsx src/integrated-agent.ts [1-5|all] [task for option 4]");
        console.log("  1 - OpenCode controls computer");
        console.log("  2 - Computer controls OpenCode UI");
        console.log("  3 - Bidirectional integration");
        console.log("  4 - Automated workflow");
        console.log("  5 - File operations with visual feedback");
        console.log("  all - Run multiple use cases");
        console.log("\nNote: Make sure OpenCode is running on localhost:4096");
        console.log("      Run: opencode (in another terminal)\n");
    }

  } catch (error) {
    console.error("\n❌ Error:", error);
  } finally {
    await agent.cleanup();
    console.log("\n" + "=".repeat(70));
    console.log("✅ Demo completed!");
    console.log("=".repeat(70) + "\n");
  }
}

main();
