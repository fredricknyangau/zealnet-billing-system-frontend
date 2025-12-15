
import React, { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface ChatMessage {
  id: string
  text: string | React.ReactNode
  sender: 'user' | 'bot'
  timestamp: string
}

export const ChatSimulator: React.FC = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: '1',
        text: "👋 Welcome to WiFi Bot! \n\nI can help you:\n1️⃣ Buy Data\n2️⃣ Check Balance\n3️⃣ Get Support\n\nReply with a number.",
        sender: 'bot',
        timestamp: '10:00 AM'
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate Bot Response
    setTimeout(() => {
        let responseText: string | React.ReactNode = "I didn't quite get that. Type 'Menu' to start over."
        const lower = text.toLowerCase().trim()

        if (lower === '1' || lower.includes('buy')) {
            responseText = (
                <div className="space-y-2">
                    <p>📦 Choose a Data Bundle:</p>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        <button onClick={() => handleSend('Plan A')} className="bg-white text-primary p-2 rounded border border-gray-200 text-sm font-medium text-left">1. 1GB @ 50 KES (24h)</button>
                        <button onClick={() => handleSend('Plan B')} className="bg-white text-primary p-2 rounded border border-gray-200 text-sm font-medium text-left">2. Unlimited @ 1000 KES (30d)</button>
                    </div>
                </div>
            )
        } else if (lower === '2' || lower.includes('balance')) {
            responseText = "📊 Your Balance:\n\nData: 450MB\nExpires: Tomorrow, 11:00 AM"
        } else if (lower === '3' || lower.includes('support')) {
             responseText = "🛠 Support Ticket #9921 created. An agent will call you shortly."
        } else if (lower.includes('plan')) {
            responseText = "✅ Payment Request sent to your phone. Enter PIN to complete purchase."
        } else if (lower === 'menu') {
            responseText = "👋 Welcome to WiFi Bot! \n\nI can help you:\n1️⃣ Buy Data\n2️⃣ Check Balance\n3️⃣ Get Support\n\nReply with a number."
        }

        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: responseText,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, botMsg])
    }, 800)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4 font-sans">
      <div className="w-full max-w-md bg-[#efeae2] h-[80vh] rounded-xl overflow-hidden shadow-2xl flex flex-col relative font-sans">
        {/* Helper Badge */}
        <div className="absolute -top-10 left-0 right-0 text-center text-white/70 text-sm">
            Mock WhatsApp Interaction
        </div>

        {/* Header */}
        <div className="bg-[#075e54] p-3 text-white flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/')}>
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=WiFi+Bot&background=25D366&color=fff" alt="Bot" />
                </div>
                <div>
                   <h3 className="font-semibold text-sm">WiFi Bot</h3>
                   <p className="text-xs opacity-80">business account</p>
                </div>
            </div>
            <div className="flex gap-4">
                <Video className="h-5 w-5" />
                <Phone className="h-5 w-5" />
                <MoreVertical className="h-5 w-5" />
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
            {messages.map((msg) => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[80%] p-2 px-3 rounded-lg shadow-sm text-sm relative ${
                        msg.sender === 'user' 
                        ? 'bg-[#dcf8c6] text-black rounded-tr-none' 
                        : 'bg-white text-black rounded-tl-none'
                    }`}>
                        <div className="mb-1">{msg.text}</div>
                        <div className="text-[10px] text-gray-500 text-right flex justify-end items-center gap-1">
                            {msg.timestamp}
                            {msg.sender === 'user' && <span className="text-blue-500">✓✓</span>}
                        </div>
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f0f0] p-2 px-3 flex items-center gap-2">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text" 
                placeholder="Type a message" 
                className="flex-1 rounded-full py-2 px-4 border-none focus:outline-none text-sm"
            />
            <button 
                onClick={() => handleSend()}
                className="h-10 w-10 bg-[#075e54] rounded-full flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform"
            >
                <Send className="h-4 w-4 ml-0.5" />
            </button>
        </div>
      </div>
    </div>
  )
}
