import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [liveUserCount, setLiveUserCount] = useState(0)
  const [systemHealth, setSystemHealth] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5009', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('live_user_count', (count) => setLiveUserCount(count))
    socket.on('system_health', (health) => setSystemHealth(health))
    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev].slice(0, 20))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    }
  }

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      connected,
      liveUserCount,
      systemHealth,
      notifications,
      emit,
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used inside SocketProvider')
  return ctx
}
