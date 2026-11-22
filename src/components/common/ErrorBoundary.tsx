import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  silent?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Handled gracefully by fallback UI without crashing the page
  }

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[50vh] flex items-center justify-center bg-[#F7F2E9] text-[#171615] px-6 py-16 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="font-editorial text-3xl font-medium">
              Unable to load this section
            </h2>
            <p className="text-sm text-[#5C554E]">
              A temporary module loading hiccup occurred. Reload the page to continue viewing the
              studio portfolio.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
