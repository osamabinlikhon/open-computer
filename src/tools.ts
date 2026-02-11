/**
 * Tool Definitions for Computer Use Agent
 */

export const COMPUTER_TOOLS = [
  {
    name: "screenshot",
    description: "Take a screenshot of the current desktop to see what is on the screen",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "click",
    description: "Click at specified coordinates on the screen",
    input_schema: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description: "The x coordinate to click at",
        },
        y: {
          type: "number",
          description: "The y coordinate to click at",
        },
        button: {
          type: "string",
          enum: ["left", "right", "middle"],
          description: "Which mouse button to click (default: left)",
        },
        doubleClick: {
          type: "boolean",
          description: "Whether to double-click (default: false)",
        },
      },
      required: ["x", "y"],
    },
  },
  {
    name: "type",
    description: "Type text into the currently focused element",
    input_schema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "The text to type",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "key",
    description:
      "Press a keyboard key. Common keys: Return, Tab, Escape, Delete, Backspace, End, Home, Page_Up, Page_Down, etc.",
    input_schema: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: "The key to press (e.g., 'Return', 'Tab', 'Escape')",
        },
      },
      required: ["key"],
    },
  },
  {
    name: "scroll",
    description: "Scroll the screen up or down",
    input_schema: {
      type: "object",
      properties: {
        direction: {
          type: "string",
          enum: ["up", "down"],
          description: "The direction to scroll",
        },
        amount: {
          type: "number",
          description: "How many times to scroll (default: 3)",
        },
      },
      required: ["direction"],
    },
  },
  {
    name: "launch_app",
    description: "Launch an application on the desktop",
    input_schema: {
      type: "object",
      properties: {
        app: {
          type: "string",
          enum: ["google-chrome", "code", "firefox", "gedit", "terminal"],
          description:
            'The application to launch (e.g., "google-chrome", "code", "firefox")',
        },
      },
      required: ["app"],
    },
  },
  {
    name: "wait",
    description: "Wait for a specified duration in milliseconds",
    input_schema: {
      type: "object",
      properties: {
        duration: {
          type: "number",
          description: "The duration to wait in milliseconds",
        },
      },
      required: ["duration"],
    },
  },
];

/**
 * Helper function to find tool definition by name
 */
export function getToolDefinition(
  toolName: string
): (typeof COMPUTER_TOOLS)[0] | undefined {
  return COMPUTER_TOOLS.find((tool) => tool.name === toolName);
}

/**
 * Get all tool definitions for API calls
 */
export function getToolsForAPI(): Array<{
  name: string;
  description: string;
  input_schema: unknown;
}> {
  return COMPUTER_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.input_schema,
  }));
}
