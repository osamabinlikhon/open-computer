# API Reference

## Classes

### `ComputerUseAgent`

Main class for autonomous computer control using vision-based AI.

#### Constructor
```typescript
const agent = new ComputerUseAgent();
```

#### Methods

##### `initialize(): Promise<void>`
Initialize the E2B Desktop Sandbox.

```typescript
await agent.initialize();
// Creates a new desktop sandbox
// Throws error if API key is invalid or service is unavailable
```

##### `chat(userMessage: string): Promise<string>`
Send a task instruction and execute autonomously.

```typescript
const result = await agent.chat("Open Chrome and search for TypeScript");
// Returns the agent's response after task completion
// Automatically takes screenshots and manages tool execution
```

**Parameters:**
- `userMessage` (string): The task instruction

**Returns:** Promise<string> - Agent's response/status message

**Examples:**
```typescript
// Simple task
await agent.chat("Take a screenshot");

// Complex task with multiple steps
await agent.chat("Open VS Code, create a new file called 'app.ts', and write a hello world program");

// Task with wait time
await agent.chat("Open Chrome, wait 5 seconds for it to load, then take a screenshot");
```

##### `takeScreenshot(): Promise<string>`
Manually capture desktop screenshot as base64.

```typescript
const base64Image = await agent.takeScreenshot();
// Returns image as base64 string
```

**Returns:** Promise<string> - Base64 encoded PNG image

##### `executeToolCall(toolName: string, toolInput: object): Promise<string>`
Execute a specific tool directly.

```typescript
const result = await agent.executeToolCall("click", { x: 100, y: 100 });
```

**Parameters:**
- `toolName` (string): Name of the tool to execute
- `toolInput` (object): Tool parameters

**Returns:** Promise<string> - JSON string with result

**Available Tools:**
- `screenshot` - Take a screenshot
- `click` - Click at coordinates
- `type` - Type text
- `key` - Press keyboard key
- `scroll` - Scroll up/down
- `launch_app` - Launch application
- `wait` - Wait duration

##### `cleanup(): Promise<void>`
Terminate the desktop sandbox and cleanup resources.

```typescript
await agent.cleanup();
// Always call this to free resources
```

---

### `DesktopController`

Low-level desktop control utilities.

#### Constructor
```typescript
const controller = new DesktopController(sandbox);
```

**Parameters:**
- `sandbox` - E2B Sandbox instance

#### Methods

##### `takeScreenshot(): Promise<ScreenshotResult>`
Capture current desktop state.

```typescript
const screenshot = await controller.takeScreenshot();
// {
//   path: "/path/to/screenshot.png",
//   base64: "iVBORw0KGgo...",
//   timestamp: 1234567890
// }
```

##### `click(options: ClickOptions): Promise<void>`
Click at specified coordinates.

```typescript
await controller.click({ x: 100, y: 100 });
// Double click example
await controller.click({ x: 100, y: 100, doubleClick: true });
```

**Parameters:**
- `x` (number): X coordinate
- `y` (number): Y coordinate
- `button` (string, optional): "left" | "right" | "middle" (default: "left")
- `doubleClick` (boolean, optional): Whether to double-click

##### `type(options: TypeOptions | string): Promise<void>`
Type text with optional per-character delay.

```typescript
// Simple typing
await controller.type("Hello World");

// With delay
await controller.type({ text: "H-E-L-L-O", delayMs: 100 });
```

**Parameters:**
- `text` (string): Text to type
- `delayMs` (number, optional): Delay between characters in ms

##### `pressKey(options: KeyOptions | string): Promise<void>`
Press a single keyboard key.

```typescript
await controller.pressKey("Return");
await controller.pressKey("Tab");
await controller.pressKey("Escape");
```

**Common Keys:**
- Navigation: `Home`, `End`, `Page_Up`, `Page_Down`, `Up`, `Down`, `Left`, `Right`
- Control: `Return`, `Tab`, `Escape`, `Delete`, `Backspace`
- Functions: `F1`-`F12`
- Modifiers: `ctrl`, `alt`, `shift`

