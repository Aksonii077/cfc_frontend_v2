import React from 'react';
import { 
  DollarSign, Megaphone, Users, BarChart3, 
  Briefcase, Code, Mail, FileText, MoreHorizontal 
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORIES = [
  { id: 'Financial Tools', label: 'Financial Tools', icon: DollarSign },
  { id: 'Marketing & Sales', label: 'Marketing & Sales', icon: Megaphone },
  { id: 'Team Collaboration', label: 'Team Collaboration', icon: Users },
  { id: 'Analytics & Reporting', label: 'Analytics & Reporting', icon: BarChart3 },
  { id: 'Business Operations', label: 'Business Operations', icon: Briefcase },
  { id: 'Developer Tools', label: 'Developer Tools', icon: Code },
  { id: 'Communication', label: 'Communication', icon: Mail },
  { id: 'Legal & Compliance', label: 'Legal & Compliance', icon: FileText },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {/* All Categories */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap transition-all flex items-center gap-2 ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-transparent'
            : 'bg-white border-[#C8D6FF] text-gray-700 hover:border-[#114DFF]'
        }`}
      >
        All Categories
      </button>

      {/* Category Buttons */}
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-lg border-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              isSelected
                ? 'bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-transparent'
                : 'bg-white border-[#C8D6FF] text-gray-700 hover:border-[#114DFF]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
