import { MultiversXService } from '@/services/multiversx.service';
import { OpenAI } from 'openai';

export interface AgentConfig {
  name: string;
  description: string;
  goals: string[];
  capabilities: string[];
  personality: string;
  apiKey: string;
}

export class BaseAgent {
  protected name: string;
  protected description: string;
  protected goals: string[];
  protected capabilities: string[];
  protected personality: string;
  protected multiversxService: MultiversXService;
  protected openai: OpenAI;
  protected memory: any[] = [];

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.description = config.description;
    this.goals = config.goals;
    this.capabilities = config.capabilities;
    this.personality = config.personality;
    this.multiversxService = new MultiversXService();
    this.openai = new OpenAI({
      apiKey: config.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  public async initialize(): Promise<void> {
    console.log(`Initializing agent: ${this.name}`);
    // Add any initialization logic here
  }

  public async processMessage(message: string): Promise<string> {
    // Store the message in memory
    this.memory.push({ role: 'user', content: message });

    // Process the message with OpenAI
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        ...this.memory.slice(-10), // Keep the last 10 messages for context
      ],
    });

    const reply = response.choices[0]?.message?.content || 'I could not process your request.';
    
    // Store the response in memory
    this.memory.push({ role: 'assistant', content: reply });
    
    return reply;
  }

  protected getSystemPrompt(): string {
    return `
You are ${this.name}, an AI agent with the following description:
${this.description}

Your goals are:
${this.goals.map(goal => `- ${goal}`).join('\n')}

Your capabilities include:
${this.capabilities.map(capability => `- ${capability}`).join('\n')}

Your personality is:
${this.personality}

You are an expert in MultiversX blockchain and DeFi operations. You can help users with token transfers, swaps, and market analysis.
Always respond in a helpful, accurate, and concise manner.
    `;
  }

  public async executeAction(action: string, params: any): Promise<any> {
    console.log(`Executing action: ${action} with params:`, params);
    // This method should be overridden by specific agent implementations
    throw new Error('Method not implemented');
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getGoals(): string[] {
    return this.goals;
  }

  public getCapabilities(): string[] {
    return this.capabilities;
  }

  public getPersonality(): string {
    return this.personality;
  }
} 