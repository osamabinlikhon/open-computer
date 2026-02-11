/**
 * Example Tasks and Use Cases
 * This file demonstrates various ways to use the Computer Use Agent
 */

import Anthropic from "@anthropic-ai/sdk";
import { Sandbox } from "@e2b/desktop";

/**
 * Example 1: Web Search and Screenshot
 */
export async function exampleWebSearch(agent: any) {
  console.log("\n📌 Example 1: Web Search");
  console.log("─".repeat(50));

  await agent.chat(
    "Open Google Chrome and search for 'Computer Use Agent' then take a screenshot"
  );
}

/**
 * Example 2: File Creation in VS Code
 */
export async function exampleFileCreation(agent: any) {
  console.log("\n📌 Example 2: File Creation");
  console.log("─".repeat(50));

  await agent.chat(
    `Launch VS Code and create a new file called 'example.js' with the following content:
    
console.log('Hello from Computer Use Agent!');
const sum = (a, b) => a + b;
console.log('Sum of 5 and 3:', sum(5, 3));`
  );
}

/**
 * Example 3: Document Editing
 */
export async function exampleDocumentEditing(agent: any) {
  console.log("\n📌 Example 3: Document Editing");
  console.log("─".repeat(50));

  await agent.chat(`
    Open a text editor and create a document with the following:
    
    Title: Computer Use Agent Documentation
    
    Content:
    - Introduction
    - Features
    - Installation
    - Usage Examples
    - Troubleshooting
    
    Save it as 'documentation.txt'
  `);
}

/**
 * Example 4: Email Draft
 */
export async function exampleEmailDraft(agent: any) {
  console.log("\n📌 Example 4: Email Draft");
  console.log("─".repeat(50));

  await agent.chat(`
    Use a text editor to draft an email with:
    
    To: team@example.com
    Subject: Computer Use Agent - Implementation Complete
    
    Body:
    Dear Team,
    
    I'm pleased to inform you that the Computer Use Agent implementation is complete.
    The agent can now autonomously control desktop applications using vision and AI.
    
    Key Features:
    - Screenshot capability
    - Application control
    - Task automation
    
    Next steps:
    - Testing
    - Documentation
    - Deployment
    
    Best regards,
    Agent Developer
  `);
}

/**
 * Example 5: Multi-Step Workflow
 */
export async function exampleMultiStepWorkflow(agent: any) {
  console.log("\n📌 Example 5: Multi-Step Workflow");
  console.log("─".repeat(50));

  // Step 1: Open Chrome
  await agent.chat("Launch Google Chrome");

  // Step 2: Search
  await agent.chat("Search for 'TypeScript best practices'");

  // Step 3: Take screenshot
  await agent.chat("Take a screenshot of the search results");

  // Step 4: Switch to VS Code
  await agent.chat("Launch VS Code");

  // Step 5: Create a file
  await agent.chat(
    "Create a new file called 'typescript-tips.md' with a list of TypeScript best practices"
  );
}

/**
 * Example 6: Screenshot Analysis
 */
export async function exampleScreenshotAnalysis(agent: any) {
  console.log("\n📌 Example 6: Screenshot Analysis");
  console.log("─".repeat(50));

  await agent.chat("Take a screenshot and describe everything you see on the desktop");
}

/**
 * Example 7: Browser Navigation
 */
export async function exampleBrowserNavigation(agent: any) {
  console.log("\n📌 Example 7: Browser Navigation");
  console.log("─".repeat(50));

  await agent.chat(`
    1. Open Google Chrome
    2. Go to GitHub (github.com)
    3. Search for 'computer-use'
    4. Click on the first result
    5. Take a screenshot of the repository
  `);
}

/**
 * Example 8: Form Filling
 */
export async function exampleFormFilling(agent: any) {
  console.log("\n📌 Example 8: Form Filling");
  console.log("─".repeat(50));

  await agent.chat(`
    Open a web browser and go to example.com/contact
    Fill out the contact form with:
    
    Name: John Doe
    Email: john@example.com
    Subject: Computer Use Agent Inquiry
    Message: I'm interested in learning more about your computer use capabilities.
    
    Then submit the form.
  `);
}

/**
 * Example 9: Code Development
 */
export async function exampleCodeDevelopment(agent: any) {
  console.log("\n📌 Example 9: Code Development");
  console.log("─".repeat(50));

  await agent.chat(`
    Launch VS Code and create a new TypeScript file called 'calculator.ts' with:
    
    class Calculator {
      add(a: number, b: number): number {
        return a + b;
      }
      
      subtract(a: number, b: number): number {
        return a - b;
      }
      
      multiply(a: number, b: number): number {
        return a * b;
      }
      
      divide(a: number, b: number): number {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
      }
    }
    
    export default Calculator;
  `);
}

/**
 * Example 10: Research & Compilation
 */
export async function exampleResearchCompilation(agent: any) {
  console.log("\n📌 Example 10: Research & Compilation");
  console.log("─".repeat(50));

  // Step 1: Search on web
  await agent.chat(
    "Open Chrome and search for 'Web APIs in 2024' then take a screenshot"
  );

  // Step 2: Open text editor
  await agent.chat("Launch a text editor");

  // Step 3: Create document
  await agent.chat(
    `Create a document called 'web-apis-2024.txt' with a summary of:
    - Popular Web APIs
    - Modern JavaScript features
    - Best practices for API usage`
  );
}

/**
 * Use Case 1: Data Entry Automation
 */
export const useCase1DataEntry = `
Automate data entry tasks:
- Open spreadsheet application
- Import data from file
- Validate entries
- Flag errors
- Generate report
`;

/**
 * Use Case 2: Screenshot & Documentation
 */
export const useCase2Documentation = `
Automated documentation generation:
- Take screenshots of UI
- Annotate with descriptions
- Create user documentation
- Generate guides
`;

/**
 * Use Case 3: Testing & QA
 */
export const useCase3Testing = `
Automated testing scenarios:
- Open application
- Execute test steps
- Verify results
- Take screenshots on failure
- Generate test report
`;

/**
 * Use Case 4: System Administration
 */
export const useCase4Administration = `
System administration tasks:
- Monitor applications
- Update software
- Configure settings
- Backup data
- Run maintenance scripts
`;

/**
 * Use Case 5: Email & Communication
 */
export const useCase5Communication = `
Email and communication:
- Draft emails from templates
- Fill in recipient information
- Attach files
- Send bulk communications
`;

/**
 * Use Case 6: Shopping & Procurement
 */
export const useCase6Shopping = `
E-commerce automation:
- Search for products
- Compare prices
- Add to cart
- Complete checkout
- Track orders
`;

/**
 * Use Case 7: Content Creation
 */
export const useCase7Content = `
Content creation assistance:
- Research topics
- Draft content
- Format documents
- Generate previews
- Export in multiple formats
`;

/**
 * Use Case 8: Data Analysis & Visualization
 */
export const useCase8Analysis = `
Data analysis tasks:
- Open data tools
- Load datasets
- Create visualizations
- Generate insights
- Export results
`;

/**
 * Use Case 9: Social Media Management
 */
export const useCase9SocialMedia = `
Social media automation:
- Log into platforms
- Schedule posts
- Manage comments
- Monitor analytics
- Generate reports
`;

/**
 * Use Case 10: Software Configuration */
export const useCase10Configuration = `
Software setup and configuration:
- Download applications
- Run installers
- Configure settings
- Set up integrations
- Verify installations
`;
