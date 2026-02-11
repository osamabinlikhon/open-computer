/**
 * Computer Use Agent using OpenCode SDK
 * This is a type-safe agent built with the @opencode-ai/sdk
 */

import {
  createOpencode,
  createOpencodeClient,
  type Session,
  type Message,
  type Part,
} from "@opencode-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

interface AgentConfig {
  hostname?: string;
  port?: number;
  model?: string;
  timeout?: number;
  serverUrl?: string;
}

/**
 * Computer Use Agent powered by OpenCode SDK
 */
export class OpencodeComputerAgent {
  private server: Awaited<ReturnType<typeof createOpencode>> | null = null;
  private client: Awaited<ReturnType<typeof createOpencodeClient>> | null =
    null;
  private currentSession: Session | null = null;
  private config: AgentConfig;

  constructor(config: AgentConfig = {}) {
    this.config = {
      hostname: config.hostname || process.env.OPENCODE_HOST || "127.0.0.1",
      port: config.port || parseInt(process.env.OPENCODE_PORT || "4096"),
      model: config.model || process.env.OPENCODE_MODEL || "anthropic/claude-3-5-sonnet-20241022",
      timeout: config.timeout || 5000,
      serverUrl:
        config.serverUrl ||
        process.env.OPENCODE_SERVER_URL ||
        "http://localhost:4096",
    };
  }

  /**
   * Initialize the OpenCode server and create a client
   */
  async initialize(useExistingServer: boolean = false): Promise<void> {
    console.log("🚀 Initializing OpenCode Computer Agent...");

    try {
      if (useExistingServer) {
        console.log(
          `📡 Connecting to existing OpenCode server at ${this.config.serverUrl}`
        );
        this.client = createOpencodeClient({
          baseUrl: this.config.serverUrl,
        });
      } else {
        console.log(
          `🔨 Starting new OpenCode server on ${this.config.hostname}:${this.config.port}`
        );
        this.server = await createOpencode({
          hostname: this.config.hostname,
          port: this.config.port,
          timeout: this.config.timeout,
          config: {
            model: this.config.model,
          },
        });

        // Extract client from server
        this.client = this.server.client;
        console.log(`✓ Server running at ${this.server.server.url}`);
      }

      // Verify connection
      const health = await this.client!.global.health();
      console.log(`✓ OpenCode health check: v${health.data.version}`);
    } catch (error) {
      console.error("Failed to initialize OpenCode:", error);
      throw error;
    }
  }

