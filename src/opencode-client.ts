import { createOpencodeClient, createOpencode } from "@opencode-ai/sdk";
import type { Session, Message, Part } from "@opencode-ai/sdk";

/**
 * OpenCode SDK Client Wrapper
 * Provides easy access to OpenCode programmatic control
 */
export class OpenCodeController {
  private client: any;
  private server: any;
  private isLocal: boolean;

  constructor(options: { baseUrl?: string; isLocal?: boolean } = {}) {
    this.isLocal = options.isLocal ?? false;
    
    if (this.isLocal) {
      // Will create local server + client
      this.client = null;
      this.server = null;
    } else {
      // Connect to existing OpenCode server
      this.client = createOpencodeClient({
        baseUrl: options.baseUrl || "http://localhost:4096",
      });
    }
  }

  /**
   * Initialize local OpenCode server with client
   */
  async initializeLocal(options: {
    hostname?: string;
    port?: number;
    config?: Record<string, any>;
  } = {}): Promise<void> {
    console.log("🚀 Starting local OpenCode server...");
    
    const instance = await createOpencode({
      hostname: options.hostname || "127.0.0.1",
      port: options.port || 4096,
      config: options.config || {
        model: "minimax-m2.1-free",
      },
    });

    this.client = instance.client;
    this.server = instance.server;
    
    console.log(`✓ OpenCode server running at ${instance.server.url}`);
  }

  /**
   * Check server health
   */
  async health(): Promise<{ healthy: boolean; version: string }> {
    const health = await this.client.global.health();
    return health.data;
  }

  /**
   * List all available agents
   */
  async listAgents(): Promise<any[]> {
    const agents = await this.client.app.agents();
    return agents.data || agents;
  }

  /**
   * Create a new session
   */
  async createSession(title: string): Promise<Session> {
    const session = await this.client.session.create({
      body: { title },
    });
    return session.data || session;
  }

  /**
   * List all sessions
   */
  async listSessions(): Promise<Session[]> {
    const sessions = await this.client.session.list();
    return sessions.data || sessions;
  }

  /**
   * Get a specific session
   */
  async getSession(sessionId: string): Promise<Session> {
    const session = await this.client.session.get({
      path: { id: sessionId },
    });
    return session.data || session;
  }

  /**
   * Send a prompt to a session
   */
  async sendPrompt(
    sessionId: string,
    text: string,
    options: { noReply?: boolean; model?: any } = {}
  ): Promise<Message> {
    const result = await this.client.session.prompt({
      path: { id: sessionId },
      body: {
        parts: [{ type: "text", text }],
        noReply: options.noReply ?? false,
        model: options.model,
      },
    });
    return result.data || result;
  }

  /**
   * Send a command to a session
   */
  async sendCommand(sessionId: string, command: string): Promise<Message> {
    const result = await this.client.session.command({
      path: { id: sessionId },
      body: {
        command,
      },
    });
    return result.data || result;
  }

  /**
   * Run a shell command in a session
   */
  async runShell(sessionId: string, command: string): Promise<Message> {
    const result = await this.client.session.shell({
      path: { id: sessionId },
      body: {
        command,
      },
    });
    return result.data || result;
  }

  /**
   * Get messages in a session
   */
  async getMessages(
    sessionId: string
  ): Promise<Array<{ info: Message; parts: Part[] }>> {
    const messages = await this.client.session.messages({
      path: { id: sessionId },
    });
    return messages.data || messages;
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    const result = await this.client.session.delete({
      path: { id: sessionId },
    });
    return result.data || result;
  }

  /**
   * Search for text in files
   */
  async findText(pattern: string): Promise<any[]> {
    const results = await this.client.find.text({
      query: { pattern },
    });
    return results.data || results;
  }

  /**
   * Find files by name
   */
  async findFiles(query: string, type?: "file" | "directory"): Promise<string[]> {
    const results = await this.client.find.files({
      query: { query, type },
    });
    return results.data || results;
  }

  /**
   * Read a file
   */
  async readFile(filePath: string): Promise<{ type: string; content: string }> {
    const result = await this.client.file.read({
      query: { path: filePath },
    });
    return result.data || result;
  }

  /**
   * Get current project
   */
  async getCurrentProject(): Promise<any> {
    const project = await this.client.project.current();
    return project.data || project;
  }

  /**
   * List all projects
   */
  async listProjects(): Promise<any[]> {
    const projects = await this.client.project.list();
    return projects.data || projects;
  }

  /**
   * Get current path
   */
  async getCurrentPath(): Promise<any> {
    const path = await this.client.path.get();
    return path.data || path;
  }

  /**
   * Get config info
   */
  async getConfig(): Promise<any> {
    const config = await this.client.config.get();
    return config.data || config;
  }

  /**
   * TUI: Append text to prompt
   */
  async appendToPrompt(text: string): Promise<boolean> {
    const result = await this.client.tui.appendPrompt({
      body: { text },
    });
    return result.data || result;
  }

  /**
   * TUI: Show toast notification
   */
  async showToast(message: string, variant: "success" | "error" | "info" = "info"): Promise<boolean> {
    const result = await this.client.tui.showToast({
      body: { message, variant },
    });
    return result.data || result;
  }

  /**
   * TUI: Submit current prompt
   */
  async submitPrompt(): Promise<boolean> {
    const result = await this.client.tui.submitPrompt();
    return result.data || result;
  }

  /**
   * TUI: Clear prompt
   */
  async clearPrompt(): Promise<boolean> {
    const result = await this.client.tui.clearPrompt();
    return result.data || result;
  }

  /**
   * TUI: Open help dialog
   */
  async openHelp(): Promise<boolean> {
    const result = await this.client.tui.openHelp();
    return result.data || result;
  }

  /**
   * TUI: Open sessions selector
   */
  async openSessions(): Promise<boolean> {
    const result = await this.client.tui.openSessions();
    return result.data || result;
  }

  /**
   * Subscribe to events
   */
  async subscribeToEvents(): Promise<any> {
    const events = await this.client.event.subscribe();
    return events;
  }

  /**
   * Set authentication credentials
   */
  async setAuth(providerId: string, key: string): Promise<boolean> {
    const result = await this.client.auth.set({
      path: { id: providerId },
      body: { type: "api", key },
    });
    return result.data || result;
  }

  /**
   * Close local server if running
   */
  close(): void {
    if (this.server) {
      this.server.close();
      console.log("✓ OpenCode server closed");
    }
  }
}

/**
 * Helper function to create OpenCode controller
 */
export function createOpenCodeController(options?: { baseUrl?: string; isLocal?: boolean }): OpenCodeController {
  return new OpenCodeController(options);
}

export default OpenCodeController;
