#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
let agentName = '';
let agentType = 'trading';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && i + 1 < args.length) {
    agentName = args[i + 1];
    i++;
  } else if (args[i] === '--type' && i + 1 < args.length) {
    agentType = args[i + 1];
    i++;
  }
}

if (!agentName) {
  console.error('Error: Agent name is required. Use --name "YourAgentName"');
  process.exit(1);
}

// Validate agent type
const validTypes = ['trading', 'sentiment'];
if (!validTypes.includes(agentType)) {
  console.error(`Error: Invalid agent type. Valid types are: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Create agent file
const agentsDir = path.join(__dirname, '..', 'src', 'agents');
const customAgentsDir = path.join(agentsDir, 'custom');

// Create custom agents directory if it doesn't exist
if (!fs.existsSync(customAgentsDir)) {
  fs.mkdirSync(customAgentsDir, { recursive: true });
}

const fileName = `${agentName.replace(/\s+/g, '')}Agent.ts`;
const filePath = path.join(customAgentsDir, fileName);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`Error: Agent file ${fileName} already exists.`);
  process.exit(1);
}

// Create agent file content based on type
let fileContent = '';

if (agentType === 'trading') {
  fileContent = `import { TradingAgent } from '../TradingAgent';

export class ${agentName.replace(/\s+/g, '')}Agent extends TradingAgent {
  constructor(config: any) {
    super({
      name: "${agentName}",
      description: "A custom trading agent for MultiversX DeFi",
      goals: [
        "Execute trades with optimal timing",
        "Minimize slippage",
        "Maximize returns"
      ],
      capabilities: [
        "Token swaps",
        "Liquidity provision",
        "Market analysis"
      ],
      personality: "Professional, cautious, and data-driven",
      apiKey: config.apiKey,
      riskTolerance: "medium",
      tradingStrategy: "balanced",
      maxSlippage: 3,
      ...config
    });
  }

  // Override methods or add custom functionality here
}
`;
} else if (agentType === 'sentiment') {
  fileContent = `import { SentimentAnalysisAgent } from '../SentimentAnalysisAgent';

export class ${agentName.replace(/\s+/g, '')}Agent extends SentimentAnalysisAgent {
  constructor(config: any) {
    super({
      name: "${agentName}",
      description: "A custom sentiment analysis agent for MultiversX DeFi",
      goals: [
        "Analyze market sentiment",
        "Track social media mentions",
        "Identify market trends"
      ],
      capabilities: [
        "Sentiment analysis",
        "Social media tracking",
        "Market mood assessment"
      ],
      personality: "Analytical, objective, and thorough",
      apiKey: config.apiKey,
      dataSources: ["Twitter", "Reddit", "News"],
      updateFrequency: 30,
      ...config
    });
  }

  // Override methods or add custom functionality here
}
`;
}

// Write file
fs.writeFileSync(filePath, fileContent);

// Update index.ts to export the new agent
const indexPath = path.join(customAgentsDir, 'index.ts');
let indexContent = '';

if (fs.existsSync(indexPath)) {
  indexContent = fs.readFileSync(indexPath, 'utf8');
  indexContent += `export * from './${agentName.replace(/\s+/g, '')}Agent';\n`;
} else {
  indexContent = `// Custom agents index file\nexport * from './${agentName.replace(/\s+/g, '')}Agent';\n`;
}

fs.writeFileSync(indexPath, indexContent);

console.log(`✅ Created ${agentType} agent: ${agentName}`);
console.log(`📁 File created: ${filePath}`);
console.log(`\nYou can now import and use your agent:`);
console.log(`\nimport { ${agentName.replace(/\s+/g, '')}Agent } from '@/agents/custom/${agentName.replace(/\s+/g, '')}Agent';`);
console.log(`const agent = new ${agentName.replace(/\s+/g, '')}Agent({ /* config */ });`); 