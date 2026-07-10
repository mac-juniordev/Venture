
# VENTURE 🚀

### "The Journey of Growth"

> Turn consistency into measurable growth. Join challenges, track progress, and build your legacy — one day at a time.

**Powered by MacDotCom**

---

## 🌟 What is VENTURE?

VENTURE is a growth ecosystem where builders develop consistency through daily check-ins, compete in short-term challenges, earn achievements, and document their personal growth journey. It's not a task manager — it's a growth partner.

**Core Philosophy:** Consistency → Progress → Proof → Growth

---

## ✨ Features

### 🎯 Daily Growth Engine
- Daily check-in with mood tracking
- Streak calculation (current & longest)
- Growth timeline with interactive calendar
- Visual progress tracking
- Live digital clock with motivation messages

### ⚔️ Challenge System
- User-created challenges (7-day max)
- Competitive leaderboards
- Auto-winner declaration based on consistency
- XP rewards for winners
- Difficulty levels: Easy, Medium, Hard, Legendary

### 🏆 Achievement System
- 18+ gamified badges
- 5 tiers: Bronze, Silver, Gold, Platinum, Legendary
- XP system with progress tracking
- Auto-unlock on milestones
- Duolingo-style gamification

### 👥 Community
- Builder Feed (tech-focused, no idle chatter)
- Venture reactions (🔥💪🎉🚀👏⭐)
- Limited comments (1 per user, 280 char max)
- Auto tech category detection
- No doom scrolling

### 💬 Motivation Engine
- Time-based motivation messages
- Rotating categories (morning, grind, mindset)
- Fresh messages throughout the day

### 🎨 Premium Design
- Sky-blue/emerald green color scheme
- Dark/Light theme toggle on all pages
- Fully responsive (mobile, tablet, desktop)
- Social media-inspired, builder-focused UI
- No generic SaaS templates

### 🔐 Security
- JWT authentication
- bcrypt password hashing
- Security questions for account recovery
- Account management (suspend, reactivate, delete)

---

## 🏗️ Architecture

```

VENTURE/
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/        # AppLayout, Navbar, Sidebar, PublicNavbar
│   │   │   ├── ui/            # Button, Input, Modal, Avatar, Badge, Spinner
│   │   │   └── shared/        # AchievementBadge, ReactionPicker, StreakCounter
│   │   ├── pages/             # Route-level page components
│   │   │   ├── landing/       # Landing page with pricing
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── growth/        # Daily Check-in, Timeline
│   │   │   ├── challenges/    # Browse, Create, Detail, My Challenges
│   │   │   ├── leaderboard/   # Global Leaderboard
│   │   │   ├── achievements/  # Achievement showcase
│   │   │   ├── community/     # Builder Feed
│   │   │   ├── profile/       # Profile, Public Profile
│   │   │   ├── settings/      # Account & security settings
│   │   │   └── upgrade/       # Pricing plans
│   │   ├── context/           # Auth, Theme, Notification providers
│   │   ├── services/          # API service layer
│   │   └── hooks/             # Custom React hooks
│   └── ...
│
├── server/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── models/            # Mongoose models
│   │   ├── controllers/       # Route logic
│   │   ├── routes/            # Express route definitions
│   │   ├── middleware/         # Auth, error handling, upload
│   │   ├── services/          # Business logic
│   │   └── utils/             # Seed data, helpers
│   └── ...
│
└── README.md

```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS v4 |
| **Routing** | React Router v6 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Celebrations** | Canvas Confetti |
| **Notifications** | React Hot Toast |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcryptjs |
| **Real-time** | Socket.IO |
| **File Upload** | Multer |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/mac-juniordev/Venture.git
cd Venture

# Install backend dependencies
cd server
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string for JWT
# - CLIENT_URL: http://localhost:5173

# Install frontend dependencies
cd ../client
npm install

# Start backend server (port 5000)
cd ../server
npm run dev

# In a new terminal, start frontend (port 5173)
cd ../client
npm run dev
```

Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/venture
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

📦 Systems

# System Description
1 Foundation & Authentication Registration, login, JWT, protected routes
2 User Profile & Growth Identity Profiles, avatars, bio, social links, stats
3 Daily Growth Engine Check-ins, streak tracking, growth timeline
4 Motivation Engine Time-based motivation messages
5 Challenge System User-created challenges, 7-day max, auto-winner
6 Leaderboard System Global rankings, challenge leaderboards
7 Achievement System Gamified badges, XP, 5 tiers
8 Community Interaction Builder feed, reactions, limited comments

---

💰 Pricing Plans

Feature 🌱 Explorer 🚀 Builder 👑 Visionary
Price Free $9/month $19/month
Daily Check-ins ✅ ✅ ✅
Streak Tracking ✅ ✅ ✅
Join Challenges 3 max Unlimited Unlimited
Create Challenges ❌ ✅ ✅
Advanced Analytics ❌ ✅ ✅
Export Reports ❌ ✅ ✅
API Access ❌ ❌ ✅
Priority Support ❌ ❌ ✅
Custom Branding ❌ ❌ ✅

---

💳 Payment Methods

· 💳 Card Payments (Stripe-ready)
· 📱 MTN Mobile Money (Cameroon)
· 📱 Orange Money (Cameroon)

Backend payment architecture is complete. Add your API keys to go live.

---

🎨 Design

· Premium dark aesthetic with sky-blue and emerald green accents
· Social media-inspired, builder-focused interface
· Clean, modern, professional — no generic SaaS templates
· Dark/Light theme toggle available on every page
· Fully responsive across all device sizes

---

📱 Responsive

· 📱 Mobile: Stacked layouts, optimized touch targets
· 📱 Tablet: Adaptive grids, balanced spacing
· 💻 Desktop: Full multi-column layouts
· 🖥️ Wide: Max-width containers for readability

---

🔒 Security

· JWT authentication with configurable expiration
· Passwords hashed with bcrypt (12 salt rounds)
· Security questions for identity verification
· Account suspension with automatic archival
· Helmet.js security headers
· CORS protection
· Protected API routes

---

📂 Pages

Public Pages:

· Landing page (with pricing, features, about)
· Login
· Register

Builder Pages (Authenticated):

· Dashboard (greeting, stats, clock, motivation)
· Daily Check-in (mood, notes)
· Growth Timeline (calendar view, history)
· Challenges (browse, create, join)
· Challenge Detail (rules, participants, leaderboard)
· My Challenges
· Leaderboard
· Achievements
· Community Feed
· Profile (editable)
· Public Profile (view-only)
· Settings (account, security)
· Upgrade Plans

---

🚧 Roadmap

· Payment gateway live integration
· Email verification
· Password reset via email
· Push notifications
· Mobile app (React Native)
· API documentation
· Live demo deployment
· Automated testing suite

---

📄 License

This project is proprietary software. All rights reserved.

---

👨‍💻 Author

MacDotCom

· GitHub: @mac-juniordev

---

🙏 Acknowledgments

· Built with consistency and late nights 💪
· Inspired by builders everywhere 🚀
· Small daily actions compound into extraordinary results

---

VENTURE — The Journey of Growth
