import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Quick Earn:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      localStorage.removeItem('quickearn_seen_startup');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-5 text-rose-400 shadow-lg shadow-rose-500/10">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-black tracking-tight text-white mb-2">
            Quick Earn
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
            {this.state.error?.message || 'Something interrupted the app display.'}
          </p>

          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-[#0A0A0B] font-bold text-sm shadow-md active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload App</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