##### `pressKeys(keys: string[]): Promise<void>`
Press multiple keys in sequence.

```typescript
await controller.pressKeys(["ctrl+a", "ctrl+c"]);
```

##### `scroll(direction: "up" | "down", amount?: number): Promise<void>`
Scroll the screen.

```typescript
await controller.scroll("down", 5);
await controller.scroll("up", 3);
```

**Parameters:**
- `direction`: "up" or "down"
- `amount` (optional): Number of scroll increments (default: 3)

##### `launchApp(app: string, waitMs?: number): Promise<void>`
Launch a desktop application.

```typescript
await controller.launchApp("google-chrome");
await controller.launchApp("code", 5000);  // Wait 5 seconds
```

**Supported Apps:**
- `google-chrome`
- `code` (VS Code)
- `firefox`
- `gedit`
- `terminal`

##### `wait(duration: number): Promise<void>`
Wait for specified duration.

```typescript
await controller.wait(3000);  // Wait 3 seconds
```

##### `drag(fromX: number, fromY: number, toX: number, toY: number): Promise<void>`
Drag from one point to another.

```typescript
await controller.drag(100, 100, 200, 200);
```

##### `selectAll(): Promise<void>`
Select all text (Ctrl+A).

```typescript
await controller.selectAll();
```

##### `copy(): Promise<void>`
Copy selected content (Ctrl+C).

```typescript
await controller.copy();
```

##### `paste(): Promise<void>`
Paste clipboard content (Ctrl+V).

```typescript
await controller.paste();
```

##### `undo(): Promise<void>`
Undo last action (Ctrl+Z).

```typescript
await controller.undo();
```

##### `redo(): Promise<void>`
Redo last undone action (Ctrl+Y).

```typescript
await controller.redo();
```

##### `tab(shift?: boolean): Promise<void>`
Press Tab to navigate to next element.

```typescript
await controller.tab();          // Next element
await controller.tab(true);      // Previous element
```

##### `pressEnter(): Promise<void>`
Press Enter key.

```typescript
await controller.pressEnter();
```

##### `pressEscape(): Promise<void>`
Press Escape key.

```typescript
await controller.pressEscape();
```

---

### `TaskExecutor`

Helper class for executing complex task sequences.

#### Constructor
```typescript
const executor = new TaskExecutor(controller);
```

#### Methods

##### `executeSequence(actions: Array<() => Promise<void>>): Promise<void>`
Execute a sequence of actions in order.

```typescript
await executor.executeSequence([
  () => controller.click({ x: 100, y: 100 }),
  () => controller.type("Hello"),
  () => controller.pressEnter(),
]);
```

##### `waitForCondition(condition: () => Promise<boolean>, timeoutMs?: number, checkIntervalMs?: number): Promise<boolean>`
Wait until a condition is true.

```typescript
const loaded = await executor.waitForCondition(
  async () => {
    const screenshot = await controller.takeScreenshot();
    return screenshot.includes("Loaded");
  },
  10000,  // timeout: 10 seconds
  500     // check every 500ms
);
```

##### `retry(action: () => Promise<void>, maxAttempts?: number, delayMs?: number): Promise<boolean>`
Retry an action multiple times.

```typescript
const success = await executor.retry(
  async () => {
    await controller.click({ x: 100, y: 100 });
  },
  3,      // max attempts
  1000    // delay between attempts
);
```

---

## Interfaces

### ScreenshotResult
```typescript
interface ScreenshotResult {
  path: string;           // File path to screenshot
  base64: string;         // Base64 encoded image
  timestamp: number;      // Timestamp in milliseconds
}
```

### ClickOptions
```typescript
interface ClickOptions {
  x: number;              // X coordinate
  y: number;              // Y coordinate
  button?: "left" | "right" | "middle";  // Mouse button
  doubleClick?: boolean;  // Double-click flag
}
```

