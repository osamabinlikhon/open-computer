# Computer Use Agent

A powerful computer-using agent with **two complementary approaches**:

1. **Legacy Approach**: E2B Desktop Sandbox + MiniMax M2.1 (via OpenCode Zen) for desktop automation
2. **New Approach**: OpenCode SDK for code agents and developer tools

The agent can autonomously control a desktop, launch applications, execute commands, search code, and perform complex tasks by understanding visual feedback and executing precise interactions.

## Two Approaches

### 🖥️ Desktop Automation (Legacy)
Built with E2B Desktop Sandbox and MiniMax M2.1
- Vision-based desktop control
- Click, type, scroll, and app launching
- Screenshot feedback
- Perfect for GUI automation

```bash
npm start              # Run desktop agent
npm run interactive    # Interactive mode
```

### 💻 Developer Tools (New - OpenCode SDK)
Built with @opencode-ai/sdk
- Type-safe session management
- File search and operations
- Shell command execution
- Code understanding
- Perfect for code agents

```bash
npm run opencode            # Run OpenCode agent
npm run opencode:examples   # See examples
npm run sdk:examples        # SDK usage examples (1-5)
npm run sdk:integrated      # Integrated agent demos (1-5)
```

## Features

✨ **Vision-Based Control** - MiniMax M2.1's vision for desktop understanding  
🤖 **Autonomous Execution** - Multi-step task planning and execution  
🖥️ **Desktop Streaming** - E2B Sandbox for remote desktop access  
⌨️ **Full Input Control** - Click, type, press keys, scroll, launch apps  
📸 **Screenshot Feedback** - Real-time visual feedback  
💻 **Code Agent APIs** - Type-safe OpenCode SDK integration  
🔄 **Conversation History** - Context across multiple turns  
🔍 **File Operations** - Search and analyze workspace  
🔨 **Shell Commands** - Execute system commands  

## Prerequisites

- Node.js 16+ and npm
- E2B API Key ([sign up](https://e2b.dev))
- OpenCode Zen API Key ([get key](https://opencode.ai/zen))

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd open-computer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   E2B_API_KEY=your_e2b_api_key_here
   OPENCODE_ZEN_API_KEY=your_opencode_zen_api_key_here
   OPENCODE_ZEN_MODEL=minimax-m2.1-free
   OPENCODE_MODEL=anthropic/claude-3-5-sonnet-20241022
   ```

## Quick Start

### Desktop Agent (Legacy)

```bash
npm start              # Automated examples
npm run interactive    # Interactive session
```

### OpenCode Agent (New)

```bash
npm run opencode           # Main example
npm run opencode:examples  # All examples
```
- Clean up resources

### Run Interactive Mode

For real-time interaction with the desktop:

```bash
npm run dev -- src/interactive.ts
```

Then type commands like:
- "Open Google Chrome and search for Node.js"
- "Launch VS Code and create a new file"
- "Take a screenshot and tell me what you see"

## Project Structure

```
open-computer/
├── src/
│   ├── index.ts                 # Main agent implementation
│   ├── interactive.ts           # Interactive session mode
│   ├── desktop-controller.ts    # Desktop control utilities
│   ├── tools.ts                 # Tool definitions
│   ├── config.ts                # Configuration
│   ├── opencode-client.ts       # OpenCode SDK wrapper
│   ├── sdk-examples.ts          # SDK usage examples
│   └── integrated-agent.ts      # Combined agent demos
├── package.json
├── tsconfig.json
├── .env.example
├── SDK_GUIDE.md                 # SDK documentation
└── README.md
```

## Available Tools

The agent has access to the following tools:

### `screenshot`
Captures the current desktop state for visual feedback.

```typescript
await agent.chat("Show me what's on the screen");
```

### `click`
Clicks at specified coordinates on the desktop.

```typescript
await agent.chat("Click on the search bar at (50, 50)");
```

### `type`
Types text into the focused element.

```typescript
await agent.chat("Type 'Hello World' into the text field");
```

### `key`
Presses keyboard keys.

```typescript
await agent.chat("Press Enter to submit the form");
```

### `scroll`
Scrolls the screen up or down.

```typescript
await agent.chat("Scroll down to see more content");
```

### `launch_app`
Launches desktop applications.

```typescript
await agent.chat("Launch Google Chrome");
```

### `wait`
Waits for a specified duration in milliseconds.

```typescript
await agent.chat("Wait 3 seconds for the page to load");
```

## Usage Examples

### Example 1: Web Research
```typescript
const agent = new ComputerUseAgent();
await agent.initialize();
await agent.chat("Search for 'best TypeScript practices' on Google");
await agent.cleanup();
```

### Example 2: File Creation
```typescript
const agent = new ComputerUseAgent();
await agent.initialize();
await agent.chat("Open VS Code and create a file called 'example.ts' with content 'console.log(\"Hello\")'");
await agent.cleanup();
```

### Example 3: Complex Workflow
```typescript
const agent = new ComputerUseAgent();
await agent.initialize();

// Multi-step task
await agent.chat("1. Open Chrome and go to github.com");
await agent.chat("2. Search for 'computer use agent'");
await agent.chat("3. Take a screenshot of the results");

await agent.cleanup();
```

## API Reference

### ComputerUseAgent

Main agent class for autonomous task execution.

#### Methods

- `initialize()` - Set up the desktop sandbox
- `chat(message: string)` - Send a task instruction and wait for completion
- `takeScreenshot()` - Capture current desktop state
- `executeToolCall()` - Execute a specific tool directly
- `cleanup()` - Shut down the sandbox

### DesktopController

Low-level desktop control utilities.

```typescript
const controller = new DesktopController(sandbox);
await controller.click({ x: 100, y: 100 });
await controller.type("Hello");
await controller.pressKey("Return");
```

## Configuration

Edit `src/config.ts` to customize:

```typescript
export const CONFIG = {
  claude: {
    model: "claude-3-5-sonnet-20241022",
    maxTokens: 4096,
  },
  desktop: {
    screenshotWaitMs: 1000,
    appLaunchWaitMs: 3000,
  },
  agent: {
    verbose: true,
    saveScreenshots: false,
  },
};
```

## Limitations

⚠️ **Important Notes:**

- Only one stream can be active at a time
- Applications must be launched before streaming
- Complex drag operations may have limited support
- Some keyboard combinations may not work as expected
- Desktop resources are limited in sandbox environment

## Best Practices

1. **Wait Between Actions** - Use `wait` tool between rapid actions
2. **Verify Screenshots** - Always check screenshots to confirm actions
3. **Handle Errors** - Wrap operations in try-catch blocks
4. **Resource Cleanup** - Always call `cleanup()` to free resources
5. **Use Relative Waits** - Let the agent decide timing rather than fixed delays

## Troubleshooting

### Connection Errors
```bash
# Check your API keys
echo $E2B_API_KEY
echo $ANTHROPIC_API_KEY

# Test E2B connectivity
npm run test-e2b
```

### Application Won't Launch
- Ensure the application is available in the sandbox
- Add more wait time after launch
- Try alternative applications if specific ones fail

### Vision Feedback Issues
- Ensure screenshots are being captured
- Check that Claude can see the screen
- Verify image format and size

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run dev
```

### Type Checking
```bash
npx tsc --noEmit
```

## License

MIT

## Support

For issues and questions:
- E2B Documentation: https://docs.e2b.dev
- Claude API Docs: https://docs.anthropic.com
- GitHub Issues: [Create an issue in the repository]

## API Reference

For detailed API documentation, see [API.md](API.md).