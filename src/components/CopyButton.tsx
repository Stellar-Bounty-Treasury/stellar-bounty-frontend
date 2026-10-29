import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  size?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, label, size = 14 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      style={{
        background: 'none',
        border: 'none',
        color: copied ? '#34d399' : 'var(--text-muted)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 4px',
        borderRadius: 4,
        fontSize: '0.75rem',
        transition: 'color 0.15s ease',
      }}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
};
