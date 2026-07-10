import React from 'react';
import { 
  Flame, Star, Trophy, Crown, Zap, Target,
  Shield, Gem, Rocket, Heart, Bolt, Moon,
  Sun, Compass, Diamond, Swords
} from 'lucide-react';

const iconMap = {
  flame: Flame, star: Star, trophy: Trophy, crown: Crown,
  zap: Zap, target: Target, shield: Shield, gem: Gem,
  rocket: Rocket, heart: Heart, bolt: Bolt, moon: Moon,
  sun: Sun, compass: Compass, diamond: Diamond, fire: Flame,
  leaf: Heart, wave: Zap, sword: Swords,
};

const tierColors = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-gray-300 to-gray-400',
  gold: 'from-yellow-400 to-yellow-500',
  platinum: 'from-cyan-400 to-blue-500',
  legendary: 'from-purple-500 to-pink-500',
};

const tierGlow = {
  bronze: 'shadow-amber-500/30',
  silver: 'shadow-gray-400/30',
  gold: 'shadow-yellow-500/30',
  platinum: 'shadow-cyan-500/30',
  legendary: 'shadow-purple-500/50',
};

const AchievementBadge = ({ achievement, unlocked = false, unlockedAt, size = 'md', showTooltip = true }) => {
  const Icon = iconMap[achievement?.icon] || Star;

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <div className="relative group">
      <div className={`${sizes[size]} rounded-2xl flex items-center justify-center transition-all duration-300 ${
        unlocked
          ? `bg-gradient-to-br ${tierColors[achievement?.tier] || tierColors.bronze} shadow-lg ${tierGlow[achievement?.tier] || tierGlow.bronze}`
          : 'bg-gray-200 dark:bg-gray-700 opacity-40 grayscale'
      }`}>
        <Icon className={`${iconSizes[size]} ${unlocked ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
      </div>

      {unlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-800" />
      )}

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          <p className="font-bold">{achievement?.title}</p>
          <p className="text-gray-300">{achievement?.description}</p>
          {unlocked && unlockedAt && (
            <p className="text-emerald-400 mt-1">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;