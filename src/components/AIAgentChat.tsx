import React, { useState, useEffect, useRef } from 'react';
import { AgentFactory, AgentType } from '@/agents/AgentFactory';
import { BaseAgent } from '@/agents/templates/BaseAgent';

interface Message {
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

interface AIAgentChatProps {
  apiKey?: string;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType>('trading');
  const [agentName, setAgentName] = useState('');
  const [activeAgent, setActiveAgent] = useState<BaseAgent | null>(null);
  const [availableAgents, setAvailableAgents] = useState<{ name: string; type: string }[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentFactoryRef = useRef<AgentFactory | null>(null);

  // Initialize the agent factory
  useEffect(() => {
    agentFactoryRef.current = new AgentFactory({ 
      apiKey: apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '' 
    });
    
    // Add a welcome message
    setMessages([
      {
        role: 'system',
        content: 'Welcome to the AI Agent Chat. Create or select an agent to get started.',
        timestamp: new Date(),
      },
    ]);
  }, [apiKey]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update available agents when an agent is created or removed
  const updateAvailableAgents = () => {
    if (agentFactoryRef.current) {
      setAvailableAgents(agentFactoryRef.current.listAgents());
    }
  };

  const handleCreateAgent = () => {
    if (!agentName.trim()) {
      alert('Please enter an agent name');
      return;
    }

    try {
      const agent = agentFactoryRef.current?.createAgent(selectedAgentType, agentName, {});
      if (agent) {
        setActiveAgent(agent);
        updateAvailableAgents();
        
        setMessages(prev => [
          ...prev,
          {
            role: 'system',
            content: `Agent "${agentName}" (${selectedAgentType}) has been created and is now active.`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'system',
          content: `Error creating agent: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSelectAgent = (name: string) => {
    const agent = agentFactoryRef.current?.getAgent(name);
    if (agent) {
      setActiveAgent(agent);
      
      setMessages(prev => [
        ...prev,
        {
          role: 'system',
          content: `Agent "${name}" is now active.`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleRemoveAgent = (name: string) => {
    const removed = agentFactoryRef.current?.removeAgent(name);
    if (removed) {
      if (activeAgent && activeAgent.getName() === name) {
        setActiveAgent(null);
      }
      
      updateAvailableAgents();
      
      setMessages(prev => [
        ...prev,
        {
          role: 'system',
          content: `Agent "${name}" has been removed.`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !activeAgent) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await activeAgent.processMessage(input);
      
      const agentMessage: Message = {
        role: 'agent',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'system',
        content: `Error: ${error.message}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-xl font-bold">AI Agent Chat</h2>
        
        {!activeAgent ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
              <select
                value={selectedAgentType}
                onChange={(e) => setSelectedAgentType(e.target.value as AgentType)}
                className="w-full p-2 border rounded"
              >
                <option value="trading">Trading Agent</option>
                <option value="sentiment">Sentiment Analysis Agent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter agent name"
              />
            </div>
            
            <button
              onClick={handleCreateAgent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Agent
            </button>
            
            {availableAgents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Available Agents</h3>
                <div className="space-y-2">
                  {availableAgents.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{agent.name}</span>
                        <span className="ml-2 text-xs text-gray-500">({agent.type})</span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleSelectAgent(agent.name)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleRemoveAgent(agent.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="font-medium">{activeAgent.getName()}</span>
              <span className="ml-2 text-xs text-gray-500">
                {availableAgents.find(a => a.name === activeAgent.getName())?.type}
              </span>
            </div>
            <button
              onClick={() => setActiveAgent(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Change Agent
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user'
                ? 'text-right'
                : message.role === 'agent'
                ? 'text-left'
                : 'text-center'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 text-blue-900'
                  : message.role === 'agent'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-gray-200 text-gray-700 text-sm'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {activeAgent && (
        <div className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 border rounded-l"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 