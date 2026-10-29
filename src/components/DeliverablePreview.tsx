import React from 'react';
import { ExternalLink, GitPullRequest, FileCheck } from 'lucide-react';

interface DeliverablePreviewProps {
  url?: string | null;
  description: string;
}

export const DeliverablePreview: React.FC<DeliverablePreviewProps> = ({ url, description }) => {
  if (!url) return null;

  const isGitHub = url.includes('github.com');

  return (
    <div className="glass-panel" style={{ padding: '10px 14px', borderRadius: 8, marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isGitHub ? <GitPullRequest size={16} color="#38bdf8" /> : <FileCheck size={16} color="#34d399" />}
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>Deliverable Submission</span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none' }}
        >
          Open URL <ExternalLink size={12} />
        </a>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {url}
      </div>
    </div>
  );
};
