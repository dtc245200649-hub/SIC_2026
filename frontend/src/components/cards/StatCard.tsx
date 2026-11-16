import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  color?: 'brand' | 'amber' | 'red' | 'blue' | 'purple';
}

const colorMap = {
  brand: 'from-emerald-500/20 to-brand-500/5 text-emerald-400 border-emerald-500/30',
  amber: 'from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/30',
  red: 'from-rose-500/20 to-red-500/5 text-rose-400 border-rose-500/30',
  blue: 'from-sky-500/20 to-blue-500/5 text-sky-400 border-sky-500/30',
  purple: 'from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/30',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  isPositive = true,
  color = 'brand',
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center border ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change}
          </span>
          <span className="text-slate-400">so với chu kỳ trước</span>
        </div>
      )}
    </div>
  );
};
