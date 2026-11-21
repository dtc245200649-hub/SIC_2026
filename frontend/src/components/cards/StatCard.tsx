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
  brand: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  amber: 'bg-amber-50 text-amber-700 border-amber-300',
  red: 'bg-rose-50 text-rose-700 border-rose-300',
  blue: 'bg-sky-50 text-sky-700 border-sky-300',
  purple: 'bg-purple-50 text-purple-700 border-purple-300',
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
    <div className="bg-white p-5 rounded-2xl relative overflow-hidden border border-slate-300 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-600 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 ${colorMap[color]}`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          <span className={`font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
            {change}
          </span>
          <span className="text-slate-600">so với chu kỳ trước</span>
        </div>
      )}
    </div>
  );
};
export default StatCard;
