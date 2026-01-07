'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm the CLIMATRIX AI. Ask me about the audit results, global trends, or the dataset validity." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content, history }),
            });

            const data = await response.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to the knowledge base." }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] md:w-[400px] h-[500px] bg-black/90 backdrop-blur-xl border-white/20 shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 bg-blue-600/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-400" />
                            <div>
                                <h3 className="font-semibold text-white text-sm">CLIMATRIX Assistant</h3>
                                <p className="text-[10px] text-blue-200/70">Powered by Llama-3.3-70b</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === 'user' ? "bg-blue-600" : "bg-white/10"
                                )}>
                                    {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-blue-400" />}
                                </div>
                                <div className={cn(
                                    "rounded-lg p-3 text-sm max-w-[80%]",
                                    msg.role === 'user' ? "bg-blue-600/50 text-white" : "bg-white/5 text-gray-200"
                                )}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                            strong: ({ node, ...props }) => <span className="font-bold text-blue-300" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Bot className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 flex items-center">
                                    <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/10 bg-white/5">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about the data..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <div className="relative group">
                    <div className="absolute -top-12 right-0 bg-white text-black text-xs font-bold py-1 px-3 rounded-xl shadow-lg animate-bounce pointer-events-none whitespace-nowrap">
                        Ask me anything!
                        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 animate-in zoom-in duration-300 relative"
                    >
                        <MessageCircle className="h-7 w-7" />
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>
                    </button>
                </div>
            )}
        </div>
    );
}
