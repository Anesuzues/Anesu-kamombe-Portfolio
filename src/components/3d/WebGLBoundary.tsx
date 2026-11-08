import { Component, type ReactNode } from "react"

/** Swallows WebGL/three errors so a missing GPU never takes the page down. */
export class WebGLBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled:", error)
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children
  }
}
