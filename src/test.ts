/**
 * Test Utilities for Computer Use Agent
 */

export async function testConnection(client: any, modelName: string = "minimax-m2.1-free"): Promise<boolean> {
  try {
    const response = await client.messages.create({
      model: modelName,
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content:
            "Say 'Connection successful' in exactly 2 words.",
        },
      ],
    });

    console.log("✓ Claude API connection: OK");
    console.log(`  Response: ${response.content[0].type === 'text' ? response.content[0].text : 'Invalid response'}`);
    return true;
  } catch (error) {
    console.error("✗ Claude API connection: FAILED");
    console.error(`  Error: ${error}`);
    return false;
  }
}

export async function testE2BConnection(Sandbox: any): Promise<boolean> {
  let sandbox = null;
  try {
    sandbox = await Sandbox.create();
    console.log("✓ E2B Sandbox connection: OK");
    console.log(`  Sandbox ID: ${sandbox.sandboxId}`);
    await sandbox.kill();
    return true;
  } catch (error) {
    console.error("✗ E2B Sandbox connection: FAILED");
    console.error(`  Error: ${error}`);
    return false;
  }
}

export async function testEnvironment(): Promise<boolean> {
  console.log("\n🔍 Environment Check");
  console.log("─".repeat(50));

  let allOk = true;

  // Check E2B_API_KEY
  if (process.env.E2B_API_KEY) {
    console.log("✓ E2B_API_KEY: Set");
  } else {
    console.log("✗ E2B_API_KEY: Not set");
    allOk = false;
  }

  // Check OPENCODE_ZEN_API_KEY
  if (process.env.OPENCODE_ZEN_API_KEY) {
    console.log("✓ OPENCODE_ZEN_API_KEY: Set");
  } else {
    console.log("✗ OPENCODE_ZEN_API_KEY: Not set");
    allOk = false;
  }

  // Check Node version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split(".")[0].slice(1));
  if (majorVersion >= 16) {
    console.log(`✓ Node.js version: ${nodeVersion}`);
  } else {
    console.log(`✗ Node.js version: ${nodeVersion} (requires 16+)`);
    allOk = false;
  }

  return allOk;
}

export async function runDiagnostics(client: any, Sandbox: any, modelName: string = "minimax-m2.1-free"): Promise<void> {
  console.log("\n🔧 Running Diagnostics");
  console.log("=".repeat(50));

  const envOk = await testEnvironment();
  console.log("\n📡 API Connections");
  console.log("─".repeat(50));

  const modelOk = await testConnection(client, modelName);
  const e2bOk = await testE2BConnection(Sandbox);

  console.log("\n📊 Diagnostic Summary");
  console.log("=".repeat(50));
  console.log(`Environment Setup: ${envOk ? "✓" : "✗"}`);
  console.log(`MiniMax M2.1 API: ${modelOk ? "✓" : "✗"}`);
  console.log(`E2B Sandbox: ${e2bOk ? "✓" : "✗"}`);

  if (envOk && modelOk && e2bOk) {
    console.log("\n✨ All systems operational!");
  } else {
    console.log("\n⚠️ Some systems need attention. Please check the errors above.");
  }
}
