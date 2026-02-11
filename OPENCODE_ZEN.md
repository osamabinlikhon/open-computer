# OpenCode Zen Integration Guide

## Overview

The Computer Use Agent has been updated to use **MiniMax M2.1** model through the **OpenCode Zen** gateway, replacing the previous Anthropic Claude integration.

## What Changed

### API Provider
- **Previous**: Anthropic Claude 3.5 Sonnet
- **New**: MiniMax M2.1 via OpenCode Zen gateway
- **Endpoint**: https://opencode.ai/zen/v1

### Configuration
Update your `.env` file with the new API key:

```env
# Old configuration (no longer used)
# ANTHROPIC_API_KEY=sk-...

# New configuration
E2B_API_KEY=your_e2b_api_key_here
OPENCODE_ZEN_API_KEY=your_opencode_zen_api_key_here
OPENCODE_ZEN_MODEL=minimax-m2.1-free
```

## Getting Started

### 1. Get OpenCode Zen API Key
1. Visit https://opencode.ai/zen
2. Create an account or sign in
3. Generate an API key from the dashboard
4. Copy the key to your `.env` file

### 2. Install & Configure
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your OpenCode Zen API key
nano .env
```

### 3. Verify Setup
```bash
npm run diagnose
```

The diagnostic should show:
- ✓ E2B_API_KEY: Set
- ✓ OPENCODE_ZEN_API_KEY: Set
- ✓ MiniMax M2.1 API: Ready

## How It Works

The agent now operates with MiniMax M2.1 model through OpenCode Zen gateway:

1. **Request Flow**:
   ```
   Your Code
   ↓
   OpenCode Zen SDK (using Anthropic SDK pattern)
   ↓
   OpenCode Zen Gateway (https://opencode.ai/zen/v1)
   ↓
   MiniMax M2.1 Model
   ↓
   Response with desktop actions
   ```

2. **Computer Use Loop**:
   ```
   1. Take screenshot
   2. Send to MiniMax M2.1 via OpenCode Zen
   3. Receive action recommendation
   4. Execute action (click, type, scroll, etc.)
   5. Go to step 1
   ```

## Key Features

✨ **Vision-Based Planning**
- MiniMax M2.1 analyzes desktop screenshots
- Understands UI elements and context
- Plans next actions autonomously

🚀 **OpenCode Zen Benefits**
- Optimized MiniMax M2.1 configuration
- Tested and verified performance
- Managed infrastructure
- Standardized API interface

🔐 **Security**
- Sandboxed E2B Desert environment
- No host environment variables exposed
- Secure API key management

## API Compatibility

While using the Anthropic SDK (`@anthropic-ai/sdk`), the agent communicates with the MiniMax M2.1 model through OpenCode Zen's API-compatible gateway:

```typescript
const client = new Anthropic({
  apiKey: process.env.OPENCODE_ZEN_API_KEY,
  baseURL: "https://opencode.ai/zen/v1",
});

const response = await client.messages.create({
  model: "minimax-m2.1-free",  // MiniMax model ID
  max_tokens: 4096,
  messages: [/* ... */],
});
```

## Configuration Options

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `E2B_API_KEY` | Yes | - | E2B Desktop Sandbox API key |
| `OPENCODE_ZEN_API_KEY` | Yes | - | OpenCode Zen API key |
| `OPENCODE_ZEN_MODEL` | No | `minimax-m2.1-free` | Model identifier |

### Model Configuration
Edit [src/config.ts](../src/config.ts):

```typescript
export const CONFIG = {
  model: {
    name: "minimax-m2.1-free",  // Model ID
    maxTokens: 4096,             // Response token limit
    temperature: 0,              // Deterministic responses
  },
  // ... other config
};
```

## Performance Characteristics

### MiniMax M2.1
- **Speed**: Fast inference (~500ms-1s per action)
- **Vision**: Native image understanding
- **Context**: Extended token context window
- **Cost**: Free tier available through OpenCode Zen

### Recommended Settings
```typescript
{
  maxTokens: 4096,      // Sufficient for most tasks
  temperature: 0,       // Consistent, deterministic behavior
  topP: 0.8,           // Balanced accuracy and creativity
}
```

## Troubleshooting

### "API key not found"
```bash
# Check your .env file
cat .env
# Should contain: OPENCODE_ZEN_API_KEY=your_key_here
```

### "Invalid model 'minimax-m2.1-free'"
```bash
# Verify model name in .env
grep OPENCODE_ZEN_MODEL .env
# Should be: minimax-m2.1-free
```

### "Connection timeout"
- Check internet connection
- Verify OpenCode Zen API endpoint is accessible
- Increase timeout in config if needed

```typescript
// In src/config.ts
e2b: {
  timeout: 60000,  // Increase from 30000
}
```

### Model unresponsive
```bash
# Run diagnostics again
npm run diagnose

# Check API status at https://opencode.ai/status
```

## Migration from Claude

If you were previously using Claude, here are the differences:

### Request Handling
```typescript
// Old (Claude)
const response = await client.messages.create({
  model: "claude-3-5-sonnet-20241022",
  // ... other params
});

// New (MiniMax via OpenCode Zen)
const response = await client.messages.create({
  model: "minimax-m2.1-free",
  // ... same other params
});
```

### Response Format
Both models return similar response structures, so existing code should work with minimal changes.

### Tool Usage
Tool definitions remain the same:
- `screenshot` - Capture screen
- `click` - Click at coordinates
- `type` - Input text
- `key` - Press keyboard key
- `scroll` - Scroll page
- `launch_app` - Launch application
- `wait` - Wait duration

## OpenCode Zen Benefits

### 1. **Verified Performance**
OpenCode Zen only includes models and providers that have been tested and verified to work well together.

### 2. **Optimized Configuration**
Worked with MiniMax team to ensure optimal settings for computer use tasks.

### 3. **Unified API**
Standard API interface compatible with Anthropic SDK pattern.

### 4. **Production Ready**
- Load balancing
- Rate limiting
- Error handling
- Monitoring

### 5. **Transparent Pricing**
- Free tier available
- Pay-as-you-go pricing
- Clear billing

## Examples

### Basic Usage
```typescript
const agent = new ComputerUseAgent();
await agent.initialize();

// MiniMax M2.1 will analyze screenshots and control desktop
await agent.chat("Search for 'MiniMax M2.1' on Google");

await agent.cleanup();
```

### With Configuration
```typescript
const client = new Anthropic({
  apiKey: process.env.OPENCODE_ZEN_API_KEY,
  baseURL: "https://opencode.ai/zen/v1",
});

const response = await client.messages.create({
  model: "minimax-m2.1-free",
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Take a screenshot and describe what you see",
  }],
});
```

## Additional Resources

- **OpenCode Zen**: https://opencode.ai/zen
- **MiniMax Documentation**: https://www.minimaxi.com/
- **E2B Desktop**: https://docs.e2b.dev
- **OpenCode Community**: https://opencode.ai/community

## Support

For issues:
1. Run `npm run diagnose` to check your setup
2. Check `.env` file has correct API keys
3. Visit https://opencode.ai/status to check service status
4. Read [API.md](../API.md) for detailed API reference
5. See [QUICK_START.md](../QUICK_START.md) for setup help

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-02-11 | Added OpenCode Zen / MiniMax M2.1 support |
| 1.0.0 | 2026-02-11 | Initial release with Claude integration |

---

**Happy automating with MiniMax M2.1! 🚀**
