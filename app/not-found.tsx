import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-background">
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/logo.svg"
          alt="TaskCraft Logo"
          fill
          className="opacity-90"
        />
      </div>
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-3xl font-semibold mb-4 text-foreground">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! It seems you&apos;ve ventured into uncharted territory. The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/" 
        className="group inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
      >
        <span>Return to Dashboard</span>
        <svg 
          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </Link>
    </div>
  )
}