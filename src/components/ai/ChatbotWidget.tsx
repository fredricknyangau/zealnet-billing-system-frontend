
import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your WiFi assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
    }, 1000)
  }

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase()
    if (q.includes('slow') || q.includes('speed')) return "I can see your connection signal is strong (-45dBm). Try moving closer to the Access Point or reconnecting."
    if (q.includes('pay') || q.includes('buy')) return "You can buy more data directly from the dashboard. Would you like me to send you a payment link?"
    if (q.includes('balance') || q.includes('check')) return "Your current balance is 1.5GB, valid until tomorrow."
    return "I understand. Let me check that for you. Use the menu to run a diagnostic if needed."
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-80 sm:w-96 shadow-xl"
          >
            <Card className="border-primary/20">
              <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-base">WiFi Assistant</CardTitle>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent className="p-0 h-96 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted text-foreground rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t bg-background rounded-b-lg flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  )
}
