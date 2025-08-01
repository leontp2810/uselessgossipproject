"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, RotateCcw, Download, Share2, Users, MapPin, TrendingUp, Eye, Info } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface GossipZone {
  id: string
  name: string
  position: { top: string; left: string }
  color: string
  confidence: number
  intensity: number
  description: string
  clusterGroup?: number
  nearbyZones: string[]
}

interface ZoneCluster {
  id: string
  zones: GossipZone[]
  centerPosition: { top: string; left: string }
  totalIntensity: number
  recommendation: string
}

const zoneData = [
  {
    name: "Sadhya Circle",
    descriptions: [
      "Food-adjacent zone where conversations flow as freely as the payasam",
      "Traditional gathering spot where stories are shared over meals",
      "High-traffic area perfect for casual information exchange",
    ],
  },
  {
    name: "Gossip Grid",
    descriptions: [
      "Central hub where all information flows converge naturally",
      "Strategic location for maximum gossip distribution efficiency",
      "Prime real estate for those who want to hear everything first",
    ],
  },
  {
    name: "Kuttikalam Kadhakal",
    descriptions: [
      "Perfect corner for sharing childhood stories and nostalgic memories",
      "Cozy area where aunties gather to reminisce about the good old days",
      "Intimate spot ideal for heartwarming tales from younger years",
    ],
  },
]

const zoneColors = [
  "bg-pink-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-rose-500",
]

