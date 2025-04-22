"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { getAssessment, updateAssessment } from "@/lib/assessment-storage"

export default function SecondAssessmentPage() {
  const router = useRouter()
  const [assessment, setAssessment] = useState<any>(null)
  const [valuation, setValuation] = useState<string>("")
  const [confidence, setConfidence] = useState<number>(5)
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  // For demo purposes, we're using a placeholder image
  const carImage = "/placeholder.svg?height=400&width=600"

  // Mock model prediction and factors
  const modelPrediction = 25000

  useEffect(() => {
    // Load the previous assessment data
    const savedAssessment = getAssessment()
    if (savedAssessment) {
      setAssessment(savedAssessment)
      // Pre-fill with the previous valuation as a starting point
      setValuation(savedAssessment.firstValuation.toString())
      setConfidence(savedAssessment.firstConfidence)
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!valuation || isNaN(Number.parseFloat(valuation))) {
      setError("Please enter a valid valuation amount")
      return
    }

    if (!assessment) {
      setError("Previous assessment data not found")
      return
    }

    // Update the assessment with the second valuation
    updateAssessment({
      ...assessment,
      secondValuation: Number.parseFloat(valuation),
      secondConfidence: confidence,
      modelPrediction: modelPrediction,
      completedAt: new Date().toISOString(),
    })

    // Navigate to the results page
    router.push("/results")
  }

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>
  }

  if (!assessment) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>No previous assessment found. Please start from the beginning.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Return to Start
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Model-Informed Valuation</h1>
        <p className="text-muted-foreground">Step 2 of 3: Review Model Insights</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
          <CardDescription>Details about the vehicle being assessed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Brand & Model</td>
                  <td className="py-2 px-4">Toyota Camry XSE</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Year</td>
                  <td className="py-2 px-4">2020</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Mileage</td>
                  <td className="py-2 px-4">45,230 miles</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Engine</td>
                  <td className="py-2 px-4">2.5L 4-Cylinder</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Transmission</td>
                  <td className="py-2 px-4">Automatic</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Service History</td>
                  <td className="py-2 px-4">5 dealer service visits</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium">Accidents</td>
                  <td className="py-2 px-4">None reported</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[250px] rounded-md overflow-hidden">
              <Image
                src={carImage || "/placeholder.svg"}
                alt="Vehicle for valuation"
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Explanation</CardTitle>
            <CardDescription>Key factors influencing the vehicle's value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="font-medium">Model Valuation Estimate:</p>
              <p className="text-2xl font-bold">${modelPrediction.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Price Contribution Factors</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 border rounded-md bg-green-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Base Model Value</span>
                    <span className="font-bold text-green-700">+$18,500</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Standard value for this make, model, and year</p>
                </div>

                <div className="p-3 border rounded-md bg-green-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Low Mileage Bonus</span>
                    <span className="font-bold text-green-700">+$2,200</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Below average mileage for vehicle age</p>
                </div>

                <div className="p-3 border rounded-md bg-green-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Premium Features</span>
                    <span className="font-bold text-green-700">+$3,800</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Leather seats, sunroof, premium audio</p>
                </div>

                <div className="p-3 border rounded-md bg-red-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Market Adjustment</span>
                    <span className="font-bold text-red-700">-$1,500</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Current market conditions for this model</p>
                </div>

                <div className="p-3 border rounded-md bg-green-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Service History</span>
                    <span className="font-bold text-green-700">+$2,000</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Well-maintained with regular dealer service</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Revised Valuation</CardTitle>
          <CardDescription>Based on the model explanation, you may revise your valuation if desired.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-md">
            <p className="font-medium">Your Initial Valuation:</p>
            <p className="text-xl">${assessment.firstValuation.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Confidence: {assessment.firstConfidence}/10</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="valuation">Your Revised Valuation Estimate ($)</Label>
              <Input
                id="valuation"
                type="number"
                placeholder="Enter amount in USD"
                value={valuation}
                onChange={(e) => setValuation(e.target.value)}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="space-y-4">
              <Label htmlFor="confidence">
                How confident are you with this prediction given the model's assistance? (1-10)
              </Label>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Low (1)</span>
                <Slider
                  id="confidence"
                  min={1}
                  max={10}
                  step={1}
                  value={[confidence]}
                  onValueChange={(value) => setConfidence(value[0])}
                  className="flex-1"
                />
                <span className="text-sm">High (10)</span>
              </div>
              <div className="text-center font-medium">{confidence}</div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Submit & Complete Study
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