  /**
   * Create a new session for task execution
   */
  async createSession(title: string = "Computer Use Task"): Promise<Session> {
    if (!this.client) {
      throw new Error("Agent not initialized. Call initialize() first.");
    }

    console.log(`📝 Creating new session: "${title}"`);

    try {
      const session = await this.client.session.create({
        body: {
          title,
          description: "Autonomous computer use task",
        },
      });

      this.currentSession = session;
      console.log(`✓ Session created: ${session.id}`);
      return session;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  }

  /**
   * Send a prompt to the agent and get response
   */
  async prompt(
    message: string,
    options?: {
      noReply?: boolean;
      model?: { providerID: string; modelID: string };
    }
  ): Promise<{ info: Message; parts: Part[] }> {
    if (!this.client || !this.currentSession) {
      throw new Error("Session not created. Call createSession() first.");
    }

    console.log(`\n💬 Sending prompt: "${message}"`);

    try {
      const result = await this.client.session.prompt({
        path: { id: this.currentSession.id },
        body: {
          parts: [{ type: "text", text: message }],
          noReply: options?.noReply || false,
          model: options?.model || {
            providerID: "anthropic",
            modelID: "claude-3-5-sonnet-20241022",
          },
        },
      });

      if (!options?.noReply) {
        console.log(`✓ Response received`);
        this._printMessage(result);
      }

      return result;
    } catch (error) {
      console.error("Failed to send prompt:", error);
      throw error;
    }
  }

  /**
   * Execute a shell command
   */
  async shell(command: string): Promise<{
    info: Message;
    parts: Part[];
  }> {
    if (!this.client || !this.currentSession) {
      throw new Error("Session not created. Call createSession() first.");
    }

    console.log(`🔨 Executing command: "${command}"`);

    try {
      const result = await this.client.session.shell({
        path: { id: this.currentSession.id },
        body: { command },
      });

      console.log(`✓ Command executed`);
      return result;
    } catch (error) {
      console.error("Failed to execute command:", error);
      throw error;
    }
  }

  /**
   * Send a direct command
   */
  async command(
    commandText: string,
    options?: {
      model?: { providerID: string; modelID: string };
    }
  ): Promise<{ info: Message; parts: Part[] }> {
    if (!this.client || !this.currentSession) {
      throw new Error("Session not created. Call createSession() first.");
    }

    console.log(`⚡ Sending command: "${commandText}"`);

    try {
      const result = await this.client.session.command({
        path: { id: this.currentSession.id },
        body: {
          command: commandText,
          model: options?.model || {
            providerID: "anthropic",
            modelID: "claude-3-5-sonnet-20241022",
          },
        },
      });

      console.log(`✓ Command processed`);
      return result;
    } catch (error) {
      console.error("Failed to execute command:", error);
      throw error;
    }
  }

  /**
   * Get session messages history
   */
  async getMessages(
    sessionId?: string
  ): Promise<Array<{ info: Message; parts: Part[] }>> {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    const id = sessionId || this.currentSession?.id;
    if (!id) {
      throw new Error("No session ID provided or set.");
    }

    try {
      const messages = await this.client.session.messages({
        path: { id },
      });

      console.log(`✓ Retrieved ${messages.length} messages`);
      return messages;
    } catch (error) {
      console.error("Failed to get messages:", error);
      throw error;
    }
  }

  /**
   * Get specific message
   */
  async getMessage(
    messageId: string
  ): Promise<{ info: Message; parts: Part[] }> {
    if (!this.client || !this.currentSession) {
      throw new Error("Session not created.");
    }

    try {
      const message = await this.client.session.message({
        path: {
          id: this.currentSession.id,
          messageId,
        },
      });

      return message;
    } catch (error) {
      console.error("Failed to get message:", error);
      throw error;
    }
  }

  /**
   * Revert to a previous message
   */
  async revert(
    messageId: string,
    description?: string
  ): Promise<Session> {
    if (!this.client || !this.currentSession) {
      throw new Error("Session not created.");
    }

    console.log(`⏮️ Reverting to message: ${messageId}`);

    try {
      const session = await this.client.session.revert({
        path: { id: this.currentSession.id },
        body: {
          messageID: messageId,
          description: description || "User revert",
        },
      });

      this.currentSession = session;
      console.log(`✓ Reverted successfully`);
      return session;
    } catch (error) {
      console.error("Failed to revert:", error);
      throw error;
    }
  }

  /**
   * Get available models and providers
   */
  async getProviders(): Promise<{
    providers: Array<{ id: string; name: string }>;
    defaults: Record<string, string>;
  }> {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    try {
      const { providers, default: defaults } = await this.client.config.providers();
      return { providers: providers as any, defaults };
    } catch (error) {
      console.error("Failed to get providers:", error);
      throw error;
    }
  }

  /**
   * Search files in workspace
   */
  async findFiles(
    query: string,
    options?: { type?: "file" | "directory" | string; limit?: number }
  ): Promise<string[]> {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    try {
      const results = await this.client.find.files({
        query: {
          query,
          type: options?.type,
          limit: options?.limit || 20,
        },
      });

      console.log(`✓ Found ${results.length} files`);
      return results;
    } catch (error) {
      console.error("Failed to find files:", error);
      throw error;
    }
  }

  /**
   * Search text in files
   */
  async findText(pattern: string): Promise<
    Array<{
      path: string;
      line_number: number;
      lines: string[];
      absolute_offset: number;
      submatches: Array<{ start: number; end: number }>;
    }>
  > {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    try {
      const results = await this.client.find.text({
        query: { pattern },
      });

      console.log(`✓ Found ${results.length} matches`);
      return results as any;
    } catch (error) {
      console.error("Failed to find text:", error);
      throw error;
    }
  }

  /**
   * Read file contents
   */
  async readFile(
    filePath: string
  ): Promise<{ type: string; content: string }> {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    try {
      const file = await this.client.file.read({
        query: { path: filePath },
      });

      console.log(`✓ Read file: ${filePath}`);
      return file;
    } catch (error) {
      console.error("Failed to read file:", error);
      throw error;
    }
  }

  /**
   * List sessions
   */
  async listSessions(): Promise<Session[]> {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    try {
      const sessions = await this.client.session.list();
      console.log(`✓ Listed ${sessions.length} sessions`);
      return sessions;
    } catch (error) {
      console.error("Failed to list sessions:", error);
      throw error;
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  /**
   * Delete current session
   */
  async deleteSession(sessionId?: string): Promise<boolean> {
    if (!this.client) {
      throw new Error("Agent not initialized.");
    }

    const id = sessionId || this.currentSession?.id;
    if (!id) {
      throw new Error("No session to delete.");
    }

    try {
      const deleted = await this.client.session.delete({
        path: { id },
      });

      if (deleted) {
        if (!sessionId) {
          this.currentSession = null;
        }
        console.log(`✓ Session deleted: ${id}`);
      }
      return deleted;
    } catch (error) {
      console.error("Failed to delete session:", error);
      throw error;
    }
  }

  /**
   * Close the OpenCode server
   */
  async cleanup(): Promise<void> {
    try {
      if (this.currentSession) {
        await this.deleteSession();
      }

      if (this.server) {
        this.server.server.close();
        console.log("✓ OpenCode server closed");
      }

      this.client = null;
      this.server = null;
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }

  /**
   * Helper to print message content
   */
  private _printMessage(message: { info: Message; parts: Part[] }): void {
    for (const part of message.parts) {
      if (part.type === "text") {
        console.log(`\n📄 ${part.text}`);
      } else if (part.type === "error") {
        console.error(`\n❌ Error: ${(part as any).text}`);
      } else if (part.type === "shell") {
        console.log(`\n🔨 Shell output:`);
        console.log((part as any).text);
      }
    }
  }
}

// Export for use
export default OpencodeComputerAgent;
