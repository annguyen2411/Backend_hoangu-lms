import { useState } from 'react';
import { ShoppingBag, Coins, Search, Filter } from 'lucide-react';
import { ShopItem } from '../components/shop/ShopItem';
import { RewardAnimation } from '../components/quests/RewardAnimation';
import { shopItems, shopCategories, type ShopItem as ShopItemType } from '../data/shopData';
import { userStats } from '../data/questsData';

export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCoins, setUserCoins] = useState(userStats.coins);
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState<ShopItemType | null>(null);

  const filteredItems = shopItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (item: ShopItemType) => {
    if (userCoins >= item.price && !item.owned) {
      setUserCoins(userCoins - item.price);
      setPurchasedItem(item);
      setShowPurchase(true);
      
      // Update item as owned
      const itemIndex = shopItems.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        shopItems[itemIndex].owned = true;
      }

      setTimeout(() => {
        setShowPurchase(false);
        setPurchasedItem(null);
      }, 3000);
    }
  };

  const ownedCount = shopItems.filter(i => i.owned).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Cửa hàng</h1>
              <p className="text-gray-600 mt-1">
                Sử dụng xu để mua items, avatars và nhiều hơn nữa
              </p>
            </div>
          </div>

          {/* User Coins & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-md p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold opacity-90 mb-1">Số xu của bạn</div>
                  <div className="text-3xl font-bold">{userCoins.toLocaleString()}</div>
                </div>
                <Coins className="h-12 w-12 opacity-80" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="text-sm text-gray-600 mb-1">Đã sở hữu</div>
              <div className="text-2xl font-bold text-gray-900">
                {ownedCount}/{shopItems.length}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${(ownedCount / shopItems.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="text-sm text-gray-600 mb-1">Items có sẵn</div>
              <div className="text-2xl font-bold text-gray-900">
                {shopItems.filter(i => !i.owned).length}
              </div>
              <div className="text-sm text-purple-600 font-semibold mt-2">
                Khám phá ngay!
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {shopCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ShopItem
                key={item.id}
                item={item}
                userCoins={userCoins}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy items nào
            </h3>
            <p className="text-gray-600">
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <Coins className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">💡 Mẹo kiếm xu nhanh</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hoàn thành nhiệm vụ hàng ngày để nhận 50-100 xu</li>
                <li>• Nhiệm vụ tuần cho phần thưởng lên đến 300 xu</li>
                <li>• Streak Freeze giúp bảo vệ chuỗi streak khi bạn bận</li>
                <li>• Power-ups Double XP giúp bạn lên cấp nhanh hơn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Animation */}
      {showPurchase && purchasedItem && (
        <RewardAnimation
          coins={0}
          xp={0}
          badge={purchasedItem.name}
        />
      )}
    </div>
  );
}
