/**
 * OpenCode Computer Agent - Main Entry Point
 * Demonstrates the new OpenCode SDK-based agent
 */

import OpencodeComputerAgent from "./opencode-agent";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 OpenCode Computer Agent");
  console.log("=".repeat(50));

  const agent = new OpencodeComputerAgent({
    model: process.env.OPENCODE_MODEL || "anthropic/claude-3-5-sonnet-20241022",
  });

  try {
    // Initialize server
    await agent.initialize();

    // Create a task session
    await agent.createSession("Computer Use Task");

    // Example 1: Get information
    console.log("\n📋 Task 1: Gather Information");
    await agent.prompt(
      "What are the main features of a Computer Use Agent? Give a concise answer."
    );

    // Example 2: Execute command
    console.log("\n📋 Task 2: Execute Shell Command");
    await agent.shell("node --version");

    // Example 3: File search
    console.log("\n📋 Task 3: Find TypeScript Files");
    const files = await agent.findFiles("*.ts", { limit: 5 });
    console.log("Found files:", files.slice(0, 3).join(", "));

    // Example 4: Multi-turn conversation
    console.log("\n📋 Task 4: Multi-Turn Conversation");
    await agent.prompt("What programming languages are popular for systems?");
    await agent.prompt("Which one would you recommend for real-time applications?");

    // Example 5: View conversation history
    console.log("\n📋 Task 5: View Conversation History");
    const messages = await agent.getMessages();
    console.log(`Total messages in session: ${messages.length}`);
    messages.forEach((msg, idx) => {
      console.log(`  ${idx + 1}. ${msg.info.type} with ${msg.parts.length} parts`);
    });

    // Example 6: Get available providers
    console.log("\n📋 Task 6: List Available Providers");
    const providers = await agent.getProviders();
    console.log(`Available providers: ${providers.providers.length}`);
    console.log("Default models:", providers.defaults);

    console.log("\n✅ All tasks completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await agent.cleanup();
  }
}

// Run the main function
main();
