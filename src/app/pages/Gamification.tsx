import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Target,
  Coins,
  Award,
  TrendingUp,
  Star,
  Zap,
  Crown,
  Flame,
  Calendar,
  Gift,
  ChevronRight,
  Lock,
  CheckCircle,
  Clock,
  Users,
  Share2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { UserStatsBar } from '../components/quests/UserStatsBar';
import { QuestCard } from '../components/quests/QuestCard';
import { Leaderboard } from '../components/quests/Leaderboard';
import { RewardAnimation } from '../components/quests/RewardAnimation';
import { DailyRewardModal } from '../components/quests/DailyRewardModal';
import { AchievementShareCard } from '../components/quests/AchievementShareCard';
import { FriendCompare } from '../components/quests/FriendCompare';
import { dailyQuests, weeklyQuests, specialQuests } from '../data/questsData';
import { leaderboardData } from '../data/leaderboardData';
import { useGameProgress } from '../hooks/useGameProgress';
import { useDailyReset } from '../hooks/useDailyReset';
import { notificationManager } from '../utils/notificationManager';
import { Link } from 'react-router';
import confetti from 'canvas-confetti';

// Gamification Page - Quest & Achievement System with Full Enhancements
export function Gamification() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState({ coins: 0, xp: 0, badge: null });
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Use game progress hook for persistence
  const {
    progress,
    isNewDay,
    completeQuest,
    unlockAchievement,
    claimDailyReward,
  } = useGameProgress();

  // Daily reset countdown
  const { timeRemaining, formatTime } = useDailyReset();

  // Merge quest data with saved progress
  const mergeQuestData = () => {
    return [...dailyQuests, ...weeklyQuests, ...specialQuests].map((quest) => ({
      ...quest,
      isCompleted: progress.questProgress[quest.id]?.isCompleted || quest.isCompleted,
      progress: progress.questProgress[quest.id]?.progress || quest.progress,
    }));
  };

  const [quests, setQuests] = useState(mergeQuestData());

  useEffect(() => {
    setQuests(mergeQuestData());
  }, [progress]);

  // Show daily reward modal on new day
  useEffect(() => {
    if (isNewDay && !progress.dailyRewardClaimed) {
      setTimeout(() => setShowDailyReward(true), 1000);
      
      // Send notification
      notificationManager.addNotification({
        type: 'achievement',
        title: 'Phần thưởng hàng ngày!',
        message: `Streak ${progress.userStats.streak} ngày! Nhận thưởng ngay!`,
        actionUrl: '/gamification',
      });
    }
  }, [isNewDay, progress.dailyRewardClaimed]);

  // Listen for daily reset event
  useEffect(() => {
    const handleDailyReset = () => {
      window.location.reload(); // Reload to refresh daily quests
    };
    
    window.addEventListener('dailyReset', handleDailyReset);
    return () => window.removeEventListener('dailyReset', handleDailyReset);
  }, []);

  // Mobile swipe gesture for tabs
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (!tabsElement) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) < swipeThreshold) return;

      const tabs = ['overview', 'quests', 'achievements', 'leaderboard'];
      const currentIndex = tabs.indexOf(activeTab);

      if (diff > 0 && currentIndex < tabs.length - 1) {
        // Swipe left - next tab
        setActiveTab(tabs[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous tab
        setActiveTab(tabs[currentIndex - 1]);
      }
    };

    tabsElement.addEventListener('touchstart', handleTouchStart);
    tabsElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      tabsElement.removeEventListener('touchstart', handleTouchStart);
      tabsElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab]);

  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.isCompleted) return;

    // Complete quest and get rewards
    const result = completeQuest(questId, quest.rewards);

    // Show confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#fbbf24'],
    });

    // Show reward animation
    setRewardData({
      coins: quest.rewards.coins,
      xp: quest.rewards.xp,
      badge: quest.rewards.badge || null,
    });
    setShowReward(true);

    // Update local state
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q)));

    // Check for level up
    if (result.leveledUp) {
      setNewLevel(result.newLevel);
      setTimeout(() => {
        setShowLevelUp(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#3b82f6', '#8b5cf6', '#fbbf24', '#10b981'],
        });
        
        notificationManager.addNotification({
          type: 'achievement',
          title: '🎉 Level Up!',
          message: `Chúc mừng! Bạn đã đạt Level ${result.newLevel}!`,
          actionUrl: '/gamification',
        });
      }, 1500);
    }

    setTimeout(() => setShowReward(false), 3000);
    setTimeout(() => setShowLevelUp(false), 5000);
  };

  const handleClaimDailyReward = () => {
    const dailyReward = {
      coins: 50 + Math.min(progress.userStats.streak * 10, 200),
      xp: 25 + Math.min(progress.userStats.streak * 5, 100),
    };

    completeQuest('daily_login_reward', dailyReward);
    claimDailyReward();
  };

  const dailyQuestsFiltered = quests.filter((q) => q.type === 'daily');
  const weeklyQuestsFiltered = quests.filter((q) => q.type === 'weekly');
  const specialQuestsFiltered = quests.filter((q) => q.type === 'special');

  // Calculate next level progress using saved stats
  const levelProgress = (progress.userStats.xp / progress.userStats.xpToNextLevel) * 100;

  // Achievement categories with persistence
  const achievements = [
    {
      id: 'first_lesson',
      name: 'Bài học đầu tiên',
      description: 'Hoàn thành bài học đầu tiên',
      icon: '📚',
      unlocked: progress.completedAchievements.includes('first_lesson'),
      date: '2024-03-10',
    },
    {
      id: 'streak_7',
      name: 'Tuần hoàn hảo',
      description: 'Học 7 ngày liên tiếp',
      icon: '🔥',
      unlocked: progress.completedAchievements.includes('streak_7') || progress.userStats.streak >= 7,
      date: '2024-03-12',
    },
    {
      id: 'flashcard_master',
      name: 'Bậc thầy Flashcard',
      description: 'Ôn tập 100 flashcard',
      icon: '🎴',
      unlocked: progress.completedAchievements.includes('flashcard_master'),
      date: '2024-03-13',
    },
    {
      id: 'pronunciation_pro',
      name: 'Phát âm chuẩn',
      description: 'Đạt 95% độ chính xác trong bài phát âm',
      icon: '🎤',
      unlocked: false,
      locked: true,
    },
    {
      id: 'hsk_1_complete',
      name: 'Hoàn thành HSK 1',
      description: 'Hoàn thành khóa HSK cấp độ 1',
      icon: '🏆',
      unlocked: false,
      locked: true,
    },
    {
      id: 'social_butterfly',
      name: 'Người kết nối',
      description: 'Kết bạn với 10 học viên',
      icon: '👥',
      unlocked: false,
      locked: true,
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--muted)] to-white pb-12">
      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <RewardAnimation
            coins={rewardData.coins}
            xp={rewardData.xp}
            badge={rewardData.badge}
            onComplete={() => setShowReward(false)}
          />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">Gamification</h1>
            </div>
            <p className="text-xl text-white/90">
              Hoàn thành nhiệm vụ, nhận phần thưởng và leo rank!
            </p>
          </motion.div>

          {/* User Stats Overview */}
          <UserStatsBar stats={progress.userStats} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Level Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-8 bg-white border-2 border-primary shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xl">
                  {progress.userStats.level}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Level {progress.userStats.level}</h3>
                  <p className="text-sm text-muted-foreground">
                    {progress.userStats.xp} / {progress.userStats.xpToNextLevel} XP
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" size="lg" className="mb-2">
                  <Zap className="h-4 w-4" />
                  {progress.userStats.streak} ngày streak
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Tiến độ level tiếp theo</span>
                <span className="text-primary font-bold">{Math.round(levelProgress)}%</span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-warning mb-1">
                  <Coins className="h-5 w-5" />
                  <span className="text-2xl font-bold">{progress.userStats.coins}</span>
                </div>
                <p className="text-xs text-muted-foreground">Xu hiện có</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Trophy className="h-5 w-5" />
                  <span className="text-2xl font-bold">{progress.userStats.badges.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Huy hiệu</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-success mb-1">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {quests.filter((q) => q.isCompleted).length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Nhiệm vụ</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-xl shadow-sm" ref={tabsRef}>
            <TabsTrigger value="overview" className="gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger value="quests" className="gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Nhiệm vụ</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Thành tích</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Bảng xếp hạng</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Daily Reset Countdown Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-bold text-sm">Nhiệm vụ mới sau</p>
                      <p className="text-xs text-muted-foreground">
                        Reset hàng ngày lúc 00:00
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-orange-600">
                      {formatTime()}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Daily Quests Preview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Nhiệm vụ hôm nay
                    </h3>
                    <Badge variant="secondary">
                      {dailyQuestsFiltered.filter((q) => q.isCompleted).length}/{dailyQuestsFiltered.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {dailyQuestsFiltered.slice(0, 3).map((quest) => (
                      <div
                        key={quest.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {quest.isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{quest.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {quest.progress}/{quest.target}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                          <Coins className="h-4 w-4" />
                          <span className="text-sm font-bold">+{quest.rewards.coins}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/quests">
                    <Button variant="ghost" className="w-full mt-4">
                      Xem tất cả
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>

              {/* Recent Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-warning" />
                      Thành tích gần đây
                    </h3>
                    <Badge variant="secondary">
                      {unlockedAchievements.length}/{achievements.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {unlockedAchievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-warning/10 to-transparent rounded-lg border border-warning/20"
                      >
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('achievements')}
                  >
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            </div>

            {/* Shop Teaser */}
            <Card className="p-6 bg-gradient-to-r from-warning/10 to-info/10 border-2 border-warning/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
                    <Gift />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Cửa hàng phần thưởng</h3>
                    <p className="text-muted-foreground">
                      Đổi xu lấy avatar, theme và power-ups độc quyền
                    </p>
                  </div>
                </div>
                <Link to="/shop">
                  <Button size="lg" className="gap-2">
                    Khám phá ngay
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-6">
            {/* Daily Quests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Nhiệm vụ hàng ngày
                </h3>
                <Badge variant="secondary" size="lg">
                  {dailyQuestsFiltered.filter((q) => q.isCompleted).length}/{dailyQuestsFiltered.length} hoàn
                  thành
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {dailyQuestsFiltered.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={handleCompleteQuest}
                  />
                ))}
              </div>
            </div>

            {/* Weekly Quests */}
            {weeklyQuestsFiltered.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="h-6 w-6 text-secondary" />
                    Nhiệm vụ hàng tuần
                  </h3>
                  <Badge variant="secondary" size="lg">
                    {weeklyQuestsFiltered.filter((q) => q.isCompleted).length}/{weeklyQuestsFiltered.length}{' '}
                    hoàn thành
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {weeklyQuestsFiltered.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={handleCompleteQuest}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Special Quests */}
            {specialQuestsFiltered.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-warning" />
                    Nhiệm vụ đặc biệt
                  </h3>
                  <Badge variant="secondary" size="lg" className="bg-warning/20 text-warning">
                    Giới hạn thời gian
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {specialQuestsFiltered.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onComplete={handleCompleteQuest}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {/* Friend Compare Section */}
            <FriendCompare
              currentUser={{
                level: progress.userStats.level,
                xp: progress.userStats.xp,
                streak: progress.userStats.streak,
                achievements: unlockedAchievements.length,
                lessonsCompleted: quests.filter((q) => q.isCompleted).length,
              }}
            />

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-success" />
                Đã mở khóa ({unlockedAchievements.length})
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative"
                  >
                    <Card className="p-6 bg-gradient-to-br from-success/10 to-primary/5 border-2 border-success/30 hover:shadow-lg transition-all">
                      <div className="flex flex-col items-center text-center">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                          className="text-6xl mb-3"
                        >
                          {achievement.icon}
                        </motion.div>
                        <h4 className="font-bold mb-2">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description}
                        </p>
                        <Badge variant="secondary" size="sm" className="bg-success/20 text-success mb-2">
                          <CheckCircle className="h-3 w-3" />
                          Đã đạt được
                        </Badge>
                        <p className="text-xs text-muted-foreground mb-3">
                          {new Date(achievement.date || '').toLocaleDateString('vi-VN')}
                        </p>
                        {/* Share Button */}
                        <AchievementShareCard
                          achievement={achievement}
                          userLevel={progress.userStats.level}
                          userName="Học viên HoaNgữ"
                        />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-muted-foreground" />
                Chưa mở khóa ({lockedAchievements.length})
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {lockedAchievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className="p-6 bg-muted/50 border-2 border-dashed opacity-60"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-6xl mb-3 grayscale">{achievement.icon}</div>
                      <h4 className="font-bold mb-2">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      <Badge variant="secondary" size="sm">
                        <Lock className="h-3 w-3" />
                        Chưa đạt
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <Leaderboard users={leaderboardData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaim={handleClaimDailyReward}
        streak={progress.userStats.streak}
      />

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="p-12 bg-gradient-to-br from-primary to-secondary text-white shadow-lg">
              <div className="flex flex-col items-center text-center">
                <div className="text-6xl mb-3">🎉</div>
                <h4 className="font-bold mb-2">Level Up!</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Chúc mừng! Bạn đã đạt Level {newLevel}!
                </p>
                <Badge variant="secondary" size="sm" className="bg-success/20 text-success">
                  <CheckCircle className="h-3 w-3" />
                  Đã đạt được
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}