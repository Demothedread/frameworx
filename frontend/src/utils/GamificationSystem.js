/**
 * Gamified Navigation System for Channel Rolodex
 * 
 * A comprehensive gamification system that blends Belle Époque elegance
 * with early 2000s Japanese futurism, featuring:
 * - XP progression with "Salon Credits" and "Data Points"
 * - Achievement system with unlockable rewards
 * - Fortune-telling wheel for random channel discovery
 * - Cyberpunk HUD overlays with vintage aesthetics
 * - Social features and leaderboards
 * - Time-based bonuses and streaks
 */

class GamificationSystem {
  constructor() {
    this.storageKey = 'channelRolodexGamification';
    this.data = this.loadData();
    this.listeners = new Set();
    
    // Achievement definitions
        this.achievements = {
          explorer: {
            id: 'explorer',
            name: 'Flâneur of the Fold',
            description: 'Haunt every salon in the rolodex.',
            icon: '🗺️',
            belleEpoqueTitle: 'Arbiter of the Arcane',
            futuristicTitle: 'Chronomancer of the Cache',
            salonCredits: 100,
            dataPoints: 50,
            unlocks: ['goldenFrame', 'explorerBadge']
          },
          socialite: {
            id: 'socialite',
            name: 'Ghost in the Machine',
            description: 'Loiter with intent for 1,800 seconds.',
            icon: '🎭',
            belleEpoqueTitle: 'L\'Esprit de l\'Escalier',
            futuristicTitle: 'Sentient Social Algorithm',
            salonCredits: 200,
            dataPoints: 100,
            unlocks: ['socialiteFrame', 'timeTracker']
          },
          fortuneTeller: {
            id: 'fortuneTeller',
            name: 'Tarot Technomancer',
            description: 'Consult the digital oracle ten times.',
            icon: '🔮',
            belleEpoqueTitle: 'Sibyl of the Circuit',
            futuristicTitle: 'Quantum Chiromancer',
            salonCredits: 150,
            dataPoints: 75,
            unlocks: ['mysticWheel', 'fortuneFrame']
          },
          speedDemon: {
            id: 'speedDemon',
            name: 'Synaptic Sprinter',
            description: 'Flicker through 5 channels in 10 seconds.',
            icon: '⚡',
            belleEpoqueTitle: 'Dandy of the Dial-Up',
            futuristicTitle: 'Post-Human Processor',
            salonCredits: 75,
            dataPoints: 150,
            unlocks: ['speedBoost', 'lightningEffects']
          },
          curator: {
            id: 'curator',
            name: 'Auteur of the Aesthetic',
            description: 'Impose your taste across 5 unique realms.',
            icon: '🎨',
            belleEpoqueTitle: 'Curator of the Ephemeral',
            futuristicTitle: 'Meme-Complex Propagator',
            salonCredits: 300,
            dataPoints: 200,
            unlocks: ['curatorTools', 'artFrame']
          },
          nightOwl: {
            id: 'nightOwl',
            name: 'Nocturnaut',
            description: 'Prowl the wires between 23:00 and 05:00.',
            icon: '🦉',
            belleEpoqueTitle: 'Spectre de la Nuit Blanche',
            futuristicTitle: 'Insomniac Interface-Jockey',
            salonCredits: 50,
            dataPoints: 100,
            unlocks: ['nightTheme', 'owlCompanion']
          },
          perfectionist: {
            id: 'perfectionist',
            name: 'Pixel Peasant',
            description: 'Re-decorate the digital salon 20 times.',
            icon: '🎨',
            belleEpoqueTitle: 'Visage Virtuoso',
            futuristicTitle: 'UI Utopian',
            salonCredits: 100,
            dataPoints: 50,
            unlocks: ['customThemes', 'aestheticMode']
          },
          marathoner: {
            id: 'marathoner',
            name: 'Endurance Artist',
            description: 'Achieve zen-like focus for 900 seconds.',
            icon: '🏃‍♂️',
            belleEpoqueTitle: 'Le Penseur Numérique',
            futuristicTitle: 'Chrono-Naut',
            salonCredits: 250,
            dataPoints: 125,
            unlocks: ['focusMode', 'enduranceFrame']
          },
          conductorNovice: {
            id: 'conductorNovice',
            name: 'Gesture Apprentice',
            description: 'Conduct the data-stream 10 times.',
            icon: '🎭',
            belleEpoqueTitle: 'Minor Mime of the Modem',
            futuristicTitle: 'Haptic Initiate',
            salonCredits: 150,
            dataPoints: 75,
            unlocks: ['conductorBaton', 'gestureTrails']
          },
          gestureMaster: {
            id: 'gestureMaster',
            name: 'Kinesic Master',
            description: 'Become one with the gestural interface (50 times).',
            icon: '🎼',
            belleEpoqueTitle: 'Le Corbusier of the Corpus',
            futuristicTitle: 'Cybernetic Choreographer',
            salonCredits: 500,
            dataPoints: 300,
            unlocks: ['maestroFrame', 'advancedGestures', 'holographicConductor']
          }
        };
    // Unlockable rewards
        this.rewards = {
          goldenFrame: {
            id: 'goldenFrame',
            name: 'Gilded Cage',
            type: 'cosmetic',
            description: 'A rococo frame for your digital visage.'
          },
          socialiteFrame: {
            id: 'socialiteFrame',
            name: 'Panopticon Frame',
            type: 'cosmetic',
            description: 'See and be seen. Constantly.'
          },
          mysticWheel: {
            id: 'mysticWheel',
            name: 'Wheel of Whimsy',
            type: 'feature',
            description: 'More smoke, more mirrors, more cryptic outputs.'
          },
          speedBoost: {
            id: 'speedBoost',
            name: 'Synaptic Lubricant',
            type: 'enhancement',
            description: 'Reduce the friction between thoughts.'
          },
          nightTheme: {
            id: 'nightTheme',
            name: 'Thème de la Nuit Américaine',
            type: 'theme',
            description: 'A deep, star-dusted void for late-night contemplation.'
          }
        };
    this.initializeTracking();
  }

