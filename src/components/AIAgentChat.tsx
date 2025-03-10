'use client';

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
    try {
      agentFactoryRef.current = new AgentFactory({ 
        apiKey: apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '' 
      });
      
      // Add a welcome message
      setMessages([
        {
          role: 'system',
          content: 'Welcome to Fortnight AI Agent Chat. Create or select an agent to get started.',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error initializing agent factory:", error);
      setMessages([
        {
          role: 'system',
          content: 'Error initializing AI agents. Please check your configuration.',
          timestamp: new Date(),
        },
      ]);
    }
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
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'system',
          content: `Error creating agent: ${error.message || 'Unknown error'}`,
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
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'system',
        content: `Error: ${error.message || 'Unknown error'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-xl font-bold">Fortnight AI Agent</h2>
        
        {!activeAgent ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Agent Type</label>
              <select
                value={selectedAgentType}
                onChange={(e) => setSelectedAgentType(e.target.value as AgentType)}
                className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm text-white"
              >
                <option value="trading">Trading Agent</option>
                <option value="sentiment">Sentiment Analysis Agent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-1">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm text-white"
                placeholder="Enter agent name"
              />
            </div>
            
            <button
              onClick={handleCreateAgent}
              className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded transition-all duration-300 hover:bg-blue-50 hover:shadow-md"
            >
              Create Agent
            </button>
            
            {availableAgents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Available Agents</h3>
                <div className="space-y-2">
                  {availableAgents.map((agent) => (
                    <div key={agent.name} className="flex items-center justify-between p-2 border rounded bg-white/10 backdrop-blur-sm">
                      <div>
                        <span className="font-medium text-white">{agent.name}</span>
                        <span className="ml-2 text-xs text-blue-200">({agent.type})</span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleSelectAgent(agent.name)}
                          className="text-white hover:text-blue-200 mr-2 transition-colors"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleRemoveAgent(agent.name)}
                          className="text-red-300 hover:text-red-100 transition-colors"
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
              <span className="font-medium text-white">{activeAgent.getName()}</span>
              <span className="ml-2 text-xs text-blue-200">
                {availableAgents.find(a => a.name === activeAgent.getName())?.type}
              </span>
            </div>
            <button
              onClick={() => setActiveAgent(null)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              Change Agent
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
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
              className={`inline-block p-3 rounded-lg shadow-sm transition-all duration-300 animate-fadeIn ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'agent'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm'
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
        <div className="p-4 border-t bg-white dark:bg-gray-800">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 border rounded-l bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-r transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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