### TypeOptions
```typescript
interface TypeOptions {
  text: string;           // Text to type
  delayMs?: number;       // Delay between characters
}
```

### KeyOptions
```typescript
interface KeyOptions {
  key: string;            // Key to press
  modifiers?: ("ctrl" | "alt" | "shift")[];  // Modifier keys
}
```

---

## Tool Definitions

```typescript
interface Tool {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}
```

### Tool: screenshot
Takes a screenshot of the desktop.

**Input Schema:**
```typescript
{}  // No parameters
```

**Returns:**
```typescript
{
  success: true,
  image_base64: "iVBORw0KGgo..."
}
```

### Tool: click
Clicks at specified coordinates.

**Input Schema:**
```typescript
{
  x: number,
  y: number,
  button?: "left" | "right" | "middle",
  doubleClick?: boolean
}
```

### Tool: type
Types text into focused element.

**Input Schema:**
```typescript
{
  text: string
}
```

### Tool: key
Presses a keyboard key.

**Input Schema:**
```typescript
{
  key: string
}
```

### Tool: scroll
Scrolls the screen.

**Input Schema:**
```typescript
{
  direction: "up" | "down",
  amount?: number
}
```

### Tool: launch_app
Launches an application.

**Input Schema:**
```typescript
{
  app: "google-chrome" | "code" | "firefox" | "gedit" | "terminal"
}
```

### Tool: wait
Waits for specified duration.

**Input Schema:**
```typescript
{
  duration: number
}
```

---

## Configuration

### CONFIG Object
```typescript
export const CONFIG = {
  e2b: {
    timeout: 30000,        // Request timeout in ms
    maxRetries: 3,         // Max retry attempts
  },
  claude: {
    model: "claude-3-5-sonnet-20241022",  // Model ID
    maxTokens: 4096,       // Max response tokens
    temperature: 0,        // Response temperature
  },
  desktop: {
    screenshotWaitMs: 1000,
    appLaunchWaitMs: 3000,
    screenshotFormat: "png",
  },
  agent: {
    verbose: true,         // Enable logging
    saveScreenshots: false, // Save screenshots to disk
    screenshotDir: "./screenshots",
  },
  task: {
    maxSteps: 50,          // Max execution steps
    stepTimeoutMs: 30000,  // Timeout per step
  },
};
```

---

## Error Handling

### Common Errors

**APIError** - API communication failure
```typescript
try {
  await agent.chat("task");
} catch (error) {
  if (error.message.includes("API")) {
    console.error("API Error:", error.message);
  }
}
```

**TimeoutError** - Operation timeout
```typescript
try {
  await agent.chat("slow-task");
} catch (error) {
  if (error.name === "TimeoutError") {
    console.error("Operation timed out");
  }
}
```

**SandboxError** - Sandbox initialization failed
```typescript
try {
  await agent.initialize();
} catch (error) {
  if (error.message.includes("Sandbox")) {
    console.error("Failed to create sandbox");
  }
}
```

---

## Examples

### Example 1: Chained Tasks
```typescript
const agent = new ComputerUseAgent();
await agent.initialize();

await agent.chat("Open Chrome");
await agent.chat("Navigate to github.com");
await agent.chat("Search for computer use");
await agent.chat("Take a screenshot");

await agent.cleanup();
```

### Example 2: Error Handling
```typescript
try {
  await agent.chat("Do something");
} catch (error) {
  console.error("Task failed:", error.message);
  await agent.cleanup();
}
```

### Example 3: Advanced Tool Usage
```typescript
const controller = new DesktopController(sandbox);
await controller.click({ x: 100, y: 100 });
await controller.type("search query");
await controller.pressEnter();
await controller.wait(2000);
const screenshot = await controller.takeScreenshot();
```

---

For more information, see:
- [README.md](README.md) - Overview and setup
- [QUICK_START.md](QUICK_START.md) - Getting started guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture and design patterns
