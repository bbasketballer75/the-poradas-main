import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
