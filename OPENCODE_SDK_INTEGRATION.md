# OpenCode SDK Integration - Implementation Guide

## Overview

The Computer Use Agent now fully supports the **@opencode-ai/sdk**, providing a modern, type-safe approach to agent control and task execution.

## What Changed

### Added Files
- `src/opencode-agent.ts` - Main OpencodeComputerAgent implementation
- `src/opencode-main.ts` - Example usage
- `src/opencode-examples.ts` - Comprehensive examples
- `OPENCODE_SDK.md` - Complete API documentation

### Updated Files
- `package.json` - Added `@opencode-ai/sdk` dependency and new scripts
- `.env.example` - Added OpenCode configuration options

### Existing Files (Unchanged)
- `src/index.ts` - Original E2B + Anthropic approach still works
- `src/interactive.ts` - Original interactive mode still works
- All documentation remains relevant

## Two Approaches Now Available

Your Computer Use Agent now supports **two complementary approaches**:

### 1. Legacy Approach (Still Available)
**Files**: `src/index.ts`, `src/interactive.ts`
```bash
npm start              # Runs E2B + Anthropic approach
npm run interactive    # Interactive session
```

**Features**:
- E2B Desktop Sandbox for desktop control
- Anthropic Claude or MiniMax M2.1 via OpenCode Zen
- Vision-based screenshot analysis
- Desktop application control

**Best for**: Desktop automation, screenshot-based tasks

### 2. New OpenCode SDK Approach
**Files**: `src/opencode-agent.ts`, `src/opencode-main.ts`
```bash
npm run opencode       # Runs OpenCode SDK approach
npm run opencode:examples  # Run examples
```

**Features**:
- Type-safe OpenCode SDK client
- Native session management
- File search and operations
- Shell command execution
- Multi-provider support

**Best for**: Code agents, workspace automation, developer tools

## Architecture Comparison

### Legacy Architecture
```
Your App
  ↓
Anthropic SDK
  ↓
OpenCode Zen Gateway (optional)
  ↓
MiniMax M2.1 / Claude
  ↓
E2B Desktop Sandbox (for screenshots)
  ↓
Desktop Environment
```

### OpenCode SDK Architecture
```
Your App
  ↓
OpenCode SDK Client
  ↓
OpenCode Server
  ↓
Provider (Claude / MiniMax / etc)
  ↓
Environment (Files, Shell, Plugins)
```

## When to Use Each Approach

### Use Legacy Approach If:
- ✓ You need desktop control (clicks, typing, screenshots)
- ✓ You're automating web browsers or GUI applications
- ✓ You need vision-based interaction
- ✓ You're building a computer use agent (in the traditional sense)

### Use OpenCode SDK If:
- ✓ You need code understanding and generation
- ✓ You want file operations and search
- ✓ You need shell command execution
- ✓ You want type-safe interfaces
- ✓ You're building a developer agent

## Quick Start with OpenCode SDK

### 1. Installation

```bash
npm install
```

### 2. Basic Usage

```typescript
import OpencodeComputerAgent from "./src/opencode-agent";

const agent = new OpencodeComputerAgent();
await agent.initialize();
await agent.createSession("My Task");

// Send prompts
await agent.prompt("What is my project structure?");

// Execute commands
await agent.shell("npm list");

// Search files
const files = await agent.findFiles("*.ts");

// Get conversation
const messages = await agent.getMessages();

await agent.cleanup();
```

### 3. Run Built-in Examples

```bash
# Main demo
npm run opencode

# All examples
npm run opencode:examples
```

## OpencodeComputerAgent Features

### Complete API
```typescript
// Initialization
async initialize(useExistingServer?: boolean)

// Sessions
async createSession(title?: string)
async listSessions()
getCurrentSession()
async deleteSession(sessionId?: string)

// Communication
async prompt(message, options?)
async command(text, options?)
async shell(command)

// Conversation Management
async getMessages(sessionId?)
async getMessage(messageId)
async revert(messageId, description?)

// File Operations
async findFiles(query, options?)
async findText(pattern)
async readFile(path)

// Configuration
async getProviders()

// Cleanup
async cleanup()
```

## Configuration

### Environment Variables

```env
# OpenCode Server
OPENCODE_HOST=127.0.0.1
OPENCODE_PORT=4096
OPENCODE_MODEL=anthropic/claude-3-5-sonnet-20241022
OPENCODE_SERVER_URL=http://localhost:4096

# For legacy approach (still supported)
OPENCODE_ZEN_API_KEY=your_key_here
E2B_API_KEY=your_key_here
```

### Programmatic Configuration

```typescript
const agent = new OpencodeComputerAgent({
  hostname: "127.0.0.1",
  port: 4096,
  model: "anthropic/claude-3-5-sonnet-20241022",
  timeout: 5000
});

// Or connect to existing server
const agent = new OpencodeComputerAgent({
  serverUrl: "http://localhost:4096"
});
```

## Type Safety

Full TypeScript support with types from the SDK:

```typescript
import type { 
  Session, 
  Message, 
  Part 
} from "@opencode-ai/sdk";

const session: Session = await agent.createSession();
const messages: Message[] = await agent.getMessages();
const part: Part = messages[0].parts[0];
```

## Examples Included

### 1. Basic Prompt (`exampleBasicPrompt`)
Simple question and answer

### 2. Shell Commands (`exampleShellCommand`)
Execute system commands

### 3. File Operations (`exampleFileOperations`)
Search and read files

