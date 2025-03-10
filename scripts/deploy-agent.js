#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
let agentName = '';
let environment = 'devnet';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--name' && i + 1 < args.length) {
    agentName = args[i + 1];
    i++;
  } else if (args[i] === '--env' && i + 1 < args.length) {
    environment = args[i + 1];
    i++;
  }
}

if (!agentName) {
  console.error('Error: Agent name is required. Use --name "YourAgentName"');
  process.exit(1);
}

// Validate environment
const validEnvironments = ['devnet', 'testnet', 'mainnet'];
if (!validEnvironments.includes(environment)) {
  console.error(`Error: Invalid environment. Valid environments are: ${validEnvironments.join(', ')}`);
  process.exit(1);
}

// Check if agent exists
const agentsDir = path.join(__dirname, '..', 'src', 'agents');
const customAgentsDir = path.join(agentsDir, 'custom');
const fileName = `${agentName.replace(/\s+/g, '')}Agent.ts`;
const filePath = path.join(customAgentsDir, fileName);

if (!fs.existsSync(filePath)) {
  console.error(`Error: Agent file ${fileName} does not exist.`);
  console.error(`Create the agent first using: npm run create-agent -- --name "${agentName}"`);
  process.exit(1);
}

// Create deployment directory if it doesn't exist
const deploymentsDir = path.join(__dirname, '..', 'deployments');
if (!fs.existsSync(deploymentsDir)) {
  fs.mkdirSync(deploymentsDir, { recursive: true });
}

const envDir = path.join(deploymentsDir, environment);
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Create deployment configuration
const deploymentConfig = {
  name: agentName,
  type: fileName.includes('Trading') ? 'trading' : 'sentiment',
  environment,
  timestamp: new Date().toISOString(),
  config: {
    // Default configuration, would be customized in a real deployment
    apiEndpoint: environment === 'mainnet' 
      ? 'https://api.multiversx.com' 
      : `https://${environment}-api.multiversx.com`,
    updateFrequency: 30,
    autoRestart: true,
    logLevel: 'info',
  }
};

const deploymentPath = path.join(envDir, `${agentName.replace(/\s+/g, '')}.json`);
fs.writeFileSync(deploymentPath, JSON.stringify(deploymentConfig, null, 2));

console.log(`✅ Deployed ${deploymentConfig.type} agent: ${agentName} to ${environment}`);
console.log(`📁 Deployment config: ${deploymentPath}`);
console.log(`\nIn a real deployment, this would deploy the agent to a server or cloud service.`);
console.log(`For now, you can use the agent in your application by importing it from '@/agents/custom'.`); 