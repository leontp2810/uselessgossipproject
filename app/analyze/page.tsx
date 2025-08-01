"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, RotateCcw } from "lucide-react"

interface GossipZone {
  id: string
  name: string
  position: { top: string; left: string }
  color: string
}

const gossipZones: GossipZone[] = [
  {
    id: "kuttikalam",
    name: "Kuttikalam Kadha",
    position: { top: "65%", left: "25%" }, // Near left side seating area
    color: "bg-pink-500",
  },
  {
    id: "gossip-grid",
    name: "Gossip Grid",
    position: { top: "40%", left: "45%" }, // Center seating cluster
    color: "bg-purple-500",
  },
  {
    id: "sadhya-circle",
    name: "Sadhya Circle",
    position: { top: "75%", left: "55%" }, // Near dining/food area chairs
    color: "bg-orange-500",
  },
  {
    id: "selfie-spot",
    name: "Selfie Spot",
    position: { top: "30%", left: "75%" }, // Near front/stage area seating
    color: "bg-teal-500",
  },
]

export default function Analyze() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const resetUpload = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent">
            Analyze Your Event
          </h1>
          <p className="text-lg text-gray-300 malayalam-font">Upload a top view of your hall or event space</p>
        </div>

        {!uploadedImage ? (
          /* Upload Section */
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  isDragging ? "border-teal-400 bg-teal-400/10" : "border-slate-600 hover:border-slate-500"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Upload Event Photo</h3>
                <p className="text-gray-400 mb-6">Drag and drop your image here, or click to browse</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="gossip-gradient text-black font-semibold px-8 py-3 rounded-xl glow-hover"
                >
                  Choose File
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Analysis Section */
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative inline-block w-full">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded event"
                    className="w-full h-auto rounded-lg shadow-2xl max-h-[70vh] object-contain mx-auto block"
                  />

                  {/* Gossip Zone Overlays */}
                  {gossipZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                      style={{
                        top: zone.position.top,
                        left: zone.position.left,
                      }}
                    >
                      <div className="overlay-text px-4 py-2 rounded-lg text-white font-bold text-sm md:text-base whitespace-nowrap">
                        <div className={`w-3 h-3 rounded-full ${zone.color} inline-block mr-2`}></div>
                        {zone.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Zone Legend */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-200">Gossip Zones Identified</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gossipZones.map((zone) => (
                    <div key={zone.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/50">
                      <div className={`w-4 h-4 rounded-full ${zone.color}`}></div>
                      <span className="text-gray-200 font-medium">{zone.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <div className="text-center">
              <Button
                onClick={resetUpload}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Scan Another Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
