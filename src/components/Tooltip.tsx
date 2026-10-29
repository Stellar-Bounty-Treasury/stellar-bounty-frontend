import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || <HelpCircle size={12} color="var(--text-muted)" />}
      {isVisible && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            padding: '4px 8px',
            borderRadius: 6,
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            zIndex: 1000,
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
};
