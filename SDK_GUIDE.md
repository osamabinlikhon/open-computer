# OpenCode SDK Integration

This document describes how to use the **@opencode-ai/sdk** with the Computer Use Agent.

## Overview

The OpenCode SDK provides programmatic control over OpenCode, allowing you to:
- Create and manage sessions
- Send prompts and commands
- Control the TUI interface
- Search files and read content
- Subscribe to real-time events

## Quick Start

### 1. Install Dependencies

The SDK is already included in this project:

```bash
npm install
```

### 2. Start OpenCode Server

Make sure you have OpenCode running:

```bash
# In a separate terminal
opencode
```

By default, OpenCode runs on `http://localhost:4096`.

### 3. Run SDK Examples

```bash
# Run all examples
npm run sdk:examples

# Or run specific example
npm run sdk:examples 1    # Connect to existing server
npm run sdk:examples 2    # Start local server
npm run sdk:examples 3    # TUI Control
npm run sdk:examples 4    # Event Streaming
npm run sdk:examples 5    # File Operations
npm run sdk:examples all  # Run multiple examples
```

## SDK Components

### OpenCodeController

The `OpenCodeController` class wraps the SDK for easy use:

```typescript
import { createOpenCodeController } from "./opencode-client.js";

// Connect to existing server
const controller = createOpenCodeController({
  baseUrl: "http://localhost:4096",
});

// Or start local server
const controller = createOpenCodeController({ isLocal: true });
await controller.initializeLocal({ port: 4096 });
```

### Session Management

```typescript
// Create a session
const session = await controller.createSession("My Session");

// Send a prompt
await controller.sendPrompt(session.id, "Hello, analyze this code");

// Get messages
const messages = await controller.getMessages(session.id);

// Delete session
await controller.deleteSession(session.id);
```

### File Operations

```typescript
// Search for text
const results = await controller.findText("function.*main");

// Find files
const files = await controller.findFiles("*.ts");

// Read file
const content = await controller.readFile("package.json");
```

### TUI Control

```typescript
// Show toast notification
await controller.showToast("Task completed!", "success");

// Append to prompt
await controller.appendToPrompt("Fix this bug");

// Submit prompt
await controller.submitPrompt();

// Open help
await controller.openHelp();
```

## Integrated Agent

The **Integrated Agent** combines the Computer Use Agent with the OpenCode SDK:

```bash
# Run integrated demos
npm run sdk:integrated 1    # OpenCode controls computer
npm run sdk:integrated 2    # Computer controls OpenCode UI
npm run sdk:integrated 3    # Bidirectional integration
npm run sdk:integrated 4    # Automated workflow
npm run sdk:integrated 5    # File operations with visual feedback
npm run sdk:integrated all  # Run multiple use cases
```

### Use Cases

#### 1. OpenCode Controls Computer
OpenCode sends high-level commands, the Computer Use Agent executes them on the desktop.

#### 2. Computer Controls OpenCode
The Computer Use Agent interacts with OpenCode through its UI (clicking, typing).

#### 3. Bidirectional Integration
Both systems work together - SDK for data, Computer Agent for visual feedback.

#### 4. Automated Workflows
Complete end-to-end automation using both systems.

#### 5. Visual File Operations
SDK performs file operations while Computer Agent provides visual confirmation.

## API Reference

### Global Methods

| Method | Description |
|--------|-------------|
| `health()` | Check server health |
| `listAgents()` | List available agents |
| `getCurrentProject()` | Get current project info |
| `listProjects()` | List all projects |
| `getCurrentPath()` | Get current working directory |
| `getConfig()` | Get OpenCode configuration |

### Session Methods

| Method | Description |
|--------|-------------|
| `createSession(title)` | Create new session |
| `listSessions()` | List all sessions |
| `getSession(id)` | Get session by ID |
| `sendPrompt(id, text)` | Send text prompt |
| `sendCommand(id, command)` | Send slash command |
| `runShell(id, command)` | Run shell command |
| `getMessages(id)` | Get session messages |
| `deleteSession(id)` | Delete session |

### File Methods

| Method | Description |
|--------|-------------|
| `findText(pattern)` | Search text in files |
| `findFiles(query, type)` | Find files/directories |
| `readFile(path)` | Read file content |

### TUI Methods

| Method | Description |
|--------|-------------|
| `showToast(message, variant)` | Show notification |
| `appendToPrompt(text)` | Append text to prompt |
| `submitPrompt()` | Submit current prompt |
| `clearPrompt()` | Clear prompt |
| `openHelp()` | Open help dialog |
| `openSessions()` | Open session selector |

## Configuration

Set these environment variables in your `.env` file:

```bash
# OpenCode connection (optional - defaults to localhost:4096)
OPENCODE_BASE_URL=http://localhost:4096
```

## Examples

### Basic Usage

```typescript
import { createOpenCodeController } from "./opencode-client.js";

async function main() {
  const controller = createOpenCodeController();
  
  // Check health
  const health = await controller.health();
  console.log(`OpenCode v${health.version} is running`);
  
  // Create session
  const session = await controller.createSession("Test");
  
  // Send prompt
  await controller.sendPrompt(session.id, "List all files");
  
  // Get response
  const messages = await controller.getMessages(session.id);
  console.log(messages);
  
  // Cleanup
  await controller.deleteSession(session.id);
}

main();
```

### With Computer Use Agent

```typescript
import ComputerUseAgent from "./index.js";
import { createOpenCodeController } from "./opencode-client.js";

async function combinedExample() {
  const computer = new ComputerUseAgent();
  const opencode = createOpenCodeController();
  
  await computer.initialize();
  
  // OpenCode analyzes task
  const session = await opencode.createSession("Analysis");
  await opencode.sendPrompt(session.id, "What files should I check?");
  
  // Computer agent executes
  await computer.chat("Open Chrome and navigate to the project");
  
  // Get results from OpenCode
  const messages = await opencode.getMessages(session.id);
  
  await computer.cleanup();
  await opencode.deleteSession(session.id);
}
```

## Troubleshooting

### Connection Refused
Make sure OpenCode is running on the specified port:
```bash
opencode --port 4096
```

### API Key Required
Some features may require authentication:
```typescript
await controller.setAuth("anthropic", "your-api-key");
```

### Event Streaming
To listen to real-time events:
```typescript
const events = await controller.subscribeToEvents();
for await (const event of events.stream) {
  console.log("Event:", event);
}
```

## Files Created

- `src/opencode-client.ts` - SDK wrapper class
- `src/sdk-examples.ts` - Usage examples
- `src/integrated-agent.ts` - Combined agent demos

## Next Steps

1. Start OpenCode: `opencode`
2. Run examples: `npm run sdk:examples`
3. Try integrated demos: `npm run sdk:integrated`
4. Build your own integrations!
