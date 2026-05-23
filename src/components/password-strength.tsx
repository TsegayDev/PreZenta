
'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  const [strength, setStrength] = React.useState({
    value: 0,
    label: '',
    color: '',
  });

  React.useEffect(() => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    if (password.length > 0 && password.length < 8) {
        score = 1;
    }

    let label = 'Weak';
    let color = 'bg-red-500';
    let value = (score / 5) * 100;

    if (score >= 4) {
      label = 'Strong';
      color = 'bg-green-500';
    } else if (score >= 2) {
      label = 'Medium';
      color = 'bg-yellow-500';
    }
    
    if (password.length === 0) {
        label = '';
        value = 0;
    }

    setStrength({ value, label, color });
  }, [password]);

  return (
    <div className="space-y-2">
      <Progress value={strength.value} style={{ '--indicator-color': `var(--${strength.label.toLowerCase()}-color)` } as React.CSSProperties} />
      {strength.label && (
        <p className={cn('text-xs font-medium', {
            'text-red-500': strength.label === 'Weak',
            'text-yellow-500': strength.label === 'Medium',
            'text-green-500': strength.label === 'Strong',
        })}>
          Strength: {strength.label}
        </p>
      )}
      <style>{`
        :root {
          --weak-color: #ef4444;
          --medium-color: #f59e0b;
          --strong-color: #22c55e;
        }
      `}</style>
    </div>
  );
}
