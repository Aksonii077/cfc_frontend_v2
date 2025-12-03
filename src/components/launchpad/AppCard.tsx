import React from 'react';
import { Star, Download, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { MarketplaceApp } from '../../services/marketplaceApi';

interface AppCardProps {
  app: MarketplaceApp;
  onClick: () => void;
}

export function AppCard({ app, onClick }: AppCardProps) {
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free':
        return 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]';
      case 'freemium':
        return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]';
      case 'paid':
        return 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]';
      default:
        return 'bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]';
    }
  };

  return (
    <Card
      className="border-2 border-[#C8D6FF] hover:border-[#114DFF] transition-all cursor-pointer overflow-hidden h-full flex flex-col"
      onClick={onClick}
      data-testid="app-card"
    >
      {/* App Logo/Banner */}
      <div className="relative h-40 bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] flex items-center justify-center overflow-hidden">
        {app.banner_url ? (
          <img
            src={app.banner_url}
            alt={app.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-white border-2 border-[#C8D6FF] flex items-center justify-center overflow-hidden">
            {app.logo_url ? (
              <img
                src={app.logo_url}
                alt={app.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">📦</span>
            )}
          </div>
        )}
        
        {/* Featured Badge */}
        {app.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-0">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* App Info */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h3 className="mb-1 line-clamp-1">{app.name}</h3>
          <p className="text-gray-600 line-clamp-2">{app.tagline}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          {app.average_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#FF8C00] fill-[#FF8C00]" />
              <span className="text-gray-700">{app.average_rating.toFixed(1)}</span>
              <span className="text-gray-500">({app.total_reviews})</span>
            </div>
          )}
          
          {app.total_installs > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <Download className="w-4 h-4" />
              <span>{formatInstalls(app.total_installs)}</span>
            </div>
          )}
        </div>

        {/* Category & Pricing */}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
            {app.category}
          </Badge>
          <Badge className={getPricingColor(app.pricing_type)}>
            {app.pricing_type === 'free' ? 'Free' :
             app.pricing_type === 'freemium' ? 'Freemium' :
             'Paid'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

function formatInstalls(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
