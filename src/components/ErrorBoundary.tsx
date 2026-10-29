import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', maxWidth: 480, margin: '60px auto' }} className="glass-panel">
          <AlertTriangle size={36} color="#f87171" style={{ margin: '0 auto 14px auto' }} />
          <h2 style={{ fontSize: '1.2rem', color: '#fff' }}>Something went wrong</h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '10px 0 20px 0' }}>
            {this.state.error?.message || 'An unexpected error occurred in the component tree.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCcw size={14} /> Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
