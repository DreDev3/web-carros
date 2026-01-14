import type { ReactNode } from "react"

interface Containerype {
  children: ReactNode;
}

export default function Container({ children }: Containerype) {
  return (
    <main className="w-full max-w-7xl mx-auto px-4">
      {children}
    </main>
  )
}