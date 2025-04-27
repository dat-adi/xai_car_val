"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { saveAssessment } from "@/lib/assessment-storage"

export default function FirstAssessmentPage() {
  const router = useRouter()
  const [valuation, setValuation] = useState<string>("")
  const [confidence, setConfidence] = useState<number>(5)
  const [error, setError] = useState<string>("")

  // For demo purposes, we're using a placeholder image
  // In a real application, you would fetch the car image from your database
  const carImage = "/car_image.png"
  const carDetails = {
    id: "car123",
    name: "Sedan XYZ 2020",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!valuation || isNaN(Number.parseFloat(valuation))) {
      setError("Please enter a valid valuation amount")
      return
    }

    // Save the first assessment data
    saveAssessment({
      carId: carDetails.id,
      firstValuation: Number.parseFloat(valuation),
      firstConfidence: confidence,
      timestamp: new Date().toISOString(),
    })

    // Navigate to the second assessment page
    router.push("/second-assessment")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Expert Valuation Assessment</h1>
        <p className="text-muted-foreground">Step 1 of 3: Initial Valuation</p>
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
                  <td className="py-2 px-4">Ford Explorer XLT 4WD</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Year</td>
                  <td className="py-2 px-4">2002</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Mileage</td>
                  <td className="py-2 px-4">243,165 miles</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Engine</td>
                  <td className="py-2 px-4">4.0L 6-Cylinder</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Transmission</td>
                  <td className="py-2 px-4">Automatic</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium">Service History</td>
                  <td className="py-2 px-4">Full service history recorded </td>
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vehicle Assessment</CardTitle>
          <CardDescription>
            Please provide your expert valuation based solely on the vehicle image below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl h-[300px] rounded-md overflow-hidden">
              <Image
                src={carImage || "/placeholder.svg"}
                alt="Vehicle for valuation"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="valuation">Your Valuation Estimate ($)</Label>
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
              <Label htmlFor="confidence">How confident are you with your prediction? (1-10)</Label>
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
            Submit & Continue
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Please provide your honest assessment based on your expertise.</p>
        <p>Your responses are confidential and will be used for research purposes only.</p>
      </div>
    </div>
  )
}
