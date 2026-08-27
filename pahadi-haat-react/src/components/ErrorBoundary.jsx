import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          <h2 style={{ color: '#b3261e' }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering the page.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{ padding: '10px 20px', background: '#305335', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Pahadi Haat
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
