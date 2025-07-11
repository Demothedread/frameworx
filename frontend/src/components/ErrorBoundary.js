import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // Could log error to service here
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{background:'#421a1a', padding:18, color:'#fff', borderRadius:10}}>
          <h2>Something went wrong in this channel.</h2>
          <pre style={{color:'#fdb'}}>{this.state.error?.toString()}</pre>
          <button onClick={()=>this.setState({hasError:false,error:null})}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
