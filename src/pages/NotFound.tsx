import { Link, useLocation } from "react-router-dom"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  const { pathname } = useLocation()

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <div className="terminal-border max-w-md rounded-xl bg-card/80 p-10 text-center backdrop-blur-sm">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h1 className="mb-2 text-6xl font-bold text-glow">404</h1>
        <p className="mb-1 font-mono text-sm text-accent">ACCESS DENIED: ROUTE NOT FOUND</p>
        <p className="mb-8 break-all font-mono text-xs text-muted-foreground">{pathname}</p>
        <Button asChild className="bg-gradient-cyber">
          <Link to="/">Return to base</Link>
        </Button>
      </div>
    </main>
  )
}

export default NotFound
