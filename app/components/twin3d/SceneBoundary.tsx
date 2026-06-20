"use client";

import { Component, type ReactNode } from "react";

/**
 * SceneBoundary — catches WebGL/runtime errors from the 3D canvas so a device
 * without WebGL shows a graceful fallback instead of crashing the whole page.
 */
export default class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
