import React from 'react';
import { Tag, Code2, Coins, ShieldAlert, Wrench, Server, Users } from 'lucide-react';

interface CategoryBadgeProps {
  category?: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; border: string; color: string; icon: React.ReactNode }> = {
  'Smart Contracts': {
    bg: 'rgba(56, 189, 248, 0.15)',
    border: '#38bdf8',
    color: '#38bdf8',
    icon: <Code2 size={12} />,
  },
  'DeFi': {
    bg: 'rgba(16, 185, 129, 0.15)',
    border: '#10b981',
    color: '#34d399',
    icon: <Coins size={12} />,
  },
  'Security': {
    bg: 'rgba(239, 68, 68, 0.15)',
    border: '#ef4444',
    color: '#f87171',
    icon: <ShieldAlert size={12} />,
  },
  'Tooling': {
    bg: 'rgba(234, 179, 8, 0.15)',
    border: '#eab308',
    color: '#facc15',
    icon: <Wrench size={12} />,
  },
  'Infrastructure': {
    bg: 'rgba(168, 85, 247, 0.15)',
    border: '#a855f7',
    color: '#c084fc',
    icon: <Server size={12} />,
  },
  'Community': {
    bg: 'rgba(236, 72, 153, 0.15)',
    border: '#ec4899',
    color: '#f472b6',
    icon: <Users size={12} />,
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category = 'General' }) => {
  const style = CATEGORY_STYLES[category] || {
    bg: 'rgba(148, 163, 184, 0.15)',
    border: '#94a3b8',
    color: '#94a3b8',
    icon: <Tag size={12} />,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: 999,
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        fontSize: '0.72rem',
        fontWeight: 600,
      }}
    >
      {style.icon}
      <span>{category}</span>
    </span>
  );
};
