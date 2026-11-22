import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  to: string;
  subtitle?: string;
  momChange?: number | null;
  accent?: 'burgundy' | 'gold' | 'emerald' | 'amber' | 'slate';
}

const ACCENT_MAP: Record<NonNullable<StatCardProps['accent']>, string> = {
  burgundy: 'bg-[#57252F]/10 text-[#57252F] border-[#57252F]/20',
  gold: 'bg-[#C5A46D]/18 text-[#8C6D37] border-[#C5A46D]/35',
  emerald: 'bg-[#16A34A]/10 text-[#15803D] border-[#16A34A]/20',
  amber: 'bg-[#D97706]/10 text-[#B45309] border-[#D97706]/20',
  slate: 'bg-[#171615]/8 text-[#171615] border-[#171615]/15',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  to,
  subtitle,
  momChange = null,
  accent = 'burgundy',
}: StatCardProps) {
  return (
    <Link
      to={to}
      className="group block rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-5 shadow-[0_2px_12px_rgba(23,22,21,0.03)] hover:border-[#C5A46D] hover:shadow-[0_8px_24px_rgba(87,37,47,0.08)] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg border ${ACCENT_MAP[accent]}`}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-md text-[#5C554E] group-hover:text-[#57252F] group-hover:bg-[#F7F2E9] transition-colors">
          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-[#5C554E]">{title}</div>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="font-editorial text-3xl sm:text-4xl font-semibold text-[#171615] tabular-nums leading-none">
            {value}
          </span>
          {momChange !== null && (
            <span
              className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                momChange >= 0
                  ? 'bg-[#F0FDF4] text-[#15803D]'
                  : 'bg-[#FEF2F2] text-[#B91C1C]'
              }`}
              title="Compared to last month"
            >
              {momChange >= 0 ? (
                <TrendingUp className="w-3 h-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-3 h-3" aria-hidden="true" />
              )}
              {momChange >= 0 ? `+${momChange}%` : `${momChange}%`}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-2 text-[11px] text-[#5C554E] truncate">{subtitle}</p>
        )}
      </div>
    </Link>
  );
}
