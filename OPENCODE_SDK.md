# OpenCode SDK Integration Guide

## Overview

The Computer Use Agent now includes native support for the **OpenCode SDK** (`@opencode-ai/sdk`), providing a type-safe, unified interface for agent communication and task execution.

This is a modern alternative to the previous approach of directly using Anthropic SDK + E2B Desktop.

## What is OpenCode?

OpenCode is a server that provides:
- **Unified Agent Interface** - Control agents through a consistent API
- **Session Management** - Multi-turn conversations with state
- **Multiple Providers** - Support for Claude, MiniMax, and more
- **Real-time Events** - Subscribe to server-sent events
- **File Operations** - Search and read workspace files
- **Shell Integration** - Execute commands in the host environment
- **Extensible** - Plugin architecture for custom functionality

## Quick Start

### 1. Installation

The SDK is already included in dependencies:

```bash
npm install
```

### 2. Basic Usage

```typescript
import OpencodeComputerAgent from "./opencode-agent";

const agent = new OpencodeComputerAgent();
await agent.initialize();
await agent.createSession("My Task");

// Send a prompt
await agent.prompt("What is OpenCode?");

// Get response
const messages = await agent.getMessages();

await agent.cleanup();
```

### 3. Run Examples

```bash
# Run main example
npm run opencode

# Run all examples
npm run opencode:examples
```

## OpencodeComputerAgent API

### Constructor

```typescript
new OpencodeComputerAgent(config?: {
  hostname?: string;      // Default: 127.0.0.1
  port?: number;          // Default: 4096
  model?: string;         // Default: anthropic/claude-3-5-sonnet-20241022
  timeout?: number;       // Default: 5000
  serverUrl?: string;     // For connecting to existing server
})
```

### Core Methods

#### `initialize(useExistingServer?: boolean)`
Start an OpenCode server or connect to an existing one.

```typescript
// Start new server
await agent.initialize();

// Connect to existing server
await agent.initialize(true);
```

#### `createSession(title?: string)`
Create a new session for task execution.

```typescript
const session = await agent.createSession("My Task");
// Returns: Session object with ID
```

#### `prompt(message: string, options?)`
Send a prompt and get a response.

```typescript
const response = await agent.prompt("What is AI?");

// Context-only (no AI response)
await agent.prompt("You are a helpful assistant.", { noReply: true });

// Specify model
await agent.prompt("Hello", {
  model: {
    providerID: "anthropic",
    modelID: "claude-3-5-sonnet-20241022"
  }
});
```

#### `shell(command: string)`
Execute a shell command.

```typescript
const result = await agent.shell("ls -la");
// Response with command output
```

#### `command(commandText: string, options?)`
Send a direct command to the agent.

```typescript
const result = await agent.command("list files in current directory");
```

#### `getMessages(sessionId?: string)`
Get all messages in a session.

```typescript
const messages = await agent.getMessages();
// Returns: Array of messages with their parts
```

#### `getMessage(messageId: string)`
Get a specific message.

```typescript
const message = await agent.getMessage("msg-123");
```

#### `revert(messageId: string, description?: string)`
Revert to a previous message state.

```typescript
await agent.revert("msg-123", "Reset to previous point");
```

#### `findFiles(query: string, options?)`
Search for files.

```typescript
const files = await agent.findFiles("*.ts", {
  type: "file",
  limit: 20
});
```

#### `findText(pattern: string)`
Search for text in files.

```typescript
const results = await agent.findText("function.*async");
```

#### `readFile(path: string)`
Read file contents.

```typescript
const file = await agent.readFile("src/index.ts");
console.log(file.content);
```

#### `listSessions()`
List all sessions.

```typescript
const sessions = await agent.listSessions();
```

#### `getCurrentSession()`
Get current session info.

```typescript
const session = agent.getCurrentSession();
```

#### `deleteSession(sessionId?: string)`
Delete a session.

```typescript
await agent.deleteSession();
```

#### `getProviders()`
Get available providers and models.

```typescript
const { providers, defaults } = await agent.getProviders();
```

#### `cleanup()`
Close server and cleanup resources.

```typescript
await agent.cleanup();
```

## Configuration

### Environment Variables

```env
# Server configuration
OPENCODE_HOST=127.0.0.1
OPENCODE_PORT=4096
OPENCODE_MODEL=anthropic/claude-3-5-sonnet-20241022
OPENCODE_SERVER_URL=http://localhost:4096

# Model providers
OPENCODE_ZEN_API_KEY=your_key_here
OPENCODE_ZEN_MODEL=minimax-m2.1-free

# E2B
E2B_API_KEY=your_key_here
```

### Programmatic Configuration

```typescript
const agent = new OpencodeComputerAgent({
  hostname: "127.0.0.1",
  port: 4096,
  model: "anthropic/claude-3-5-sonnet-20241022",
  timeout: 10000,
  serverUrl: "http://localhost:4096"
});
```

## Message Structure

Messages have a standard structure:

```typescript
interface Message {
  info: {
    id: string;
    type: "user" | "assistant";
    timestamp: string;
  };
  parts: Part[];
}

interface Part {
  type: "text" | "error" | "shell" | "tool" | "image";
  text?: string;  // For text/error types
  // Other properties depend on type
}
```

## Available Providers

The OpenCode server can use different AI providers:

- **Anthropic**
  - `anthropic/claude-3-5-sonnet-20241022`
  - `anthropic/claude-opus-4-1`
  - Other Claude models

