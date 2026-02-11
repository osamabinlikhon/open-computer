import { createOpencodeClient, createOpencode } from "@opencode-ai/sdk";
import { OpenCodeController } from "./opencode-client.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Example 1: Connect to existing OpenCode server
 */
async function exampleConnectToExisting() {
  console.log("\n📝 Example 1: Connect to existing OpenCode server\n");
  
  const controller = createOpenCodeController({
    baseUrl: "http://localhost:4096",
  });

  try {
    // Check health
    const health = await controller.health();
    console.log("✓ Server health:", health);

    // List agents
    const agents = await controller.listAgents();
    console.log("✓ Available agents:", agents.length);

    // Get current project
    const project = await controller.getCurrentProject();
    console.log("✓ Current project:", project.name || project);

    // Create a session
    const session = await controller.createSession("SDK Test Session");
    console.log("✓ Created session:", session.id);

    // Send a prompt
    console.log("\n💬 Sending prompt...");
    const response = await controller.sendPrompt(
      session.id,
      "Hello! Please list the files in the current directory."
    );
    console.log("✓ Response received");

    // Get messages
    const messages = await controller.getMessages(session.id);
    console.log("✓ Messages in session:", messages.length);

    // Search for files
    const files = await controller.findFiles("*.ts");
    console.log("✓ Found .ts files:", files.length);

    // Read a file
    if (files.length > 0) {
      const content = await controller.readFile(files[0]);
      console.log(`✓ Read file ${files[0]}: ${content.content.length} chars`);
    }

    // Clean up
    await controller.deleteSession(session.id);
    console.log("✓ Session deleted");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 2: Start local OpenCode server
 */
async function exampleStartLocalServer() {
  console.log("\n📝 Example 2: Start local OpenCode server\n");
  
  const controller = createOpenCodeController({ isLocal: true });

  try {
    // Start local server
    await controller.initializeLocal({
      port: 4096,
      config: {
        model: "minimax-m2.1-free",
      },
    });

    // Check health
    const health = await controller.health();
    console.log("✓ Server health:", health);

    // Create and use session
    const session = await controller.createSession("Local Server Test");
    console.log("✓ Created session:", session.id);

    // Send a command
    const result = await controller.sendCommand(session.id, "/find What is the main purpose of this project?"
    );
    console.log("✓ Command result received");

    // Clean up
    await controller.deleteSession(session.id);
    controller.close();

  } catch (error) {
    console.error("❌ Error:", error);
    controller.close();
  }
}

/**
 * Example 3: TUI Control
 */
async function exampleTUIControl() {
  console.log("\n📝 Example 3: TUI Control\n");
  
  const controller = createOpenCodeController({
    baseUrl: "http://localhost:4096",
  });

  try {
    // Show toast notification
    await controller.showToast("Hello from SDK!", "success");
    console.log("✓ Toast shown");

    // Append to prompt
    await controller.appendToPrompt("List all TypeScript files");
    console.log("✓ Text appended to prompt");

    // Open help
    await controller.openHelp();
    console.log("✓ Help dialog opened");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 4: Event Streaming
 */
async function exampleEventStreaming() {
  console.log("\n📝 Example 4: Event Streaming\n");
  
  const controller = createOpenCodeController({
    baseUrl: "http://localhost:4096",
  });

  try {
    const events = await controller.subscribeToEvents();
    console.log("✓ Subscribed to events");
    console.log("Listening for events... (press Ctrl+C to stop)");

    for await (const event of events.stream) {
      console.log("📨 Event:", event.type, event.properties);
      
      // Stop after 5 events for demo
      // In real usage, you'd have your own condition
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Example 5: File Operations
 */
async function exampleFileOperations() {
  console.log("\n📝 Example 5: File Operations\n");
  
  const controller = createOpencodeController({
    baseUrl: "http://localhost:4096",
  });

  try {
    // Find text
    const textResults = await controller.findText("function.*main");
    console.log("✓ Text search results:", textResults.length);

    // Find TypeScript files
    const tsFiles = await controller.findFiles("*.ts");
    console.log("✓ TypeScript files:", tsFiles);

    // Find directories
    const dirs = await controller.findFiles("src", "directory");
    console.log("✓ Directories:", dirs);

    // Read package.json
    const pkg = await controller.readFile("package.json");
    const pkgData = JSON.parse(pkg.content);
    console.log("✓ Package name:", pkgData.name);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

/**
 * Main function to run examples
 */
async function main() {
  const args = process.argv.slice(2);
  const example = args[0] || "1";

  console.log("\n" + "=".repeat(60));
  console.log("🚀 OpenCode SDK Examples");
  console.log("=".repeat(60));

  switch (example) {
    case "1":
      await exampleConnectToExisting();
      break;
    case "2":
      await exampleStartLocalServer();
      break;
    case "3":
      await exampleTUIControl();
      break;
    case "4":
      await exampleEventStreaming();
      break;
    case "5":
      await exampleFileOperations();
      break;
    case "all":
      await exampleConnectToExisting();
      await exampleTUIControl();
      await exampleFileOperations();
      break;
    default:
      console.log("\nUsage: tsx src/sdk-examples.ts [1-5|all]");
      console.log("  1 - Connect to existing server");
      console.log("  2 - Start local server");
      console.log("  3 - TUI Control");
      console.log("  4 - Event Streaming");
      console.log("  5 - File Operations");
      console.log("  all - Run multiple examples");
  }

  console.log("\n" + "=".repeat(60));
  console.log("✨ Examples completed!");
  console.log("=".repeat(60) + "\n");
}

// Fix the typo in example 5
function createOpencodeController(options: { baseUrl?: string; isLocal?: boolean }): OpenCodeController {
  return new OpenCodeController(options);
}

main().catch(console.error);
