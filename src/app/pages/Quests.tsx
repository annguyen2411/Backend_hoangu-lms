import { useState } from 'react';
import { Target, Calendar, Star, Trophy, Award, Gift, Sparkles, Users, Crown } from 'lucide-react';
import { QuestCard } from '../components/quests/QuestCard';
import { QuestModal } from '../components/quests/QuestModal';
import { UserStatsBar } from '../components/quests/UserStatsBar';
import { BadgeShowcase } from '../components/quests/BadgeShowcase';
import { Leaderboard } from '../components/quests/Leaderboard';
import { TeamChallenges } from '../components/quests/TeamChallenges';
import { SocialShare } from '../components/quests/SocialShare';
import { QuestNotifications, useQuestNotifications } from '../components/quests/QuestNotifications';
import {
  dailyQuests,
  weeklyQuests,
  specialQuests,
  achievementQuests,
  userStats,
  badges
} from '../data/questsData';
import { leaderboardData, teamChallenges } from '../data/leaderboardData';

type Tab = 'daily' | 'weekly' | 'special' | 'achievement' | 'badges' | 'leaderboard' | 'teams';

export function Quests() {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [selectedQuest, setSelectedQuest] = useState<typeof dailyQuests[0] | null>(null);
  const { notifications, addNotification, dismissNotification } = useQuestNotifications();

  const tabs = [
    { id: 'daily' as Tab, label: 'Hàng ngày', icon: Calendar, count: dailyQuests.length },
    { id: 'weekly' as Tab, label: 'Hàng tuần', icon: Target, count: weeklyQuests.length },
    { id: 'special' as Tab, label: 'Đặc biệt', icon: Star, count: specialQuests.length },
    { id: 'achievement' as Tab, label: 'Thành tích', icon: Trophy, count: achievementQuests.length },
    { id: 'badges' as Tab, label: 'Huy hiệu', icon: Award, count: badges.length },
    { id: 'leaderboard' as Tab, label: 'Bảng xếp hạng', icon: Users, count: leaderboardData.length },
    { id: 'teams' as Tab, label: 'Thách thức nhóm', icon: Crown, count: teamChallenges.length }
  ];

  const getQuests = () => {
    switch (activeTab) {
      case 'daily':
        return dailyQuests;
      case 'weekly':
        return weeklyQuests;
      case 'special':
        return specialQuests;
      case 'achievement':
        return achievementQuests;
      default:
        return [];
    }
  };

  const quests = getQuests();
  const completedQuests = quests.filter(q => q.isCompleted).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-red-600 to-yellow-500 p-3 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Nhiệm vụ</h1>
              <p className="text-gray-600 mt-1">
                Hoàn thành nhiệm vụ để nhận xu, kinh nghiệm và huy hiệu
              </p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <UserStatsBar stats={userStats} />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${ activeTab === tab.id
                        ? 'bg-gray-900/70 text-white border border-white/30'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'badges' ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="h-7 w-7 text-yellow-600" />
                  Bộ sưu tập huy hiệu
                </h2>
                <p className="text-gray-600 mt-1">
                  Đã mở khóa {userStats.badges.length}/{badges.length} huy hiệu
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">
                  {Math.round((userStats.badges.length / badges.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Hoàn thành</div>
              </div>
            </div>
            <BadgeShowcase badges={badges} userBadges={userStats.badges} />
          </div>
        ) : activeTab === 'leaderboard' ? (
          <Leaderboard users={leaderboardData} />
        ) : activeTab === 'teams' ? (
          <TeamChallenges challenges={teamChallenges} />
        ) : (
          <>
            {/* Quest Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{quests.length}</div>
                    <div className="text-sm text-gray-600">Tổng nhiệm vụ</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{completedQuests}</div>
                    <div className="text-sm text-gray-600">Đã hoàn thành</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Gift className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {quests.reduce((sum, q) => sum + (q.isCompleted ? q.rewards.coins : 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Xu đã nhận</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quest Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onClick={() => setSelectedQuest(quest)}
                />
              ))}
            </div>

            {/* Empty State */}
            {quests.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Chưa có nhiệm vụ nào
                </h3>
                <p className="text-gray-600">
                  Hãy quay lại sau để nhận thêm nhiệm vụ mới!
                </p>
              </div>
            )}
          </>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">💡 Mẹo học tập hiệu quả</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hoàn thành nhiệm vụ hàng ngày để duy trì streak và nhận xu thưởng</li>
                <li>• Nhiệm vụ tuần cho phần thưởng lớn hơn - đừng bỏ lỡ!</li>
                <li>• Sự kiện đặc biệt mang đến huy hiệu độc quyền và nhiều xu</li>
                <li>• Mở khóa thành tích để thể hiện trình độ của bạn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quest Modal */}
        {selectedQuest && (
          <QuestModal
            quest={selectedQuest}
            onClose={() => setSelectedQuest(null)}
            onClaim={() => {
              addNotification(
                'completed',
                'Nhiệm vụ hoàn thành!',
                `Bạn đã nhận được ${selectedQuest.rewards.coins} xu và ${selectedQuest.rewards.xp} XP`,
                '🎉'
              );
            }}
          />
        )}

        {/* Quest Notifications */}
        <QuestNotifications
          notifications={notifications}
          onDismiss={dismissNotification}
        />
      </div>
    </div>
  );
}