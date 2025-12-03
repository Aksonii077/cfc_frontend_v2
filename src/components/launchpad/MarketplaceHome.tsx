import React, { useState } from 'react';
import { Rocket, TrendingUp, Zap, Package } from 'lucide-react';
import { useMarketplace, useFeaturedApps } from '../../hooks/useMarketplace';
import { AppCard } from './AppCard';
import { CategoryFilter } from './CategoryFilter';
import { SearchBar } from './SearchBar';
import { Card } from '../ui/card';

interface MarketplaceHomeProps {
  onAppClick?: (slug: string) => void;
}

export function MarketplaceHome({ onAppClick }: MarketplaceHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { apps: featuredApps, isLoading: featuredLoading } = useFeaturedApps();
  const { apps: allApps, isLoading: appsLoading } = useMarketplace({
    category: selectedCategory || undefined,
    search: searchQuery || undefined
  });

  const handleAppClick = (slug: string) => {
    if (onAppClick) {
      onAppClick(slug);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FF]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-10 h-10" />
            <h1 className="text-white">SaaS Marketplace</h1>
          </div>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl">
            Supercharge your startup with the best SaaS tools. Connect seamlessly with RACE AI and scale faster.
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <SearchBar onSearch={setSearchQuery} />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b-2 border-[#C8D6FF]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#EDF2FF] flex items-center justify-center">
                <Package className="w-6 h-6 text-[#114DFF]" />
              </div>
              <div>
                <p className="text-gray-600">Apps Available</p>
                <h3>{allApps.length}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#EDF2FF] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#114DFF]" />
              </div>
              <div>
                <p className="text-gray-600">Categories</p>
                <h3>9</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#EDF2FF] flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#114DFF]" />
              </div>
              <div>
                <p className="text-gray-600">One-Click Integration</p>
                <h3>Instant Setup</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Featured Apps */}
        {!searchQuery && !selectedCategory && featuredApps.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-6 h-6 text-[#114DFF]" />
              <h2>Featured Apps</h2>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="h-80 animate-pulse bg-[#F5F5F5] border-2 border-[#C8D6FF]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredApps.slice(0, 3).map(app => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onClick={() => handleAppClick(app.slug)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="mb-4">Browse by Category</h2>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* All Apps Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2>
              {searchQuery ? `Search Results for "${searchQuery}"` :
               selectedCategory ? selectedCategory :
               'All Apps'}
            </h2>
            <p className="text-gray-600">
              {allApps.length} {allApps.length === 1 ? 'app' : 'apps'}
            </p>
          </div>

          {appsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <Card key={i} className="h-80 animate-pulse bg-[#F5F5F5] border-2 border-[#C8D6FF]" />
              ))}
            </div>
          ) : allApps.length === 0 ? (
            <Card className="p-12 text-center border-2 border-[#C8D6FF]">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="mb-2">No Apps Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No apps match "${searchQuery}". Try a different search term.`
                  : `No apps available in ${selectedCategory}. Check back soon!`}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="text-[#114DFF] hover:text-[#0d3eb8]"
                >
                  View all apps
                </button>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() => handleAppClick(app.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
