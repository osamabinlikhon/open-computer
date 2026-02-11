/**
 * OpenCode Agent - Example Usage
 * Demonstrates how to use the OpencodeComputerAgent with the OpenCode SDK
 */

import OpencodeComputerAgent from "./opencode-agent";

/**
 * Example 1: Basic prompt and response
 */
export async function exampleBasicPrompt() {
  console.log("\n=== Example 1: Basic Prompt ===");
  const agent = new OpencodeComputerAgent();

  try {
    await agent.initialize();
    await agent.createSession("Basic Prompt Example");

    const response = await agent.prompt(
      "What are the key features of TypeScript?"
    );

    console.log("Response received with", response.parts.length, "parts");
  } catch (error) {
    console.error("Example failed:", error);
  } finally {
    await agent.cleanup();
  }
}

/**
 * Example 2: Shell command execution
 */
export async function exampleShellCommand() {
  console.log("\n=== Example 2: Shell Command ===");
  const agent = new OpencodeComputerAgent();

  try {
    await agent.initialize();
    await agent.createSession("Shell Command Example");

    const response = await agent.shell("echo 'Hello from OpenCode'");

    console.log("Command output:");
    response.parts.forEach((part) => {
      if (part.type === "text") {
        console.log((part as any).text);
      }
    });
  } catch (error) {
    console.error("Example failed:", error);
  } finally {
    await agent.cleanup();
  }
}

/**
 * Example 3: File operations
 */
export async function exampleFileOperations() {
  console.log("\n=== Example 3: File Operations ===");
  const agent = new OpencodeComputerAgent();

  try {
    await agent.initialize();

    // Find TypeScript files
    const files = await agent.findFiles("*.ts", { type: "file", limit: 10 });
    console.log("Found TypeScript files:", files);

    // Read a file
    if (files.length > 0) {
      const content = await agent.readFile(files[0]);
      console.log(`File type: ${content.type}`);
      console.log(`Content length: ${content.content.length} characters`);
    }

    // Search for text
    const results = await agent.findText("async");
    console.log(`Found ${results.length} matches for 'async'`);
  } catch (error) {
    console.error("Example failed:", error);
  } finally {
    await agent.cleanup();
  }
}

/**
 * Example 4: Multi-turn conversation
 */
export async function exampleMultiTurn() {
  console.log("\n=== Example 4: Multi-Turn Conversation ===");
  const agent = new OpencodeComputerAgent();

  try {
    await agent.initialize();
    await agent.createSession("Multi-Turn Example");

    // First message
    await agent.prompt("What is the capital of France?");

    // Follow-up message
    await agent.prompt("What are some famous landmarks there?");

    // Get conversation history
    const messages = await agent.getMessages();
    console.log(`\nConversation has ${messages.length} messages`);

    messages.forEach((msg, index) => {
      console.log(
        `Message ${index + 1}: ${msg.info.type || "unknown"} (${msg.parts.length} parts)`
      );
    });
  } catch (error) {
    console.error("Example failed:", error);
  } finally {
    await agent.cleanup();
  }
}

/**
 * Example 5: Using existing OpenCode server
 */
export async function exampleExistingServer() {
  console.log("\n=== Example 5: Existing Server ===");
  const agent = new OpencodeComputerAgent({
    serverUrl: "http://localhost:4096",
  });

  try {
    // Connect to existing server
    await agent.initialize(true);

    // List existing sessions
    const sessions = await agent.listSessions();
    console.log(`Found ${sessions.length} existing sessions`);

    if (sessions.length > 0) {
      console.log("First session:", sessions[0].id);
    }

    // Get providers
    const providers = await agent.getProviders();
    console.log("Available providers:", providers.providers);
  } catch (error) {
    console.error("Example failed:", error);
  }
}

/**
 * Example 6: Complex task with session management
 */
export async function exampleComplexTask() {
  console.log("\n=== Example 6: Complex Task ===");
  const agent = new OpencodeComputerAgent();

  try {
    await agent.initialize();
    await agent.createSession("Complex Task Example");

    // Step 1: Gather information with context
    await agent.prompt("You are a helpful code assistant.", {
      noReply: true,
    });

    // Step 2: Ask a question
    await agent.prompt("How do I create a TypeScript function?");

    // Step 3: Follow up
    await agent.prompt("Can you show me an async example?");

    // Step 4: Get current session info
    const currentSession = agent.getCurrentSession();
    console.log("\nCurrent session:", currentSession?.id);
    console.log("Session title:", currentSession?.title);

    // Step 5: Retrieve full conversation
    const messages = await agent.getMessages();
    console.log("Total messages in session:", messages.length);
  } catch (error) {
    console.error("Example failed:", error);
  } finally {
    await agent.cleanup();
  }
}

/**
 * Example 7: Error handling
 */
export async function exampleErrorHandling() {
  console.log("\n=== Example 7: Error Handling ===");
  const agent = new OpencodeComputerAgent();

  try {
    await agent.initialize();

    // Try to get messages without creating session
    const messages = await agent.getMessages("invalid-id");
  } catch (error) {
    console.log("Caught expected error:", (error as Error).message);
  }

  // Proper way
  try {
    await agent.createSession("Error Handling Example");
    const messages = await agent.getMessages();
    console.log("Successfully retrieved messages:", messages.length);
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    await agent.cleanup();
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  const examples = [
    exampleBasicPrompt,
    exampleShellCommand,
    exampleFileOperations,
    exampleMultiTurn,
    exampleComplexTask,
    exampleErrorHandling,
  ];

  for (const example of examples) {
    try {
      await example();
      console.log("✓ Example completed\n");
      // Add delay between examples
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to run example:", error);
    }
  }
}

// Run a simple demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleBasicPrompt().catch(console.error);
}
