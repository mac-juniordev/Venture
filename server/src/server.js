import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedMotivationMessages } from './utils/seedMotivation.js';
import { seedAchievements } from './utils/seedAchievements.js';
import { seedPlans } from './utils/seedPlans.js';
import { processSuspensions } from './services/accountService.js';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import growthRoutes from './routes/growthRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import motivationRoutes from './routes/motivationRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Architect connected to System Pulse');

  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('Architect joined admin room');
  });

  socket.on('disconnect', () => {
    console.log('Architect disconnected');
  });
});

// Connect to MongoDB
connectDB().then(async () => {
  // Migrate existing users
  await User.updateMany(
    { accountStatus: { $exists: false } },
    { $set: { accountStatus: 'active' } }
  );
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'user' } }
  );

  // Seed architect account
  try {
    await User.seedArchitect();
  } catch (err) {
    console.error('Failed to seed architect:', err.message);
  }

  seedMotivationMessages();
  seedAchievements();
  seedPlans();
  console.log('Database connected and seeded');
});

// Check for expired suspensions every hour
setInterval(() => {
  processSuspensions().then(count => {
    if (count > 0) console.log(`Processed ${count} expired suspensions`);
  });
}, 60 * 60 * 1000);

setTimeout(() => {
  processSuspensions().then(count => {
    if (count > 0) console.log(`Startup: Processed ${count} expired suspensions`);
  });
}, 5000);

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Make io available in requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/motivation', motivationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VENTURE API is running',
    timestamp: new Date().toISOString(),
    routes: [
      'auth', 'users', 'growth', 'challenges', 'motivation',
      'leaderboard', 'achievements', 'community', 'subscription',
      'payments', 'admin'
    ],
  });
});

// Error handling
app.use(errorHandler);

httpServer.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  console.log(`API: http://localhost:${env.PORT}/api`);
});

export default app;