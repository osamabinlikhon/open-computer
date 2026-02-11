/**
 * Desktop Control Utility Module
 * Provides helper functions for interacting with the E2B Desktop Sandbox
 */

import { Sandbox } from "@e2b/desktop";

export interface ScreenshotResult {
  path: string;
  base64: string;
  timestamp: number;
}

export interface ClickOptions {
  x: number;
  y: number;
  button?: "left" | "right" | "middle";
  doubleClick?: boolean;
}

export interface TypeOptions {
  text: string;
  delayMs?: number;
}

export interface KeyOptions {
  key: string;
  modifiers?: ("ctrl" | "alt" | "shift")[];
}

export class DesktopController {
  constructor(private sandbox: InstanceType<typeof Sandbox>) {}

  /**
   * Take a screenshot of the current desktop
   */
  async takeScreenshot(): Promise<ScreenshotResult> {
    const path = await this.sandbox.screenshot();
    const fs = await import("fs").then((m) => m.promises);
    const fileContent = await fs.readFile(path, "utf8");

    return {
      path,
      base64: fileContent,
      timestamp: Date.now(),
    };
  }

  /**
   * Click at specific coordinates on the screen
   */
  async click(options: ClickOptions): Promise<void> {
    const { x, y, button = "left", doubleClick = false } = options;

    if (doubleClick) {
      await this.sandbox.click({ x, y });
      await this.sleep(100);
      await this.sandbox.click({ x, y });
    } else {
      await this.sandbox.click({ x, y });
    }
  }

  /**
   * Type text with optional delay between characters
   */
  async type(options: TypeOptions | string): Promise<void> {
    const { text, delayMs = 0 } =
      typeof options === "string" ? { text: options, delayMs: 0 } : options;

    if (delayMs > 0) {
      for (const char of text) {
        await this.sandbox.write(char);
        await this.sleep(delayMs);
      }
    } else {
      await this.sandbox.write(text);
    }
  }

  /**
   * Press a keyboard key
   */
  async pressKey(options: KeyOptions | string): Promise<void> {
    const { key, modifiers = [] } =
      typeof options === "string" ? { key: options, modifiers: [] } : options;

    await this.sandbox.press(key);
  }

  /**
   * Press multiple keys in sequence
   */
  async pressKeys(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.sandbox.press(key);
      await this.sleep(50);
    }
  }

  /**
   * Scroll the screen
   */
  async scroll(direction: "up" | "down", amount: number = 3): Promise<void> {
    const key = direction === "down" ? "Page_Down" : "Page_Up";
    for (let i = 0; i < amount; i++) {
      await this.sandbox.press(key);
      await this.sleep(200);
    }
  }

  /**
   * Launch an application
   */
  async launchApp(app: string, waitMs: number = 3000): Promise<void> {
    await this.sandbox.launch(app);
    await this.sleep(waitMs);
  }

  /**
   * Wait for a specified duration
   */
  async wait(duration: number): Promise<void> {
    await this.sleep(duration);
  }

  /**
   * Get the current mouse position (if supported)
   */
  async getMousePosition(): Promise<{ x: number; y: number } | null> {
    // This is a placeholder - E2B may not expose mouse position
    return null;
  }

  /**
   * Drag from one point to another
   */
  async drag(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): Promise<void> {
    // Simulate drag with click and move - E2B may have limited drag support
    await this.click({ x: fromX, y: fromY });
    await this.sleep(100);
    // For now, just click the target - proper drag may need E2B API enhancement
    await this.click({ x: toX, y: toY });
  }

  /**
   * Select all text (Ctrl+A)
   */
  async selectAll(): Promise<void> {
    await this.sandbox.press("ctrl+a");
  }

  /**
   * Copy text (Ctrl+C)
   */
  async copy(): Promise<void> {
    await this.sandbox.press("ctrl+c");
  }

  /**
   * Paste text (Ctrl+V)
   */
  async paste(): Promise<void> {
    await this.sandbox.press("ctrl+v");
  }

  /**
   * Undo (Ctrl+Z)
   */
  async undo(): Promise<void> {
    await this.sandbox.press("ctrl+z");
  }

  /**
   * Redo (Ctrl+Y)
   */
  async redo(): Promise<void> {
    await this.sandbox.press("ctrl+y");
  }

  /**
   * Tab to next element
   */
  async tab(shift: boolean = false): Promise<void> {
    const key = shift ? "shift+Tab" : "Tab";
    await this.sandbox.press(key);
  }

  /**
   * Press Enter
   */
  async pressEnter(): Promise<void> {
    await this.sandbox.press("Return");
  }

  /**
   * Press Escape
   */
  async pressEscape(): Promise<void> {
    await this.sandbox.press("Escape");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Task execution helper
 */
export class TaskExecutor {
  constructor(private controller: DesktopController) {}

  /**
   * Execute a sequence of actions
   */
  async executeSequence(
    actions: Array<() => Promise<void>>
  ): Promise<void> {
    for (const action of actions) {
      await action();
    }
  }

  /**
   * Wait for a condition to be true
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeoutMs: number = 10000,
    checkIntervalMs: number = 500
  ): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) {
        return true;
      }
      await this.controller.wait(checkIntervalMs);
    }
    return false;
  }

  /**
   * Retry an action
   */
  async retry(
    action: () => Promise<void>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await action();
        return true;
      } catch (error) {
        if (i < maxAttempts - 1) {
          await this.controller.wait(delayMs);
        }
      }
    }
    return false;
  }
}