  loadData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      return JSON.parse(saved);
    }

    return {
      level: 1,
      salonCredits: 0,
      dataPoints: 0,
      totalXP: 0,
      achievements: {},
      unlockedRewards: [],
      statistics: {
        channelsVisited: [],
        totalTimeSpent: 0,
        sessionsStarted: 0,
        wheelSpins: 0,
        themeChanges: 0,
        fastNavigations: 0,
        longestSession: 0,
        nightSessions: 0,
        interactionsPerChannel: {}
      },
      preferences: {
        showHUD: true,
        enableParticleRewards: true,
        soundEffects: true,
        frameStyle: 'default'
      },
      streak: {
        current: 0,
        longest: 0,
        lastVisit: null
      }
    };
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.notifyListeners();
  }

  initializeTracking() {
    // Track session start
    this.data.statistics.sessionsStarted++;
    this.sessionStartTime = Date.now();
    
    // Check for daily streak
    this.updateStreak();
    
    // Check for night owl achievement
    const hour = new Date().getHours();
    if (hour >= 23 || hour <= 5) {
      this.data.statistics.nightSessions++;
      this.checkAchievement('nightOwl');
    }

    this.saveData();
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastVisit = this.data.streak.lastVisit;
    
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastVisitDate === today) {
        // Same day, no change
        return;
      } else if (lastVisitDate === yesterday) {
        // Consecutive day
        this.data.streak.current++;
      } else {
        // Streak broken
        this.data.streak.current = 1;
      }
    } else {
      this.data.streak.current = 1;
    }
    
    this.data.streak.longest = Math.max(this.data.streak.longest, this.data.streak.current);
    this.data.streak.lastVisit = Date.now();
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.data));
  }

  // Core gamification methods
  visitChannel(channelKey) {
    if (!this.data.statistics.channelsVisited.includes(channelKey)) {
      this.data.statistics.channelsVisited.push(channelKey);
      this.awardXP(10, 5, `Discovered ${channelKey} channel`);
      this.checkAchievement('explorer');
    }

    this.currentChannel = channelKey;
    this.channelStartTime = Date.now();
    this.saveData();
  }

  leaveChannel() {
    if (this.channelStartTime && this.currentChannel) {
      const timeSpent = Date.now() - this.channelStartTime;
      this.data.statistics.totalTimeSpent += timeSpent;
      
      // Track longest session
      if (timeSpent > this.data.statistics.longestSession) {
        this.data.statistics.longestSession = timeSpent;
      }

      // Check for marathon achievement (15 minutes)
      if (timeSpent >= 900000) {
        this.checkAchievement('marathoner');
      }

      // Check for socialite achievement (30 minutes total)
      if (this.data.statistics.totalTimeSpent >= 1800000) {
        this.checkAchievement('socialite');
      }

      this.channelStartTime = null;
      this.currentChannel = null;
      this.saveData();
    }
  }

  interactWithChannel(channelKey, interactionType = 'generic') {
    if (!this.data.statistics.interactionsPerChannel[channelKey]) {
      this.data.statistics.interactionsPerChannel[channelKey] = 0;
    }
    
    this.data.statistics.interactionsPerChannel[channelKey]++;
    this.awardXP(5, 3, `Interacted with ${channelKey}`);

    // Check curator achievement
    const channelsWithInteractions = Object.keys(this.data.statistics.interactionsPerChannel).length;
    if (channelsWithInteractions >= 5) {
      this.checkAchievement('curator');
    }

    this.saveData();
  }

  useFortuneWheel() {
    this.data.statistics.wheelSpins++;
    this.awardXP(3, 8, 'Consulted the fortune wheel');
    
    if (this.data.statistics.wheelSpins >= 10) {
      this.checkAchievement('fortuneTeller');
    }

    this.saveData();
    return this.generateFortuneResult();
  }

  generateFortuneResult() {
        const fortunes = [
          {
            type: 'la liberte des esprits',
            title: 'The Spirits Speak',
            message: 'A whisper from the wires suggests a new path...',
            effect: 'A new channel is recommended.',
            belleEpoque: 'Le Grand Esprit de l\'Internet vous parle...',
            futuristic: 'SUGGESTION ALGORITHM ENGAGED'
          },
          {
            type: 'bonus',
            title: 'A Glitch in Your Favor',
            message: 'The system miscalculates. You profit.',
            effect: 'Bonus: 25 Salon Credits, 15 Data Points',
            belleEpoque: 'La Fortune sourit aux audacieux... et aux bogues.',
            futuristic: 'UNEXPECTED DATA SURGE: +XP'
          },
          {
            type: 'unlock',
            title: 'A Forgotten Cache',
            message: 'You stumble upon a dusty, forgotten asset.',
            effect: 'A unique cosmetic is now yours.',
            belleEpoque: 'Un trésor oublié refait surface...',
            futuristic: 'DECRYPTION SUCCESSFUL: ASSET UNLOCKED'
          }
        ];
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    
    if (fortune.type === 'bonus') {
      this.awardXP(25, 15, 'Fortune wheel bonus');
    }

    return fortune;
  }

  trackFastNavigation() {
    const now = Date.now();
    if (!this.fastNavigationTimes) {
      this.fastNavigationTimes = [];
    }

    this.fastNavigationTimes.push(now);
    
    // Keep only navigations from the last 10 seconds
    this.fastNavigationTimes = this.fastNavigationTimes.filter(time => now - time <= 10000);
    
    if (this.fastNavigationTimes.length >= 5) {
      this.data.statistics.fastNavigations++;
      this.checkAchievement('speedDemon');
      this.fastNavigationTimes = []; // Reset
    }
  }

  changeTheme() {
    this.data.statistics.themeChanges++;
    this.awardXP(2, 3, 'Theme adjustment');
    
    if (this.data.statistics.themeChanges >= 20) {
      this.checkAchievement('perfectionist');
    }

    this.saveData();
  }

  awardXP(salonCredits, dataPoints, reason = '') {
    this.data.salonCredits += salonCredits;
    this.data.dataPoints += dataPoints;
    this.data.totalXP += salonCredits + dataPoints;

    // Level up check
    const newLevel = Math.floor(this.data.totalXP / 100) + 1;
    if (newLevel > this.data.level) {
      this.data.level = newLevel;
      this.onLevelUp(newLevel);
    }

    this.saveData();
    return { salonCredits, dataPoints, reason };
  }

  onLevelUp(newLevel) {
    // Award level up bonus
    const bonus = newLevel * 10;
    this.data.salonCredits += bonus;
    this.data.dataPoints += bonus;
    
    // Unlock special rewards at certain levels
    if (newLevel === 5) {
      this.unlockReward('goldenFrame');
    } else if (newLevel === 10) {
      this.unlockReward('socialiteFrame');
    }
  }

  checkAchievement(achievementId) {
    if (this.data.achievements[achievementId]) return false;

    const achievement = this.achievements[achievementId];
    if (!achievement) return false;

    let unlocked = false;

    switch (achievementId) {
      case 'explorer':
        unlocked = this.data.statistics.channelsVisited.length >= 8; // Assuming 8+ channels
        break;
      case 'socialite':
        unlocked = this.data.statistics.totalTimeSpent >= 1800000; // 30 minutes
        break;
      case 'fortuneTeller':
        unlocked = this.data.statistics.wheelSpins >= 10;
        break;
      case 'speedDemon':
        unlocked = this.data.statistics.fastNavigations >= 1;
        break;
      case 'curator':
        unlocked = Object.keys(this.data.statistics.interactionsPerChannel).length >= 5;
        break;
      case 'nightOwl':
        unlocked = this.data.statistics.nightSessions >= 1;
        break;
      case 'perfectionist':
        unlocked = this.data.statistics.themeChanges >= 20;
        break;
      case 'marathoner':
        unlocked = this.data.statistics.longestSession >= 900000; // 15 minutes
        break;
      case 'conductorNovice':
        const totalGesturesNovice = Object.values(this.data.statistics.gestureInteractions || {})
          .reduce((sum, count) => sum + count, 0);
        unlocked = totalGesturesNovice >= 10;
        break;
      case 'gestureMaster':
        const totalGesturesMaster = Object.values(this.data.statistics.gestureInteractions || {})
          .reduce((sum, count) => sum + count, 0);
        unlocked = totalGesturesMaster >= 50;
        break;
    }

    if (unlocked) {
      this.data.achievements[achievementId] = {
        unlockedAt: Date.now(),
        level: this.data.level
      };

      // Award achievement rewards
      this.data.salonCredits += achievement.salonCredits;
      this.data.dataPoints += achievement.dataPoints;

      // Unlock associated rewards
      achievement.unlocks.forEach(rewardId => {
        this.unlockReward(rewardId);
      });

      this.saveData();
      return achievement;
    }

    return false;
  }

  unlockReward(rewardId) {
    if (!this.data.unlockedRewards.includes(rewardId)) {
      this.data.unlockedRewards.push(rewardId);
      this.saveData();
      return this.rewards[rewardId];
    }
    return null;
  }

  // Getters for UI components
  getLevel() {
    return this.data.level;
  }

  getXP() {
    return {
      current: this.data.totalXP,
      toNextLevel: 100 - (this.data.totalXP % 100),
      percentage: (this.data.totalXP % 100) / 100
    };
  }

  getCurrency() {
    return {
      salonCredits: this.data.salonCredits,
      dataPoints: this.data.dataPoints
    };
  }

  getAchievements() {
    return Object.keys(this.achievements).map(id => ({
      ...this.achievements[id],
      unlocked: !!this.data.achievements[id],
      unlockedAt: this.data.achievements[id]?.unlockedAt
    }));
  }

  getStatistics() {
    return {
      ...this.data.statistics,
      level: this.data.level,
      totalXP: this.data.totalXP,
      streak: this.data.streak
    };
  }

  getUnlockedRewards() {
    return this.data.unlockedRewards.map(id => this.rewards[id]);
  }

  // Utility methods
  isRewardUnlocked(rewardId) {
    return this.data.unlockedRewards.includes(rewardId);
  }

  getProgressTowardsAchievement(achievementId) {
    switch (achievementId) {
      case 'explorer':
        return {
          current: this.data.statistics.channelsVisited.length,
          target: 8,
          percentage: Math.min(100, (this.data.statistics.channelsVisited.length / 8) * 100)
        };
      case 'socialite':
        return {
          current: Math.floor(this.data.statistics.totalTimeSpent / 60000),
          target: 30,
          percentage: Math.min(100, (this.data.statistics.totalTimeSpent / 1800000) * 100)
        };
      case 'fortuneTeller':
        return {
          current: this.data.statistics.wheelSpins,
          target: 10,
          percentage: Math.min(100, (this.data.statistics.wheelSpins / 10) * 100)
        };
      default:
        return { current: 0, target: 1, percentage: 0 };
    }
  }

  // Gesture tracking methods
  trackGesture(gestureType, gestureName) {
    if (!this.data.statistics.gestureInteractions) {
      this.data.statistics.gestureInteractions = {};
    }
    
    if (!this.data.statistics.gestureInteractions[gestureType]) {
      this.data.statistics.gestureInteractions[gestureType] = 0;
    }
    
    this.data.statistics.gestureInteractions[gestureType]++;
    
    // Award XP for using gestures
    this.addXP(5, 2, `Gesture: ${gestureName}`);
    
    // Check for gesture-related achievements
    this.checkGestureAchievements();
    
    this.saveData();
    this.notifyListeners();
  }

  checkGestureAchievements() {
    const totalGestures = Object.values(this.data.statistics.gestureInteractions || {})
      .reduce((sum, count) => sum + count, 0);
    
    // Check if user is becoming a gesture master
    if (totalGestures >= 50) {
      this.checkAchievement('gestureMaster');
    }
    
    if (totalGestures >= 10) {
      this.checkAchievement('conductorNovice');
    }
  }

  // Cleanup method
  endSession() {
    if (this.currentChannel) {
      this.leaveChannel();
    }
    
    const sessionTime = Date.now() - this.sessionStartTime;
    if (sessionTime > this.data.statistics.longestSession) {
      this.data.statistics.longestSession = sessionTime;
    }

    this.saveData();
  }
}

// Singleton instance
let gamificationInstance = null;

export function getGamificationSystem() {
  if (!gamificationInstance) {
    gamificationInstance = new GamificationSystem();
  }
  return gamificationInstance;
}

export default GamificationSystem;