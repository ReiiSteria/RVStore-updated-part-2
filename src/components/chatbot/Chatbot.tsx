import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useChatbot } from '../../hooks/useChatbot';
import { ChatMessage } from '../../types';

const CHAT_HISTORY_KEY = 'rvs_chat_history';
const CHAT_SESSIONS_KEY = 'rvs_chat_sessions';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading } = useChatbot();

  // Load chat history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setMessages(parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Initialize with welcome message if history is corrupted
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, []);

  // Listen for chat session restore events
  useEffect(() => {
    const handleChatRestore = (event: CustomEvent) => {
      const restoredMessages = event.detail.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(restoredMessages);
      
      // Open chatbot if it's closed
      if (!isOpen) {
        setIsOpen(true);
      }
      
      // Scroll to bottom after a short delay
      setTimeout(scrollToBottom, 300);
    };

    window.addEventListener('chatSessionRestore', handleChatRestore as EventListener);
    
    return () => {
      window.removeEventListener('chatSessionRestore', handleChatRestore as EventListener);
    };
  }, [isOpen]);
  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      
      // Also update chat sessions if there are meaningful messages
      if (messages.length > 1) { // More than just welcome message
        updateChatSessions();
      }
    }
  }, [messages]);

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: 'Halo! Saya adalah asisten AI untuk RVS. Saya dapat membantu Anda menganalisis data penjualan, memberikan insight bisnis, dan menjawab pertanyaan tentang performa toko. Apa yang ingin Anda ketahui?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const updateChatSessions = () => {
    try {
      const existingSessions = JSON.parse(localStorage.getItem(CHAT_SESSIONS_KEY) || '[]');
      const currentSessionId = 'current-session';
      
      // Generate title from user messages
      const userMessages = messages.filter(msg => msg.type === 'user');
      let title = 'New Chat Session';
      
      if (userMessages.length > 0) {
        const firstUserMessage = userMessages[0].content;
        const words = firstUserMessage.split(' ').slice(0, 6).join(' ');
        title = words.length > 30 ? words.substring(0, 30) + '...' : words;
      }
      
      const currentSession: ChatSession = {
        id: currentSessionId,
        title,
        messages: messages,
        createdAt: new Date(messages[0].timestamp),
        updatedAt: new Date()
      };
      
      // Update or add current session
      const sessionIndex = existingSessions.findIndex((s: ChatSession) => s.id === currentSessionId);
      if (sessionIndex >= 0) {
        existingSessions[sessionIndex] = currentSession;
      } else {
        existingSessions.unshift(currentSession);
      }
      
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(existingSessions));
    } catch (error) {
      console.error('Error updating chat sessions:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when chatbot opens
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await sendMessage(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    if (messages.length > 1) { // More than just welcome message
      // Save current conversation to sessions
      try {
        const existingSessions = JSON.parse(localStorage.getItem(CHAT_SESSIONS_KEY) || '[]');
        
        // Generate title from user messages
        const userMessages = messages.filter(msg => msg.type === 'user');
        let title = 'Chat Session';
        
        if (userMessages.length > 0) {
          const firstUserMessage = userMessages[0].content;
          const words = firstUserMessage.split(' ').slice(0, 6).join(' ');
          title = words.length > 30 ? words.substring(0, 30) + '...' : words;
        }
        
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title,
          messages: messages,
          createdAt: new Date(messages[0].timestamp),
          updatedAt: new Date()
        };
        
        existingSessions.unshift(newSession);
        localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(existingSessions));
      } catch (error) {
        console.error('Error saving chat session:', error);
      }
    }
    
    // Clear current chat and start fresh
    localStorage.removeItem(CHAT_HISTORY_KEY);
    initializeChat();
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-40 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-lg">
                    <Bot className="h-5 w-5 mr-2" />
                    RVS Assistant
                  </CardTitle>
                  <p className="text-purple-100 text-sm">AI Sales Analytics Helper</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNewConversation}
                  className="text-white hover:bg-purple-700"
                  title="Start new conversation"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages Container */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#8B5CF6 #F3F4F6'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 6px;
                  }
                  div::-webkit-scrollbar-track {
                    background: #F3F4F6;
                    border-radius: 3px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: #8B5CF6;
                    border-radius: 3px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: #7C3AED;
                  }
                `}</style>
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in-50 slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <Bot className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-purple-600" />
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                        <span className="text-sm text-gray-600">Sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-4 flex-shrink-0">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tanyakan tentang penjualan, analisis, atau insight bisnis..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Tekan Enter untuk mengirim • History tersimpan otomatis
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};