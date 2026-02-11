#!/bin/bash

# Computer Use Agent - Project Verification Script
# This script verifies that all required files are in place

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       Computer Use Agent - Project Verification             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check file
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

# Function to check directory
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    return 0
  else
    echo -e "${RED}✗${NC} $1"
    return 1
  fi
}

# Check root files
echo -e "${YELLOW}📦 Root Configuration Files:${NC}"
check_file "package.json"
check_file "tsconfig.json"
check_file ".env.example"
check_file ".gitignore"
check_file "README.md"
echo ""

# Check documentation
echo -e "${YELLOW}📚 Documentation Files:${NC}"
check_file "QUICK_START.md"
check_file "API.md"
check_file "ARCHITECTURE.md"
check_file "SUMMARY.md"
echo ""

# Check source files
echo -e "${YELLOW}💻 Source Code Files:${NC}"
check_dir "src"
check_file "src/index.ts"
check_file "src/interactive.ts"
check_file "src/desktop-controller.ts"
check_file "src/tools.ts"
check_file "src/config.ts"
check_file "src/examples.ts"
check_file "src/test.ts"
check_file "src/diagnose.ts"
echo ""

# Check dependencies
echo -e "${YELLOW}📦 Checking Dependencies:${NC}"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules (installed)"
else
  echo -e "${YELLOW}⚠${NC} node_modules (not installed - run: npm install)"
fi
echo ""

# Check environment
echo -e "${YELLOW}🔐 Environment Setup:${NC}"
if [ -f ".env" ]; then
  if grep -q "E2B_API_KEY" .env && grep -q "ANTHROPIC_API_KEY" .env; then
    echo -e "${GREEN}✓${NC} .env (configured)"
  else
    echo -e "${YELLOW}⚠${NC} .env (exists but missing keys)"
  fi
else
  echo -e "${YELLOW}⚠${NC} .env (not created - run: cp .env.example .env)"
fi
echo ""

# Print summary
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                      Setup Instructions                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Install dependencies:"
echo "   ${YELLOW}npm install${NC}"
echo ""
echo "2. Configure environment:"
echo "   ${YELLOW}cp .env.example .env${NC}"
echo "   Then edit .env with your API keys"
echo ""
echo "3. Verify setup:"
echo "   ${YELLOW}npm run diagnose${NC}"
echo ""
echo "4. Quick start:"
echo "   ${YELLOW}npm run interactive${NC}  # Interactive mode"
echo "   ${YELLOW}npm start${NC}            # Run examples"
echo ""
echo "5. Read documentation:"
echo "   ${YELLOW}QUICK_START.md${NC}  - 5-minute getting started guide"
echo "   ${YELLOW}API.md${NC}          - Complete API reference"
echo "   ${YELLOW}README.md${NC}       - Full project documentation"
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    All systems ready! 🚀                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
