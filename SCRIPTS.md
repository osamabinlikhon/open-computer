# Available Scripts

Quick reference for all available npm scripts in the Computer Use Agent project.

## Development

### `npm run dev`
Watch mode for `src/index.ts` - enables hot reload during development
```bash
npm run dev
```

### `npm run build`
Compile TypeScript to JavaScript
```bash
npm run build
```

### `npm run start`
Run the desktop agent with predefined tasks
```bash
npm start
```

## Desktop Agent (Legacy Approach)

These scripts use E2B Desktop Sandbox + MiniMax M2.1 (or Claude)

### `npm run interactive`
Start an interactive session with the desktop agent
```bash
npm run interactive
# Then type commands like:
# > Open Chrome and search for "TypeScript"
# > Launch VS Code and create a file
```

## OpenCode Agent (New Approach)

These scripts use the OpenCode SDK for code agents and developer tools

### `npm run opencode`
Run the main OpenCode agent example
```bash
npm run opencode
# Demonstrates:
# - Session management
# - Prompts
# - Shell commands
# - File operations
# - Conversation history
# - Provider listing
```

### `npm run opencode:examples`
Run OpenCode agent examples
```bash
npm run opencode:examples
# Runs:
# 1. Basic prompt
# 2. Shell command execution
# 3. File operations
# 4. Multi-turn conversation
# 5. Existing server connection
# 6. Complex tasks
# 7. Error handling
```

### `npm run sdk:examples`
Run OpenCode SDK usage examples (requires OpenCode running on localhost:4096)
```bash
npm run sdk:examples        # Run example 1 (default)
npm run sdk:examples 1      # Connect to existing server
npm run sdk:examples 2      # Start local server
npm run sdk:examples 3      # TUI Control
npm run sdk:examples 4      # Event Streaming
npm run sdk:examples 5      # File Operations
npm run sdk:examples all    # Run all examples
```

### `npm run sdk:integrated`
Run integrated agent demos (combines Computer Use + OpenCode SDK)
```bash
npm run sdk:integrated        # Run use case 1 (default)
npm run sdk:integrated 1      # OpenCode controls computer
npm run sdk:integrated 2      # Computer controls OpenCode UI
npm run sdk:integrated 3      # Bidirectional integration
npm run sdk:integrated 4      # Automated workflow
npm run sdk:integrated 5      # File operations with visual feedback
npm run sdk:integrated all    # Run multiple use cases
```

**Prerequisites:**
- OpenCode running on localhost:4096 (run `opencode` in separate terminal)
- E2B API key configured

## Diagnostics & Testing

### `npm run diagnose`
Check system setup and API connectivity
```bash
npm run diagnose
# Verifies:
# - API keys are set
# - E2B connectivity
# - OpenCode Zen connectivity
# - Node.js version
```

### `npm run test`
Run diagnostic tests (same as diagnose)
```bash
npm run test
```

## Web UI (Under Development)

### `npm run ui`
Start the Next.js web interface
```bash
npm run ui
# Runs on http://localhost:3000
```

## Complete Reference

| Script | Purpose | Approach | Command |
|--------|---------|----------|---------|
| `dev` | Watch mode | Dev | `tsx watch src/index.ts` |
| `build` | Compile TS | Build | `tsc` |
| `start` | Run agent | Desktop | `tsx src/index.ts` |
| `interactive` | Interactive mode | Desktop | `tsx src/interactive.ts` |
| `diagnose` | Check setup | Test | `tsx src/diagnose.ts` |
| `test` | Run tests | Test | `tsx src/test.ts` |
| `opencode` | OpenCode example | OpenCode | `tsx src/opencode-main.ts` |
| `opencode:examples` | OpenCode examples | OpenCode | `tsx src/opencode-examples.ts` |
| `sdk:examples` | SDK usage examples | SDK | `tsx src/sdk-examples.ts` |
| `sdk:integrated` | Integrated demos | Both | `tsx src/integrated-agent.ts` |
| `ui` | Web interface | UI | `next dev` |

## Workflow Examples

### Setting Up a New Machine

```bash
npm install              # Install dependencies
npm run diagnose        # Check everything is configured
npm start               # Verify desktop agent works
npm run opencode        # Verify OpenCode SDK works
```

### Desktop Automation Task

```bash
npm start               # Run automated examples
# or
npm run interactive     # Interactive session
```

### Code Agent Task

```bash
npm run opencode        # Run with built examples
# or
npm run opencode:examples  # See all examples
```

### Development

```bash
npm run build           # Build project
npm run dev             # Watch mode (with tsx)
npm run diagnose        # Verify setup
```

### Troubleshooting

```bash
npm run diagnose        # Check all systems
npm run test           # Run diagnostics
npm install            # Reinstall if broken
npm run build          # Rebuild TypeScript
```

## Environment Setup

Before running scripts, ensure `.env` is configured:

```bash
cp .env.example .env
# Edit .env with your API keys
nano .env
```

Required keys:
- `E2B_API_KEY` - For E2B Desktop Sandbox
- `OPENCODE_ZEN_API_KEY` - For OpenCode Zen gateway
- `OPENCODE_ZEN_MODEL` - Model for Zen (default: minimax-m2.1-free)
- `OPENCODE_MODEL` - OpenCode SDK model (default: anthropic/claude-3-5-sonnet-20241022)

## Script Dependencies

```
npm install
  ↓
npm run diagnose  (verify setup)
  ↓
npm start  OR  npm run opencode
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - TypeScript compilation error
- `127` - Command not found (usually npm not installed)

## Troubleshooting Scripts

### Scripts not found?
```bash
npm install
npm run build
```

### Port already in use?
```typescript
// Edit src/opencode-main.ts to use different port
new OpencodeComputerAgent({ port: 4097 })
```

### Timeout errors?
```typescript
// Edit src/config.ts to increase timeout
timeout: 60000  // 60 seconds instead of 30
```

### API key issues?
```bash
npm run diagnose
# Check output for missing keys
cat .env
# Verify keys are set
```

## Advanced

### Custom Scripts

Create your own script in `package.json`:

```json
{
  "scripts": {
    "my-task": "tsx src/my-task.ts"
  }
}
```

Then run:
```bash
npm run my-task
```

### Environment-based Execution

```bash
NODE_ENV=production npm start
E2B_API_KEY=xxx npm run diagnose
OPENCODE_PORT=5000 npm run opencode
```

## Help & Documentation

- Detailed API: [API.md](./API.md)
- OpenCode SDK: [OPENCODE_SDK.md](./OPENCODE_SDK.md)
- OpenCode Integration: [OPENCODE_SDK_INTEGRATION.md](./OPENCODE_SDK_INTEGRATION.md)
- **SDK Integration Guide: [SDK_GUIDE.md](./SDK_GUIDE.md)**
- **SDK Integration Summary: [SDK_INTEGRATION_SUMMARY.md](./SDK_INTEGRATION_SUMMARY.md)**
- Migration Guide: [MIGRATION.md](./MIGRATION.md)
- Quick Start: [QUICK_START.md](./QUICK_START.md)

## Tips

1. **Use `npm run diagnose` first** - Verify setup before troubleshooting
2. **Terminal sessions** - Some scripts require terminal to remain open
3. **Cleanup** - Agents cleanup resources on exit or error
4. **Logging** - All scripts log to console, no log files by default
5. **Development** - Use `npm run dev` for instant feedback

---

**For more help, see documentation files or run `npm run diagnose`**
