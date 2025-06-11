"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Briefcase, Play, CheckCircle } from "lucide-react"

export default function PortfolioParser() {
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [parsedPortfolio, setParsedPortfolio] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!portfolioUrl.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/portfolios", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ url: portfolioUrl }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      setParsedPortfolio({ url: portfolioUrl, data })
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
      if (error.message.includes("CORS") || error.message.includes("fetch")) {
        alert("CORS error: Please ensure your backend server allows requests from this domain.")
      } else {
        alert("Failed to parse portfolio. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryExample = (url) => {
    setPortfolioUrl(url)
  }

  return (
    <div className="min-h-screen bg-[#f9f9f7]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl font-medium text-slate-600 mb-3">Access Verified Talent</h1>
          <p className="text-slate-600 text-lg">
            Submit a portfolio link to view talent's work in a structured format with basic info and client projects.
          </p>
        </div>

        {/* Portfolio URL Input */}
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-medium text-slate-600 mb-4">Submit Portfolio Link</h2>
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://your-portfolio-site.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="flex-1 border-slate-300"
                  />
                  <Button type="submit" disabled={isLoading} className="bg-slate-800 hover:bg-slate-700 text-white">
                    {isLoading ? "Parsing..." : "Parse Portfolio"}
                  </Button>
                </div>

                {/* Example Links */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Try these example portfolios:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTryExample("https://sonuchoudhary.my.canva.site/portfolio")}
                      className="border-slate-300 text-slate-600"
                    >
                      Sonu's Portfolio
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTryExample("https://dellinzhang.com/video-edit")}
                      className="border-slate-300 text-slate-600"
                    >
                      Dellin's Portfolio
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Parsed Portfolio Display */}
        {parsedPortfolio && (
          <div className="space-y-8">
            <h2 className="text-2xl font-medium text-slate-600 mb-4">Talent Profile</h2>

            {/* Source URL */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <ExternalLink className="h-4 w-4" />
              <span>Parsed from:</span>
              <a
                href={parsedPortfolio.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {parsedPortfolio.url}
              </a>
            </div>

            {/* Basic Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm border-0 overflow-hidden rounded-2xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {parsedPortfolio.data.basic_info.image && (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={parsedPortfolio.data.basic_info.image || "/placeholder.svg"}
                          alt={parsedPortfolio.data.basic_info.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="status-badge flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Open to work
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-slate-600 mb-1">{parsedPortfolio.data.basic_info.name}</h3>
                    <p className="text-slate-500 mb-3">{parsedPortfolio.data.basic_info.role}</p>

                    {parsedPortfolio.data.basic_info.bio && (
                      <p className="text-sm text-slate-600 mt-4">{parsedPortfolio.data.basic_info.bio}</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm font-medium text-slate-600">From $250/hourly</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employers/Clients Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-slate-600 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Employers/Clients
                </h3>

                <div className="grid gap-4">
                  {parsedPortfolio.data.employers &&
                    parsedPortfolio.data.employers.map((employer) => (
                      <Card key={employer.id} className="bg-white shadow-sm border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {employer.image && (
                              <div className="h-16 w-16 rounded-full overflow-hidden">
                                <img
                                  src={employer.image || "/placeholder.svg"}
                                  alt={employer.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="text-lg font-medium text-slate-600">{employer.name}</h4>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>

            {/* Videos Section */}
            <div className="mt-8">
              <h3 className="text-xl font-medium text-slate-600 flex items-center gap-2 mb-4">
                <Play className="h-5 w-5" />
                Videos
              </h3>

              <div className="grid md:grid-cols-3 gap-6">
                {parsedPortfolio.data.videos &&
                  parsedPortfolio.data.videos.map((video) => (
                    <Card key={video.id} className="bg-white shadow-sm border-0 overflow-hidden rounded-2xl">
                      <div className="aspect-video">
                        <iframe
                          src={video.url}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Portfolio video"
                        ></iframe>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
