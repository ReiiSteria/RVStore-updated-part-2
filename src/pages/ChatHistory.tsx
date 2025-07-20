import React, { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Search, Bot, User } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ChatMessage } from '../types';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const CHAT_SESSIONS_KEY = 'rvs_chat_sessions';

export const ChatHistory: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = () => {
    try {
      const savedSessions = localStorage.getItem(CHAT_SESSIONS_KEY);
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      } else {
        // Check for old chat history format and migrate
        const oldHistory = localStorage.getItem('rvs_chat_history');
        if (oldHistory) {
          try {
            const oldMessages = JSON.parse(oldHistory).map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            
            if (oldMessages.length > 0) {
              const migratedSession: ChatSession = {
                id: 'migrated-session',
                title: 'Previous Chat Session',
                messages: oldMessages,
                createdAt: new Date(oldMessages[0].timestamp),
                updatedAt: new Date(oldMessages[oldMessages.length - 1].timestamp)
              };
              
              setChatSessions([migratedSession]);
              localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify([migratedSession]));
              localStorage.removeItem('rvs_chat_history'); // Clean up old format
            }
          } catch (error) {
            console.error('Error migrating old chat history:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this chat session?')) {
      const updatedSessions = chatSessions.filter(session => session.id !== sessionId);
      setChatSessions(updatedSessions);
      localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updatedSessions));
      
      if (selectedSession && selectedSession.id === sessionId) {
        setSelectedSession(null);
      }
    }
  };

  const restoreSession = (session: ChatSession) => {
    // Restore the session to current chat and update chatbot
    localStorage.setItem('rvs_chat_history', JSON.stringify(session.messages));
    
    // Trigger a custom event to notify the chatbot component
    const restoreEvent = new CustomEvent('chatSessionRestore', {
      detail: { messages: session.messages }
    });
    window.dispatchEvent(restoreEvent);
    
    alert('Chat session restored! The conversation has been loaded in the chatbot.');
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat History</h1>
            <p className="text-gray-600 mt-1">View and manage your AI assistant conversation history</p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <Input
              placeholder="Search chat sessions by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Chat Sessions ({filteredSessions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredSessions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No chat sessions found</p>
                      <p className="text-sm mt-1">Start chatting with the AI assistant to create history</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredSessions.map((session) => (
                        <div
                          key={session.id}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedSession?.id === session.id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                          }`}
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {session.title}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                {session.messages.length} messages
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {session.updatedAt.toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  restoreSession(session);
                                }}
                                title="Restore Session"
                              >
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSession(session.id);
                                }}
                                title="Delete Session"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedSession ? (
                    <>
                      <span>{selectedSession.title}</span>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {selectedSession.createdAt.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </>
                  ) : (
                    'Select a chat session to view details'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSession ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedSession.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg p-3 ${
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
                              <p className="text-sm whitespace-pre-wrap break-words">
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
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a chat session from the list to view the conversation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};