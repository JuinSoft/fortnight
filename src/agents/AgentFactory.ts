import { BaseAgent, AgentConfig } from './templates/BaseAgent';
import { TradingAgent } from './TradingAgent';
import { SentimentAnalysisAgent } from './SentimentAnalysisAgent';

export type AgentType = 'trading' | 'sentiment';

interface AgentFactoryConfig {
  apiKey: string;
}

export class AgentFactory {
  private agents: Map<string, BaseAgent> = new Map();
  private apiKey: string;

  constructor(config: AgentFactoryConfig) {
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  }

  public createAgent(type: AgentType, name: string, config: any): BaseAgent {
    // Check if an agent with this name already exists
    if (this.agents.has(name)) {
      throw new Error(`Agent with name ${name} already exists`);
    }

    let agent: BaseAgent;

    switch (type) {
      case 'trading':
        agent = new TradingAgent({
          name,
          description: config.description || 'A trading agent for MultiversX DeFi',
          goals: config.goals || ['Execute trades with optimal timing', 'Minimize slippage', 'Maximize returns'],
          capabilities: config.capabilities || ['Token swaps', 'Liquidity provision', 'Market analysis'],
          personality: config.personality || 'Professional, cautious, and data-driven',
          apiKey: this.apiKey,
          riskTolerance: config.riskTolerance || 'medium',
          tradingStrategy: config.tradingStrategy || 'balanced',
          maxSlippage: config.maxSlippage || 3,
        });
        break;

      case 'sentiment':
        agent = new SentimentAnalysisAgent({
          name,
          description: config.description || 'A sentiment analysis agent for MultiversX DeFi',
          goals: config.goals || ['Analyze market sentiment', 'Track social media mentions', 'Identify market trends'],
          capabilities: config.capabilities || ['Sentiment analysis', 'Social media tracking', 'Market mood assessment'],
          personality: config.personality || 'Analytical, objective, and thorough',
          apiKey: this.apiKey,
          dataSources: config.dataSources || ['Twitter', 'Reddit', 'News'],
          updateFrequency: config.updateFrequency || 30, // 30 minutes by default
        });
        break;

      default:
        throw new Error(`Unknown agent type: ${type}`);
    }

    // Initialize the agent
    agent.initialize();

    // Store the agent
    this.agents.set(name, agent);

    return agent;
  }

  public getAgent(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  public removeAgent(name: string): boolean {
    const agent = this.agents.get(name);
    if (agent) {
      // Clean up the agent if it has a cleanup method
      if ('cleanup' in agent && typeof (agent as any).cleanup === 'function') {
        (agent as any).cleanup();
      }
      
      this.agents.delete(name);
      return true;
    }
    return false;
  }

  public listAgents(): { name: string; type: string }[] {
    return Array.from(this.agents.entries()).map(([name, agent]) => {
      let type = 'unknown';
      if (agent instanceof TradingAgent) {
        type = 'trading';
      } else if (agent instanceof SentimentAnalysisAgent) {
        type = 'sentiment';
      }
      return { name, type };
    });
  }
} 