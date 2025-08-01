"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SnowAnimation } from "@/components/snow-animation"

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/analyze")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden cursor-umbrella">
      {/* Snow Animation */}
      <SnowAnimation />

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-teal-500 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-yellow-500 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-purple-500 blur-xl"></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent">
          GossipSpot
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-12 text-gray-300 malayalam-font font-medium">
          Best paradooshanam area finder
        </p>

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          className="gossip-gradient text-black font-bold text-xl px-12 py-6 rounded-2xl glow-hover border-0 hover:bg-none"
          size="lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
