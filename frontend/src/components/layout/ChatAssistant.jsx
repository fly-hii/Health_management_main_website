import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, X, Bot, ArrowRight } from 'lucide-react'
import axios from 'axios'

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to CarePlus Support Assistant! 🏥 I can help you find features, navigate portals, or answer any questions about our hospital system. How can I assist you today?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Listen for search queries dispatched from Header search bar
  useEffect(() => {
    const handleOpenWithQuery = (e) => {
      const query = e.detail?.query
      if (query) {
        setIsOpen(true)
        setMessages(prev => {
          const updated = [...prev, { role: 'user', content: query }]
          setIsLoading(true)
          axios.post('/api/chat', { messages: updated })
            .then(response => {
              const aiData = response.data?.data
              if (aiData) {
                setMessages(p => [...p, { role: 'assistant', content: aiData.reply }])
                if (aiData.action && aiData.action.type === 'navigate') {
                  setTimeout(() => navigate(aiData.action.payload), 1000)
                }
              } else {
                setMessages(p => [...p, { role: 'assistant', content: 'I apologize, I received an invalid response.' }])
              }
            })
            .catch(error => {
              console.error('Search query chat error:', error)
              const errorMsg = error.response?.data?.message || 'Sorry, I encountered an issue connecting to the assistant.'
              setMessages(p => [...p, { role: 'assistant', content: errorMsg }])
            })
            .finally(() => {
              setIsLoading(false)
            })
          return updated
        })
      }
    }
    window.addEventListener('open-chat-with-query', handleOpenWithQuery)
    return () => window.removeEventListener('open-chat-with-query', handleOpenWithQuery)
  }, [navigate])

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue.trim()
    if (!text) return

    if (!textToSend) {
      setInputValue('')
    }

    // Add user message
    const updatedMessages = [...messages, { role: 'user', content: text }]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', { messages: updatedMessages })
      const aiData = response.data?.data

      if (aiData) {
        // Add assistant message
        setMessages(prev => [...prev, { role: 'assistant', content: aiData.reply }])

        // Handle navigation action if provided
        if (aiData.action && aiData.action.type === 'navigate') {
          setTimeout(() => {
            navigate(aiData.action.payload)
          }, 1000)
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, I received an invalid response. How else can I help?' }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMsg = error.response?.data?.message || 'Sorry, I encountered an issue connecting to the assistant. Please try again later.'
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedPrompts = [
    { label: 'Subscribe / Checkout', text: 'How do I subscribe and sign up for CarePlus?' },
    { label: 'Doctor Login Portal', text: 'Take me to the Doctor login portal' },
    { label: 'Check System Status', text: 'Is the database and system status online right now?' },
    { label: 'About CarePlus', text: 'Tell me about the CarePlus hospital management system.' }
  ]

  return (
    <>
      {/* Quick Links (WhatsApp & Instagram) */}
      <AnimatePresence>
        {!isOpen && (
          <>
            {/* Instagram Link (Placed above the chat button) */}
            <div 
              style={{
                position: 'fixed',
                bottom: 96,
                right: 30,
                zIndex: 9998,
              }}
              className="insta-wrapper"
            >
              <span className="insta-tooltip">Follow @andra_student_103</span>
              <motion.a
                href="https://instagram.com/andra_student_103"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(220, 39, 67, 0.3)',
                  cursor: 'pointer',
                }}
                className="insta-btn hover-card"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
            </div>

            {/* WhatsApp Link (Placed to the left of the chat button) */}
            <div 
              style={{
                position: 'fixed',
                bottom: 30,
                right: 96,
                zIndex: 9998,
              }}
              className="wa-wrapper"
            >
              <span className="wa-tooltip">Chat on WhatsApp</span>
              <motion.a
                href="https://wa.me/917032338115"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 15, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#25D366',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                  cursor: 'pointer',
                }}
                className="wa-btn hover-card"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.763.461 3.42 1.268 4.877L2 22l5.27-1.233A9.945 9.945 0 0 0 12.004 22c5.52 0 10-4.48 10-10.004S17.524 2 12.004 2zm0 18.004c-1.61 0-3.12-.418-4.437-1.15l-.317-.188-3.29.77.785-3.14-.207-.33A8.007 8.007 0 0 1 4 12.004C4 7.59 7.59 4 12.004 4c4.414 0 8 3.59 8 8.004 0 4.414-3.586 8-8 8zM15.86 13.91c-.24-.12-.14-.7-.417-.838-.135-.069-.226-.1-.32-.24-.09-.138-.344-.655-.42-.81-.077-.152-.154-.31-.277-.457-.123-.146-.246-.293-.414-.424-.46-.356-.96-.442-1.123-.46-.16-.019-.315.047-.406.138-.09.09-.383.374-.537.58-.153.207-.323.4-.492.564-.17.164-.323.277-.554.17-.231-.108-.98-.4-1.868-1.19-.69-.617-1.157-1.38-1.293-1.613-.135-.23-.015-.356.1-.47.104-.105.23-.27.346-.407.115-.138.154-.23.23-.384.077-.154.039-.29-.02-.407-.057-.12-.516-1.24-.707-1.7-.186-.447-.375-.386-.516-.393-.135-.007-.29-.008-.447-.008-.157 0-.414.059-.63.29-.217.23-.827.81-.827 1.97 0 1.163.846 2.285.96 2.44.116.155 1.666 2.545 4.037 3.57.564.243 1.005.388 1.35.498.57.18 1.088.154 1.5.093.457-.068 1.4-.57 1.597-1.12.197-.55.197-1.02.138-1.12-.059-.1-.217-.158-.456-.278z"/>
                </svg>
              </motion.a>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F9D8A, #06B6D4)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(15, 157, 138, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
          }}
          className="hover-card pulse-ring"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={28} />
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#10B981',
                border: '2px solid white'
              }} />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'fixed',
              bottom: 96,
              right: 24,
              width: 'min(400px, 90vw)',
              height: 'min(600px, 75vh)',
              borderRadius: 24,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(11, 31, 58, 0.15)',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.7)',
            }}
            className="glass-card"
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0F9D8A 0%, #06B6D4 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>CarePlus Copilot</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.8)' }}>AI Assistant Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  transition: 'all 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              background: 'rgba(248, 250, 252, 0.6)',
            }}>
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user'
                return (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!isUser && index > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, marginLeft: 4 }}>
                        <Bot size={12} style={{ color: '#0F9D8A' }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CarePlus Bot</span>
                      </div>
                    )}
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                      background: isUser ? 'linear-gradient(135deg, #0F9D8A, #06B6D4)' : '#FFFFFF',
                      color: isUser ? 'white' : '#0B1F3A',
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontWeight: isUser ? 500 : 400,
                      boxShadow: isUser 
                        ? '0 4px 15px rgba(15, 157, 138, 0.2)' 
                        : '0 4px 15px rgba(11, 31, 58, 0.04)',
                      border: isUser ? 'none' : '1px solid rgba(226, 232, 240, 0.8)',
                    }}>
                      {msg.content}
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', maxWidth: '85%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, marginLeft: 4 }}>
                    <Bot size={12} style={{ color: '#0F9D8A' }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Thinking...</span>
                  </div>
                  <div style={{
                    padding: '12px 20px',
                    borderRadius: '18px 18px 18px 2px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 15px rgba(11, 31, 58, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F9D8A', display: 'inline-block', animation: 'bounce-dot 1.4s infinite ease-in-out both' }} />
                    <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F9D8A', display: 'inline-block', animation: 'bounce-dot 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                    <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F9D8A', display: 'inline-block', animation: 'bounce-dot 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              {/* Suggestion Prompts */}
              {messages.length === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Actions</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(p.text)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 12,
                          background: 'white',
                          border: '1.5px solid #F1F5F9',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          gap: 6
                        }}
                      >
                        <span style={{ flex: 1 }}>{p.label}</span>
                        <ArrowRight size={12} style={{ color: '#0F9D8A' }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div style={{
              padding: '16px 20px',
              background: 'white',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about CarePlus..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 14,
                  color: '#0B1F3A',
                  fontFamily: 'inherit',
                  padding: '8px 0'
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: inputValue.trim() ? 'linear-gradient(135deg, #0F9D8A, #06B6D4)' : '#F1F5F9',
                  color: inputValue.trim() ? 'white' : '#94A3B8',
                  border: 'none',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        /* Instagram layout (Above) */
        .insta-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          animation: float-vertical 3s ease-in-out infinite;
        }
        .insta-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          background: rgba(11, 31, 58, 0.95);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(11, 31, 58, 0.12);
        }
        .insta-wrapper:hover .insta-tooltip {
          opacity: 1;
          transform: translateX(0);
        }
        @keyframes float-vertical {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        .insta-btn {
          transition: all 0.2s ease-in-out;
        }
        .insta-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(220, 39, 67, 0.5) !important;
        }

        /* WhatsApp layout (Left) */
        .wa-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: float-horizontal 3.5s ease-in-out infinite;
        }
        .wa-tooltip {
          position: absolute;
          bottom: calc(100% + 12px);
          background: rgba(11, 31, 58, 0.95);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(8px);
          box-shadow: 0 4px 12px rgba(11, 31, 58, 0.12);
        }
        .wa-wrapper:hover .wa-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes float-horizontal {
          0% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
          100% { transform: translateX(0); }
        }
        .wa-btn {
          transition: all 0.2s ease-in-out;
        }
        .wa-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5) !important;
        }
      `}</style>
    </>
  )
}