### 4. Multi-turn (`exampleMultiTurn`)
Follow-up conversations

### 5. Complex Tasks (`exampleComplexTask`)
Multi-step workflows

### 6. Error Handling (`exampleErrorHandling`)
Proper error management

### 7. Existing Server (`exampleExistingServer`)
Connect to running server

## Available Providers

### Anthropic
```typescript
model: {
  providerID: "anthropic",
  modelID: "claude-3-5-sonnet-20241022"
}
```

### OpenCode Zen (MiniMax)
```typescript
model: {
  providerID: "opencode-zen",
  modelID: "minimax-m2.1-free"
}
```

## Response Handling

Messages contain parts with different types:

```typescript
const response = await agent.prompt("Hello");

response.parts.forEach(part => {
  if (part.type === "text") {
    console.log("Text:", (part as any).text);
  } else if (part.type === "error") {
    console.error("Error:", (part as any).text);
  } else if (part.type === "shell") {
    console.log("Command output:", (part as any).text);
  }
});
```

## Session Management

Sessions maintain conversation state:

```typescript
// Create session
const session = await agent.createSession("Analysis Task");

// Multiple prompts in same session
await agent.prompt("What is the structure?");
await agent.prompt("Show me the main files");
await agent.prompt("Analyze the code");

// All messages stored
const messages = await agent.getMessages();
console.log(`Session has ${messages.length} messages`);
```

## Context Injection

Add context without triggering a response:

```typescript
// Inject system prompt
await agent.prompt("You are an expert code reviewer", { 
  noReply: true 
});

// Now ask questions with context
await agent.prompt("Review this code");
```

## Shell Integration

Execute commands and ask about results:

```typescript
// Run command
const result = await agent.shell("git status");

// Ask AI to interpret
await agent.prompt("Based on git status, what should we do next?");
```

## File Search

Find and analyze files:

```typescript
// Find TypeScript files
const files = await agent.findFiles("*.ts", { limit: 20 });

// Read analyze one
const content = await agent.readFile(files[0]);

// Search for patterns
const matches = await agent.findText("export class");

// Ask AI about it
await agent.prompt(`Explain this code structure: ${content.content}`);
```

## Error Handling

```typescript
import OpencodeComputerAgent from "./opencode-agent";

try {
  const agent = new OpencodeComputerAgent();
  await agent.initialize();
  await agent.createSession("Task");
  
  // Do work
  await agent.prompt("Your question");
  
} catch (error) {
  console.error("Agent error:", error instanceof Error ? error.message : error);
} finally {
  await agent.cleanup();  // Always cleanup
}
```

## Performance Tips

1. **Reuse Sessions**: Don't create new session for each query
2. **Batch Operations**: Ask multiple questions per session
3. **Lazy Loading**: Read files only when needed
4. **Timeout Config**: Increase for slow servers
5. **Connection Pooling**: Reuse client instances

## Deployment

### Local Development
```bash
npm run opencode
```

### Production Server
```bash
# Run server separately
opencode server --port 4096

# Connect from code
const agent = new OpencodeComputerAgent({
  serverUrl: "http://production-server:4096"
});
await agent.initialize(true);  // Connect to existing
```

### Docker
```bash
docker run -p 4096:4096 opencode-server:latest
```

## Integration with Existing Code

The OpenCode SDK approach is **independent** of the legacy approach:

```typescript
// Both can coexist
import { ComputerUseAgent } from "./index";        // Legacy
import OpencodeComputerAgent from "./opencode-agent";  // New

// Use whichever fits your needs
const legacyAgent = new ComputerUseAgent();
const opencodeAgent = new OpencodeComputerAgent();
```

## What's Next

### Immediate
- [ ] Run `npm run opencode` to test
- [ ] Try examples with `npm run opencode:examples`
- [ ] Read [OPENCODE_SDK.md](OPENCODE_SDK.md) for detailed API

### Short-term
- [ ] Build your first OpenCode task
- [ ] Integrate into your workflow
- [ ] Combine with legacy approach if needed

### Long-term
- [ ] Monitor for SDK updates
- [ ] Contribute to OpenCode community
- [ ] Build plugins for custom functionality

## Troubleshooting

### Port Already in Use
```typescript
// Use different port
new OpencodeComputerAgent({ port: 4097 })
```

### Connection Refused
```typescript
// Check server is running
// Or specify correct server URL
new OpencodeComputerAgent({ 
  serverUrl: "http://your-server:4096" 
})
```

### Type Errors
```bash
# Ensure TypeScript is up to date
npm install --save-dev typescript@latest
npx tsc --version
```

## Resources

- **OpenCode Repository**: https://github.com/opencode-ai/sdk
- **Complete API Docs**: [OPENCODE_SDK.md](OPENCODE_SDK.md)
- **Examples**: [src/opencode-examples.ts](../src/opencode-examples.ts)
- **Main Entry**: [src/opencode-main.ts](../src/opencode-main.ts)

## Summary

You now have **two powerful approaches**:

1. **Legacy (Desktop Focused)** - E2B + Anthropic
   - Desktop automation
   - GUI control
   - Screenshot analysis

2. **New (Developer Focused)** - OpenCode SDK
   - Code understanding
   - File operations
   - Shell integration
   - Type-safe APIs

**Choose the one that fits your use case, or use both together!**

---

**Ready to get started?**

```bash
npm run opencode
```

See [OPENCODE_SDK.md](OPENCODE_SDK.md) for complete API reference.
