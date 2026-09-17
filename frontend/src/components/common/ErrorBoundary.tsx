import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('PRAVIRAK caught an unexpected error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-extrabold text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-500 mt-2">
              PRAVIRAK hit an unexpected error and stopped this screen from loading. Your saved businesses are
              safe — reloading usually fixes this.
            </p>
            {this.state.error && (
              <p className="text-[11px] text-slate-400 mt-3 font-mono bg-slate-50 rounded-lg p-2 break-words">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReload}
              className="mt-6 w-full py-2.5 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Reload PRAVIRAK
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
