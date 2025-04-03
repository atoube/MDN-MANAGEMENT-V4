import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { callMarketingAssistant } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MarketingAssistantProps {
  onSuggestionSelect?: (suggestion: string) => void;
}

export function MarketingAssistant({ onSuggestionSelect }: MarketingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant marketing. Je peux vous aider à optimiser vos messages de campagne. Comment puis-je vous aider ?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const { message } = await callMarketingAssistant({
        message: userMessage,
        messages: messages
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, j'ai rencontré une erreur. Veuillez réessayer."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <MessageCircle className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Assistant Marketing</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              {message.role === 'assistant' && onSuggestionSelect && (
                <button
                  onClick={() => onSuggestionSelect(message.content)}
                  className="text-xs text-indigo-600 mt-2 hover:underline"
                >
                  Utiliser cette suggestion
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}