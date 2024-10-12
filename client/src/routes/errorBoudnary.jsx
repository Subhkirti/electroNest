import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error boundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Internal Server Error. Please try again after sometime.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
