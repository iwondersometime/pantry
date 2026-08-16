import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;
  declare setState: React.Component<ErrorBoundaryProps, ErrorBoundaryState>['setState'];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex items-center justify-center p-6 selection:bg-[#DCE9DA]">
          <div className="w-full max-w-md bg-[#FAF5EC] border border-[#153B28]/20 rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-[#E05345]/10 text-[#E05345] rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 stroke-[2]" />
            </div>

            <div>
              <h2 className="font-serif-editorial text-2xl font-normal text-[#153B28] mb-1">
                Something went wrong
              </h2>
              <p className="text-xs text-[#153B28]/80 leading-relaxed max-w-xs mx-auto font-medium">
                {this.props.fallbackMessage ||
                  'An unexpected runtime issue occurred during this action. You can retry safely without restarting the app.'}
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#EFE8D8] border border-[#153B28]/10 rounded-xl p-3 text-left overflow-auto max-h-28 text-[11px] font-mono text-[#153B28]/70">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-xs flex items-center justify-center gap-2 shadow-md active-press"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry & Continue</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-transparent text-[#153B28]/80 font-medium text-xs flex items-center justify-center gap-1.5 hover:text-[#153B28]"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