export default function Analyze() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [gossipZones, setGossipZones] = useState<GossipZone[]>([])
  const [zoneClusters, setZoneClusters] = useState<ZoneCluster[]>([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState("zones")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateGossipZones = useCallback((imageWidth: number, imageHeight: number) => {
    const zones: GossipZone[] = []
    const usedColors = new Set<string>()

    // FIXED: Only 3 zones, positioned very conservatively near ground/seating areas
    // All zones stay well within image bounds and focus on chair/seating areas
    const safeZones = [
      // Left seating area - near chairs
      { minX: 15, maxX: 35, minY: 55, maxY: 75 },

      // Center seating area - main gathering spot
      { minX: 40, maxX: 60, minY: 50, maxY: 70 },

      // Right seating area - corner spot
      { minX: 65, maxX: 85, minY: 55, maxY: 75 },
    ]

    // Always use exactly 3 zones
    const numZones = 3

    for (let i = 0; i < numZones; i++) {
      const safeZone = safeZones[i]
      const zoneInfo = zoneData[i]

      const color = zoneColors[i % zoneColors.length]
      usedColors.add(color)

      // Generate position within the safe zone - very conservative positioning
      const left = Math.random() * (safeZone.maxX - safeZone.minX) + safeZone.minX
      const top = Math.random() * (safeZone.maxY - safeZone.minY) + safeZone.minY

      // Extra safety - ensure positions are well within bounds
      const clampedLeft = Math.max(15, Math.min(85, left))
      const clampedTop = Math.max(50, Math.min(80, top))

      // Generate realistic confidence and intensity scores
      const confidence = Math.floor(Math.random() * 25) + 75 // 75-100%
      const intensity = Math.floor(Math.random() * 40) + 60 // 60-100%

      zones.push({
        id: `zone-${i}`,
        name: zoneInfo.name,
        position: {
          top: `${clampedTop}%`,
          left: `${clampedLeft}%`,
        },
        color,
        confidence,
        intensity,
        description: zoneInfo.descriptions[Math.floor(Math.random() * zoneInfo.descriptions.length)],
        nearbyZones: [],
      })
    }

    // Calculate nearby zones (zones within 25% distance)
    zones.forEach((zone, index) => {
      const zoneLeft = Number.parseFloat(zone.position.left)
      const zoneTop = Number.parseFloat(zone.position.top)

      zones.forEach((otherZone, otherIndex) => {
        if (index !== otherIndex) {
          const otherLeft = Number.parseFloat(otherZone.position.left)
          const otherTop = Number.parseFloat(otherZone.position.top)
          const distance = Math.sqrt(Math.pow(zoneLeft - otherLeft, 2) + Math.pow(zoneTop - otherTop, 2))

          if (distance < 25) {
            zone.nearbyZones.push(otherZone.name)
          }
        }
      })
    })

    return zones
  }, [])

  const generateZoneClusters = useCallback((zones: GossipZone[]) => {
    const clusters: ZoneCluster[] = []
    const clusteredZones = new Set<string>()

    zones.forEach((zone) => {
      if (!clusteredZones.has(zone.id) && zone.nearbyZones.length > 0) {
        const clusterZones = [zone]
        clusteredZones.add(zone.id)

        // Find nearby zones
        zones.forEach((otherZone) => {
          if (!clusteredZones.has(otherZone.id) && zone.nearbyZones.includes(otherZone.name)) {
            clusterZones.push(otherZone)
            clusteredZones.add(otherZone.id)
          }
        })

        if (clusterZones.length > 1) {
          const totalIntensity = clusterZones.reduce((sum, z) => sum + z.intensity, 0)
          const avgLeft =
            clusterZones.reduce((sum, z) => sum + Number.parseFloat(z.position.left), 0) / clusterZones.length
          const avgTop =
            clusterZones.reduce((sum, z) => sum + Number.parseFloat(z.position.top), 0) / clusterZones.length

          const recommendations = [
            "Consider placing comfortable seating arrangement here for extended conversations",
            "High-traffic zone - perfect for refreshment station placement",
            "Strategic location for community announcements and updates",
            "Ideal spot for photo opportunities and social media content",
            "Prime real estate for traditional games and activities",
          ]

          clusters.push({
            id: `cluster-${clusters.length}`,
            zones: clusterZones,
            centerPosition: {
              top: `${avgTop}%`,
              left: `${avgLeft}%`,
            },
            totalIntensity,
            recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
          })
        }
      }
    })

    return clusters
  }, [])

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      const zones = generateGossipZones(naturalWidth, naturalHeight)
      const clusters = generateZoneClusters(zones)
      setGossipZones(zones)
      setZoneClusters(clusters)
      setImageLoaded(true)
    }
  }, [generateGossipZones, generateZoneClusters])

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setImageLoaded(false)
        setGossipZones([])
        setZoneClusters([])
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
    setGossipZones([])
    setZoneClusters([])
    setImageLoaded(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const regenerateZones = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current
      const zones = generateGossipZones(naturalWidth, naturalHeight)
      const clusters = generateZoneClusters(zones)
      setGossipZones(zones)
      setZoneClusters(clusters)
    }
  }

  const exportImage = async () => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    // Draw the original image
    ctx.drawImage(img, 0, 0)

    // Draw zones
    gossipZones.forEach((zone) => {
      const x = (Number.parseFloat(zone.position.left) / 100) * canvas.width
      const y = (Number.parseFloat(zone.position.top) / 100) * canvas.height

      // Draw zone marker
      ctx.fillStyle = zone.color.replace("bg-", "").replace("-500", "")
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.fill()

      // Draw zone label
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(x - 60, y - 35, 120, 25)
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(zone.name, x, y - 18)
      ctx.fillText(`${zone.confidence}%`, x, y - 6)
    })

    // Download the image
    const link = document.createElement("a")
    link.download = "gossipspot-analysis.png"
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Image Exported!",
      description: "Your analyzed image has been downloaded successfully.",
    })
  }

  const shareAnalysis = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GossipSpot Analysis",
          text: `Found ${gossipZones.length} prime paradooshanam zones in this event space!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `🎯 GossipSpot Analysis Results:\n\n${gossipZones.map((zone) => `• ${zone.name} (${zone.confidence}% confidence)`).join("\n")}\n\nAnalyze your own event space at ${window.location.origin}`

      try {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to Clipboard!",
          description: "Analysis results copied. Share with your friends!",
        })
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to share. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 90) return "text-red-400"
    if (intensity >= 75) return "text-orange-400"
    if (intensity >= 60) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <canvas ref={canvasRef} className="hidden" />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent">
            Analyze Your Event
          </h1>
          <p className="text-lg text-gray-300 malayalam-font">Upload a top view of your hall or event space</p>

          {/* 16:9 Requirement Notice */}
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-blue-300">
              <Info className="w-5 h-5" />
              <span className="font-medium">📐 Please upload images in 16:9 aspect ratio for optimal analysis</span>
            </div>
            <p className="text-sm text-blue-200 mt-1">Wide landscape format works best for venue overhead shots</p>
          </div>
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
                <p className="text-gray-400 mb-2">Drag and drop your image here, or click to browse</p>
                <p className="text-sm text-yellow-400 mb-6">
                  📐 Recommended: 16:9 aspect ratio (1920x1080, 1280x720, etc.)
                </p>
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
            {/* Image Display */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative inline-block w-full">
                  <img
                    ref={imageRef}
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded event"
                    className="w-full h-auto rounded-lg shadow-2xl max-h-[70vh] object-contain mx-auto block"
                    onLoad={handleImageLoad}
                  />

                  {/* Gossip Zone Overlays */}
                  {imageLoaded &&
                    gossipZones.map((zone) => (
                      <div
                        key={zone.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                        style={{
                          top: zone.position.top,
                          left: zone.position.left,
                        }}
                      >
                        <div className="overlay-text px-3 py-2 rounded-lg text-white font-bold text-xs md:text-sm whitespace-nowrap">
                          <div className={`w-2 h-2 rounded-full ${zone.color} inline-block mr-2`}></div>
                          {zone.name}
                          <div className="text-xs opacity-75">{zone.confidence}%</div>
                        </div>
                      </div>
                    ))}

                  {/* Cluster Overlays */}
                  {imageLoaded &&
                    activeTab === "clusters" &&
                    zoneClusters.map((cluster) => (
                      <div
                        key={cluster.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          top: cluster.centerPosition.top,
                          left: cluster.centerPosition.left,
                        }}
                      >
                        <div className="bg-purple-600/80 backdrop-blur-sm px-3 py-2 rounded-full text-white font-bold text-xs border-2 border-purple-400">
                          <Users className="w-3 h-3 inline mr-1" />
                          Cluster {cluster.zones.length}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Tabs */}
            {imageLoaded && gossipZones.length > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                  <TabsTrigger value="zones" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Zones
                  </TabsTrigger>
                  <TabsTrigger value="clusters" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Clusters
                  </TabsTrigger>
                  <TabsTrigger value="heatmap" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Heatmap
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="zones" className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-gray-200">Paradooshanam Zones Detected</span>
                        <Badge variant="secondary">{gossipZones.length} zones found</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gossipZones.map((zone) => (
                          <div key={zone.id} className="p-4 rounded-lg bg-slate-700/50 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full ${zone.color}`}></div>
                                <span className="text-gray-200 font-medium">{zone.name}</span>
                              </div>
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                {zone.confidence}%
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Gossip Intensity</span>
                                <span className={getIntensityColor(zone.intensity)}>{zone.intensity}%</span>
                              </div>
                              <Progress value={zone.intensity} className="h-2" />
                            </div>
                            <p className="text-sm text-gray-300">{zone.description}</p>
                            {zone.nearbyZones.length > 0 && (
                              <div className="text-xs text-gray-400">
                                <span className="font-medium">Nearby: </span>
                                {zone.nearbyZones.join(", ")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="clusters" className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="text-gray-200">Zone Clusters & Recommendations</span>
                        <Badge variant="secondary">{zoneClusters.length} clusters found</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {zoneClusters.length > 0 ? (
                        <div className="space-y-4">
                          {zoneClusters.map((cluster) => (
                            <div key={cluster.id} className="p-4 rounded-lg bg-slate-700/50 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-medium text-gray-200">
                                  Cluster {cluster.id.split("-")[1]} ({cluster.zones.length} zones)
                                </h4>
                                <Badge variant="outline" className="text-purple-400 border-purple-400">
                                  Intensity: {Math.round(cluster.totalIntensity / cluster.zones.length)}%
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {cluster.zones.map((zone) => (
                                  <Badge key={zone.id} variant="secondary" className="text-xs">
                                    {zone.name}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm text-gray-300 italic">💡 {cluster.recommendation}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No zone clusters detected. Zones are well-distributed!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="heatmap" className="space-y-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-200">Gossip Intensity Heatmap</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Low Intensity</span>
                          <div className="flex space-x-1">
                            <div className="w-4 h-4 bg-green-400 rounded"></div>
                            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                            <div className="w-4 h-4 bg-orange-400 rounded"></div>
                            <div className="w-4 h-4 bg-red-400 rounded"></div>
                          </div>
                          <span className="text-gray-400">High Intensity</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {gossipZones
                            .sort((a, b) => b.intensity - a.intensity)
                            .map((zone) => (
                              <div
                                key={zone.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                                  <span className="text-sm text-gray-200">{zone.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${getIntensityColor(zone.intensity).replace("text-", "bg-")}`}
                                  ></div>
                                  <span className={`text-sm font-medium ${getIntensityColor(zone.intensity)}`}>
                                    {zone.intensity}%
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-gray-200">Analysis Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Zones:</span>
                          <span className="text-white font-medium">{gossipZones.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Average Confidence:</span>
                          <span className="text-green-400 font-medium">
                            {Math.round(gossipZones.reduce((sum, z) => sum + z.confidence, 0) / gossipZones.length)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Peak Intensity:</span>
                          <span className="text-red-400 font-medium">
                            {Math.max(...gossipZones.map((z) => z.intensity))}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Zone Clusters:</span>
                          <span className="text-purple-400 font-medium">{zoneClusters.length}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-gray-200">Top Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                          <p className="text-sm text-green-300">
                            🎯 <strong>Prime Zone:</strong>{" "}
                            {gossipZones.reduce((max, zone) => (zone.intensity > max.intensity ? zone : max)).name}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                          <p className="text-sm text-blue-300">
                            👥 <strong>Social Hub:</strong> Place refreshments near high-intensity zones
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                          <p className="text-sm text-purple-300">
                            📸 <strong>Photo Ops:</strong> Consider backdrop placement in central areas
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={regenerateZones}
                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Regenerate Analysis
              </Button>

              {imageLoaded && (
                <>
                  <Button
                    onClick={exportImage}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export Image
                  </Button>

                  <Button
                    onClick={shareAnalysis}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share Analysis
                  </Button>
                </>
              )}

              <Button
                onClick={resetUpload}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
              >
                <Upload className="w-5 h-5 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
