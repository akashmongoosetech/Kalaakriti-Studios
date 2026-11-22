import { Check, Circle } from 'lucide-react';
import { evaluatePasswordStrength } from '../../schemas/auth.schema';

interface PasswordStrengthMeterProps {
  password: string;
}

const STRENGTH_BAR_COLORS: Record<number, string> = {
  0: 'bg-[#E8DCCB]',
  1: 'bg-[#DC2626]',
  2: 'bg-[#EA580C]',
  3: 'bg-[#D97706]',
  4: 'bg-[#65A30D]',
  5: 'bg-[#16A34A]',
};

const LABEL_COLORS: Record<string, string> = {
  Empty: 'text-[#5C554E]',
  Weak: 'text-[#DC2626]',
  Fair: 'text-[#D97706]',
  Good: 'text-[#65A30D]',
  Strong: 'text-[#15803D]',
};

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { score, label, checks } = evaluatePasswordStrength(password || '');

  const criteria = [
    { key: 'length', label: '8+ characters', met: checks.length },
    { key: 'upper', label: 'Uppercase (A-Z)', met: checks.upper },
    { key: 'lower', label: 'Lowercase (a-z)', met: checks.lower },
    { key: 'number', label: 'Number (0-9)', met: checks.number },
    { key: 'special', label: 'Special symbol', met: checks.special },
  ];

  return (
    <div className="mt-2.5 space-y-2 rounded-lg bg-[#F7F2E9]/80 border border-[#171615]/8 p-3">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-[#5C554E]">Password Strength</span>
        <span className={`font-semibold ${LABEL_COLORS[label]}`}>
          {label === 'Empty' ? 'Enter password' : label}
        </span>
      </div>

      {/* 5-segment strength indicator */}
      <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((segment) => (
          <div
            key={segment}
            className={`h-1.5 rounded-full transition-colors duration-200 ${
              score >= segment ? STRENGTH_BAR_COLORS[score] : 'bg-[#E8DCCB]'
            }`}
          />
        ))}
      </div>

      {/* Live checklist */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1 pt-0.5">
        {criteria.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-1.5 text-[11px] transition-colors ${
              item.met ? 'text-[#15803D] font-medium' : 'text-[#5C554E]'
            }`}
          >
            {item.met ? (
              <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="w-2.5 h-2.5 shrink-0 opacity-50" aria-hidden="true" />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
