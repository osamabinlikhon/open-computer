# Computer Use Agent - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Setup

1. **Get your API keys**
   - E2B API Key: https://e2b.dev (sign up and get your key)
   - OpenCode Zen API Key: https://opencode.ai/zen (sign up and get your key)

2. **Clone and install**
   ```bash
   cd open-computer
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   nano .env
   ```

4. **Verify setup**
   ```bash
   npm run diagnose
   ```
   Should see: ✓ All systems operational!

### Run Your First Agent

```bash
npm start
```

This will:
- Create a desktop sandbox
- Launch Chrome
- Perform a web search
- Open VS Code
- Create a file
- Clean up

## 📋 Common Tasks

### Task: Search the Web
```bash
npm run interactive
```
Then type:
```
Search Wikipedia for "Artificial Intelligence" and take a screenshot
```

### Task: Create a Document
```bash
npm run interactive
```
Then type:
```
Open a text editor and create a file called "my-notes.txt" with content about TypeScript
```

### Task: Code Development
```bash
npm run interactive
```
Then type:
```
Open VS Code and write a function to calculate factorial in Python
```

## 🔧 Advanced Usage

### Custom Script
Create `my-task.ts`:

```typescript
import { ComputerUseAgent } from './src/index';

async function myTask() {
  const agent = new ComputerUseAgent();
  await agent.initialize();
  
  // Your task here
  await agent.chat("Do something specific");
  
  await agent.cleanup();
}

myTask().catch(console.error);
```

Run with:
```bash
npx tsx my-task.ts
```

### Using DesktopController Directly
```typescript
import { DesktopController } from './src/desktop-controller';
import { Sandbox } from '@e2b/desktop';

async function example() {
  const sandbox = await Sandbox.create();
  const controller = new DesktopController(sandbox);
  
  // Take screenshot
  await controller.takeScreenshot();
  
  // Click at coordinates
  await controller.click({ x: 100, y: 100 });
  
  // Type text
  await controller.type("Hello");
  
  // Press key
  await controller.pressEnter();
  
  await sandbox.kill();
}
```

## 🎯 Popular Use Cases

| Use Case | Command | Duration |
|----------|---------|----------|
| **Web Search** | `npm run interactive` + Search query | ~30s |
| **File Creation** | `npm run interactive` + Create file task | ~20s |
| **Research** | `npm run interactive` + Multiple searches | ~2min |
| **Form Filling** | `npm run interactive` + Fill form task | ~1min |
| **Code Writing** | `npm run interactive` + Write code task | ~2min |

## 📊 Monitoring

### Check Agent Status
```bash
npm run diagnose
```

### View Logs
All agent activities are logged to console. For verbose output:

```typescript
// In src/config.ts
agent: {
  verbose: true,  // Set to true for detailed logs
  saveScreenshots: true,  // Save screenshots to disk
}
```

## 🚨 Troubleshooting

### "API key not found"
```bash
# Check if .env is set up
cat .env
# Should show your API keys
```

### "Application won't launch"
```typescript
// Try waiting longer
await agent.chat("Wait 5 seconds then verify Chrome is open");

// Or use a different app
await agent.chat("Open Firefox instead");
```

### "Connection timeout"
```bash
# Check your internet connection
ping api.anthropic.com
ping api.e2b.dev

# Increase timeout in src/config.ts
const CONFIG = {
  e2b: {
    timeout: 60000,  // 60 seconds instead of 30
  }
}
```

## 📚 Learn More

- [E2B Documentation](https://docs.e2b.dev)
- [Claude API Docs](https://docs.anthropic.com)
- [Examples in src/examples.ts](./src/examples.ts)

## 💡 Tips & Tricks

### 1. Break Down Complex Tasks
```typescript
// Instead of:
await agent.chat("Research AI, write a report, save to file");

// Do:
await agent.chat("Search for information about AI");
await agent.chat("Now open a text editor");
await agent.chat("Write a comprehensive report about AI");
await agent.chat("Save the file as ai-report.txt");
```

### 2. Verify Each Step
```typescript
// Always take screenshots to verify
await agent.chat("Click the search button");
await agent.chat("Take a screenshot");
```

### 3. Use Delays Between Actions
```typescript
// Let Claude include wait times naturally
await agent.chat("Wait 5 seconds for the page to load, then take a screenshot");
```

### 4. Handle Errors Gracefully
```typescript
try {
  await agent.chat("Do something risky");
} catch (error) {
  console.log("Task failed, trying again...");
  await agent.chat("Retry the previous action");
}
```

## 🎓 Learning Path

1. **Beginner**: Run `npm start` to see basic examples
2. **Intermediate**: Try `npm run interactive` for hands-on usage
3. **Advanced**: Create custom scripts using [examples.ts](./src/examples.ts)
4. **Expert**: Modify agent behavior in [index.ts](./src/index.ts)

## 📞 Support

- Issues? Check [troubleshooting section](#troubleshooting)
- API questions? See [E2B docs](https://docs.e2b.dev)
- Claude issues? See [Anthropic docs](https://docs.anthropic.com)

---

**Happy automating! 🎉**
