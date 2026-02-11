import Anthropic from "@anthropic-ai/sdk";
import { Sandbox } from "@e2b/desktop";
import { runDiagnostics } from "./test";
import dotenv from "dotenv";

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.OPENCODE_ZEN_API_KEY,
  baseURL: "https://opencode.ai/zen/v1",
});

const MODEL = process.env.OPENCODE_ZEN_MODEL || "minimax-m2.1-free";

async function main() {
  try {
    await runDiagnostics(client, Sandbox, MODEL);
  } catch (error) {
    console.error("Diagnostic error:", error);
    process.exit(1);
  }
}

main();
