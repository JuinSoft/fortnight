import { BaseAgent, AgentConfig } from './templates/BaseAgent';
import axios from 'axios';

interface SentimentAnalysisAgentConfig extends AgentConfig {
  dataSources: string[];
  updateFrequency: number; // in minutes
}

interface SentimentResult {
  token: string;
  overallSentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  sources: {
    source: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
    excerpts: string[];
  }[];
  timestamp: number;
}

export class SentimentAnalysisAgent extends BaseAgent {
  private dataSources: string[];
  private updateFrequency: number;
  private sentimentCache: Map<string, SentimentResult> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(config: SentimentAnalysisAgentConfig) {
    super(config);
    this.dataSources = config.dataSources;
    this.updateFrequency = config.updateFrequency;
  }

  public async initialize(): Promise<void> {
    await super.initialize();
    
    // Start the automatic update interval
    this.updateInterval = setInterval(() => {
      this.updateAllSentiments();
    }, this.updateFrequency * 60 * 1000);
    
    // Initial update
    await this.updateAllSentiments();
  }

  public async executeAction(action: string, params: any): Promise<any> {
    switch (action) {
      case 'analyzeSentiment':
        return this.analyzeSentiment(params.token);
      case 'getMarketMood':
        return this.getMarketMood();
      case 'trackSocialMentions':
        return this.trackSocialMentions(params.token, params.timeframe);
      case 'compareTokenSentiments':
        return this.compareTokenSentiments(params.tokens);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async analyzeSentiment(token: string): Promise<SentimentResult> {
    // Check if we have a recent result in cache
    const cachedResult = this.sentimentCache.get(token);
    if (cachedResult && Date.now() - cachedResult.timestamp < this.updateFrequency * 60 * 1000) {
      return cachedResult;
    }

    // Collect data from various sources
    const sentimentData = await this.collectSentimentData(token);
    
    // Analyze the sentiment using OpenAI
    const result = await this.processSentimentWithAI(token, sentimentData);
    
    // Cache the result
    this.sentimentCache.set(token, result);
    
    return result;
  }

  private async getMarketMood(): Promise<any> {
    try {
      // Use OpenAI to analyze overall market sentiment
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market sentiment analyst. Analyze the current overall market mood and provide insights.',
          },
          {
            role: 'user',
            content: 'What is the current overall sentiment in the cryptocurrency market? Consider recent news, social media trends, and market movements.',
          },
        ],
      });

      const analysis = response.choices[0]?.message?.content || 'Could not generate market mood analysis.';
      
      return {
        success: true,
        analysis,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error analyzing market mood:', error);
      return {
        success: false,
        message: `Error analyzing market mood: ${error.message}`,
      };
    }
  }

  private async trackSocialMentions(token: string, timeframe: string): Promise<any> {
    try {
      // This would connect to social media APIs in a real implementation
      // For now, we'll simulate with OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a social media analyst tracking mentions of ${token} over the ${timeframe} timeframe. Provide detailed analysis of social mentions.`,
          },
          {
            role: 'user',
            content: `Generate a detailed report of social media mentions for ${token} over the ${timeframe} timeframe. Include mention count, sentiment trends, and key influencers.`,
          },
        ],
      });

      const analysis = response.choices[0]?.message?.content || 'Could not generate social mention analysis.';
      
      return {
        success: true,
        token,
        timeframe,
        analysis,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error tracking social mentions:', error);
      return {
        success: false,
        message: `Error tracking social mentions: ${error.message}`,
      };
    }
  }

  private async compareTokenSentiments(tokens: string[]): Promise<any> {
    try {
      // Analyze sentiment for each token
      const sentiments = await Promise.all(
        tokens.map(token => this.analyzeSentiment(token))
      );
      
      // Use OpenAI to compare the sentiments
      const tokensWithSentiments = sentiments.map(s => 
        `${s.token}: ${s.overallSentiment} (score: ${s.score})`
      ).join('\n');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency sentiment comparison analyst. Compare the sentiment of different tokens and provide insights.',
          },
          {
            role: 'user',
            content: `Compare the sentiment of the following tokens:\n${tokensWithSentiments}\n\nProvide a detailed comparison and investment recommendations based on sentiment.`,
          },
        ],
      });

      const analysis = response.choices[0]?.message?.content || 'Could not generate sentiment comparison.';
      
      return {
        success: true,
        tokens,
        individualSentiments: sentiments,
        comparison: analysis,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error comparing token sentiments:', error);
      return {
        success: false,
        message: `Error comparing token sentiments: ${error.message}`,
      };
    }
  }

  private async updateAllSentiments(): Promise<void> {
    // This would update sentiments for all tracked tokens
    // For a real implementation, you would maintain a list of tokens to track
    console.log('Updating all sentiments...');
    // Implementation would go here
  }

  private async collectSentimentData(token: string): Promise<any[]> {
    // This would collect data from various sources in a real implementation
    // For now, we'll return mock data
    return [
      {
        source: 'Twitter',
        data: `${token} is trending with mostly positive comments about its recent partnership.`,
      },
      {
        source: 'Reddit',
        data: `r/cryptocurrency has mixed feelings about ${token}, with concerns about tokenomics but excitement about the technology.`,
      },
      {
        source: 'News',
        data: `Recent news about ${token} includes a major exchange listing and a security audit completion.`,
      },
    ];
  }

  private async processSentimentWithAI(token: string, sentimentData: any[]): Promise<SentimentResult> {
    // Format the data for the AI
    const formattedData = sentimentData.map(item => 
      `Source: ${item.source}\nData: ${item.data}`
    ).join('\n\n');
    
    // Use OpenAI to analyze the sentiment
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a cryptocurrency sentiment analyst. Analyze the sentiment for ${token} based on the provided data. 
          Return a JSON object with the following structure:
          {
            "overallSentiment": "positive" | "neutral" | "negative",
            "score": number between -1 and 1,
            "sources": [
              {
                "source": string,
                "sentiment": "positive" | "neutral" | "negative",
                "score": number between -1 and 1,
                "excerpts": [string]
              }
            ]
          }`,
        },
        {
          role: 'user',
          content: `Analyze the sentiment for ${token} based on the following data:\n\n${formattedData}`,
        },
      ],
    });

    const analysisText = response.choices[0]?.message?.content || '{}';
    
    try {
      // Extract the JSON from the response
      const jsonMatch = analysisText.match(/```json\n([\s\S]*)\n```/) || 
                        analysisText.match(/{[\s\S]*}/);
      
      const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
      const analysis = JSON.parse(jsonStr.replace(/```json\n|```/g, ''));
      
      return {
        token,
        overallSentiment: analysis.overallSentiment,
        score: analysis.score,
        sources: analysis.sources,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error parsing sentiment analysis:', error);
      // Return a default result
      return {
        token,
        overallSentiment: 'neutral',
        score: 0,
        sources: sentimentData.map(item => ({
          source: item.source,
          sentiment: 'neutral',
          score: 0,
          excerpts: [item.data],
        })),
        timestamp: Date.now(),
      };
    }
  }

  // Clean up when the agent is no longer needed
  public cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
} 