- **OpenCode Zen (MiniMax)**
  - `minimax/minimax-m2.1-free`
  - Uses OpenCode Zen gateway

## Examples

### Example 1: Simple Prompt

```typescript
const agent = new OpencodeComputerAgent();
await agent.initialize();
await agent.createSession("Simple Example");

const response = await agent.prompt("What is TypeScript?");
console.log(response);

await agent.cleanup();
```

### Example 2: Multi-turn Conversation

```typescript
const agent = new OpencodeComputerAgent();
await agent.initialize();
await agent.createSession("Conversation");

// Turn 1
await agent.prompt("What is AI?");

// Turn 2
await agent.prompt("Tell me about machine learning");

// Turn 3
await agent.prompt("How does neural networks work?");

// Get history
const messages = await agent.getMessages();
messages.forEach((msg, i) => {
  console.log(`Turn ${i + 1}: ${msg.info.type}`);
});

await agent.cleanup();
```

### Example 3: Shell Integration

```typescript
const agent = new OpencodeComputerAgent();
await agent.initialize();
await agent.createSession("Shell Example");

// Execute commands
const result = await agent.shell("npm list");

// Ask followup
await agent.prompt("Based on the output, what dependencies do we have?");

await agent.cleanup();
```

### Example 4: File Search

```typescript
const agent = new OpencodeComputerAgent();
await agent.initialize();

// Find files
const files = await agent.findFiles("*.ts", { type: "file", limit: 10 });

// Search in files
const matches = await agent.findText("export class");

// Read a file
const content = await agent.readFile(files[0]);

await agent.cleanup();
```

### Example 5: Connect to Existing Server

```typescript
const agent = new OpencodeComputerAgent({
  serverUrl: "http://production-server:4096"
});

// Connect to running server
await agent.initialize(true);

// Use it like before
const sessions = await agent.listSessions();

// Don't call cleanup() - don't shut down production server!
```

## Comparison with Legacy Approach

| Feature | Legacy (E2B + Anthropic) | OpenCode SDK |
|---------|------------------------|------------|
| **Message Format** | Custom | Standardized |
| **Session Management** | Manual | Built-in |
| **Multi-provider** | No | Yes |
| **File Operations** | Limited | Full |
| **Shell Commands** | No | Yes |
| **Type Safety** | Partial | Full |
| **Configuration** | Environment vars | API + env |
| **Testing** | Complex | Simple |
| **Extensibility** | Limited | Plugins |

## Migration Path

The OpenCode SDK approach is **complementary** to the legacy approach:

### From Legacy Code:

```typescript
// Old way
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();
const response = await client.messages.create(...);

// New way with OpenCode
const agent = new OpencodeComputerAgent();
await agent.initialize();
await agent.createSession("Task");
await agent.prompt(...);
```

## Error Handling

```typescript
try {
  await agent.prompt("Your prompt");
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}
```

## Performance Characteristics

| Operation | Time |
|-----------|------|
| Server start | ~1-2s |
| Create session | ~100ms |
| Prompt response | ~1-5s |
| Shell command | ~500ms-2s |
| File read | ~50ms |
| List messages | ~100ms |

## Best Practices

1. **Always cleanup**: Call `cleanup()` to close the server
2. **Reuse sessions**: Create one session per task
3. **Error handling**: Wrap operations in try-catch
4. **Batch operations**: Use multiple prompts in one session
5. **Type safety**: Use TypeScript for IDE support

```typescript
const agent = new OpencodeComputerAgent();
try {
  await agent.initialize();
  await agent.createSession("Task");
  
  // Do work
  await agent.prompt("...");
  
} catch (error) {
  console.error(error);
} finally {
  await agent.cleanup();  // Always cleanup
}
```

## Troubleshooting

### Port already in use
```
Error: EADDRINUSE: address already in use :::4096
```

Solution:
```typescript
// Use different port
new OpencodeComputerAgent({ port: 4097 })

// Or connect to existing server
new OpencodeComputerAgent({ serverUrl: "http://localhost:4096" })
```

### Server timeout
```
Error: Timeout waiting for server
```

Solution:
```typescript
// Increase timeout
new OpencodeComputerAgent({ timeout: 10000 })
```

### Model not found
```
Error: Model not found
```

Solution:
```typescript
// Check available models
const providers = await agent.getProviders();
console.log(providers.providers);
```

## Advanced Topics

### Custom Models

```typescript
await agent.prompt("Question", {
  model: {
    providerID: "custom-provider",
    modelID: "custom-model"
  }
});
```

### Event Streaming (Planned)

```typescript
// Listen to real-time events
const events = await client.event.subscribe();
for await (const event of events.stream) {
  console.log(event);
}
```

### Plugin System (Planned)

Custom plugins can extend OpenCode functionality with additional commands and capabilities.

## Resources

- **OpenCode Repository**: https://github.com/opencode-ai/sdk
- **API Documentation**: See project documentation
- **Community Projects**: https://opencode.ai/community
- **Examples**: [src/opencode-examples.ts](../src/opencode-examples.ts)

## Running Tests

```bash
# Run basic example
npm run opencode

# Run all examples  
npm run opencode:examples

# Type checking
npx tsc --noEmit
```

## Next Steps

1. **Start a server**: `npm run opencode`
2. **Try examples**: `npm run opencode:examples`
3. **Build your task**: Create a new file similar to `opencode-main.ts`
4. **Deploy**: OpenCode servers can run anywhere

## License

MIT

## Support

See [README.md](../README.md) for general support and troubleshooting.
