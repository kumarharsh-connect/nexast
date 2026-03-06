# 🚀 Nexast - Real-Time Live Streaming Platform

Nexast is a full-stack, production-deployed live streaming platform that enables users to broadcast directly from their browser using WebRTC.

It supports real-time chat, viewer tracking, screen sharing, authentication, and live discovery — all built from scratch with modern web technologies.

🌍 **Live App:** [https://nexast.vercel.app](https://nexast.vercel.app)  
🔌 **Signaling Server:** [https://nexast.onrender.com](https://nexast.onrender.com)

* * *

## ✨ Features

*   🔴 Browser-based live streaming (WebRTC)
    
*   💬 Real-time chat (Socket.io)
    
*   👀 Live viewer count badge
    
*   🖥 Screen sharing with seamless track replacement
    
*   🔐 Authentication via Clerk
    
*   👤 Logged-in + anonymous chat identities
    
*   📡 Real-time signaling server
    
*   🔍 Search by stream title or username
    
*   🏠 Live discovery homepage
    
*   🎨 Dark glass morphism UI
    

* * *

## 🧱 Architecture Overview

### 🖥 Frontend

*   Next.js 16 (App Router)
    
*   Server Components
    
*   Tailwind CSS
    
*   Prisma ORM
    
*   Clerk Authentication
    
*   Socket.io Client
    
*   simple-peer (WebRTC abstraction)
    

### 🔌 Signaling Backend

*   Express
    
*   Socket.io
    
*   TypeScript
    
*   Helmet security middleware
    
*   CORS configured for production
    
*   Deployed on Render
    

### 🗄 Database

*   Supabase PostgreSQL
    
*   Connection pooling (6543)
    
*   Direct connection (5432)
    
*   Prisma Client
    

* * *

## ⚙️ Technical Challenges Solved

*   Multi-peer WebRTC signaling architecture
    
*   Race conditions in socket event ordering
    
*   React Strict Mode double WebSocket connections
    
*   Real-time viewer count synchronization
    
*   Stream auto-cleanup on window close
    
*   Screen share track replacement without breaking audio
    
*   App Router production caching issues
    
*   CORS configuration across frontend & backend
    
*   Secure WebSocket (wss) production deployment
    

* * *

## 📂 Project Structure

/apps  
  /web        → Next.js frontend  
  /signaling  → Express + Socket.io signaling server  
/prisma  
  schema.prisma

* * *

## 🔐 Environment Variables

### Frontend (Vercel)

*   NEXT\_PUBLIC\_SIGNALING\_URL
    
*   NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY
    
*   CLERK\_SECRET\_KEY
    
*   DATABASE\_URL
    
*   DIRECT\_URL
    

### Backend (Render)

*   CLIENT\_URL
    
*   PORT
    
*   NODE\_ENV
    

* * *

## 🚀 Local Development

### 1️⃣ Install dependencies

npm install

### 2️⃣ Run signaling server

cd apps/signaling  
npm run dev

### 3️⃣ Run frontend

cd apps/web  
npm run dev

* * *

## 🌍 Production Deployment

*   Frontend deployed on Vercel
    
*   Signaling server deployed on Render (Singapore region)
    
*   Database hosted on Supabase
    
*   Secure WebSocket connection via wss
    

* * *

## 📈 Future Improvements

*   Stream thumbnails via frame capture
    
*   Adaptive bitrate streaming
    
*   Stream recording
    
*   Moderation tools
    
*   Follow/subscribe system
    
*   Horizontal scaling of signaling server
    
*   Redis for distributed socket state
    

* * *

## 🧠 What I Learned

Building Nexast required deep understanding of:

*   WebRTC peer connection lifecycle
    
*   Real-time distributed systems
    
*   Production debugging in Next.js App Router
    
*   WebSocket scaling patterns
    
*   Deployment architecture across multiple service
