"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAssessment, clearAssessment } from "@/lib/assessment-storage"
import { ValuationComparison } from "@/components/valuation-comparison"

export default function ResultsPage() {
  const router = useRouter()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Load the completed assessment data
    async function loadAssessment() {
      try {
        const savedAssessment = await getAssessment()
        if (savedAssessment && savedAssessment.secondValuation) {
          setAssessment(savedAssessment)
        }
      } catch (err) {
        console.error("Error loading assessment:", err)
      } finally {
        setLoading(false)
      }
    }

    loadAssessment()
  }, [])

  const handleStartNew = () => {
    // Clear the current assessment data
    clearAssessment()
    // Navigate back to the start
    router.push("/")
  }

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>
  }

  if (!assessment || !assessment.secondValuation) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>No completed assessment found. Please complete the study first.</p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Return to Start
        </Button>
      </div>
    )
  }

  const valuationDifference = assessment.secondValuation - assessment.firstValuation
  const percentChange = (valuationDifference / assessment.firstValuation) * 100
  const confidenceDifference = assessment.secondConfidence - assessment.firstConfidence
  const groundTruth = 26500

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Thank You!</h1>
        <p className="text-xl text-muted-foreground">Your participation in our study is greatly appreciated</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Valuation Results</CardTitle>
          <CardDescription>
            Here's how your valuations compared before and after seeing the model explanation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ValuationComparison
            firstValuation={assessment.firstValuation}
            secondValuation={assessment.secondValuation}
            modelPrediction={assessment.modelPrediction}
            groundTruth={groundTruth}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Valuation Change</h3>
              <p className="text-3xl font-bold">
                {valuationDifference >= 0 ? "+" : ""}${valuationDifference.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {percentChange.toFixed(1)}% {percentChange >= 0 ? "increase" : "decrease"}
              </p>
            </div>

            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Confidence Change</h3>
              <p className="text-3xl font-bold">
                {confidenceDifference >= 0 ? "+" : ""}
                {confidenceDifference} points
              </p>
              <p className="text-sm text-muted-foreground">
                From {assessment.firstConfidence} to {assessment.secondConfidence} out of 10
              </p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">What This Means</h3>
            <p className="mb-3">
              {Math.abs(percentChange) < 5
                ? "Your valuation remained relatively consistent after seeing the model explanation."
                : percentChange > 0
                  ? "You increased your valuation after seeing the model explanation."
                  : "You decreased your valuation after seeing the model explanation."}
            </p>
            <p className="mb-3">
              {confidenceDifference > 0
                ? "Your confidence in your valuation increased after reviewing the model factors."
                : confidenceDifference < 0
                  ? "Your confidence in your valuation decreased after reviewing the model factors."
                  : "Your confidence level remained the same after reviewing the model factors."}
            </p>
            <p>
              This data helps us understand how model explanations influence expert valuations and whether they can
              improve valuation accuracy and confidence.
            </p>
          </div>

          <div className="p-6 border rounded-lg mt-6">
            <h3 className="text-lg font-semibold mb-4">Final Ground Truth</h3>
            <p className="mb-3">
              The actual market value of this vehicle was determined to be{" "}
              <span className="font-bold">${groundTruth.toLocaleString()}</span> based on recent comparable sales and
              professional appraisal.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-700">Your Initial Estimate</p>
                <p className="text-xl font-bold">${assessment.firstValuation.toLocaleString()}</p>
                <p className="text-sm mt-1">
                  {Math.abs(assessment.firstValuation - groundTruth) < 1000
                    ? "Very accurate!"
                    : assessment.firstValuation > groundTruth
                      ? "Higher than actual value"
                      : "Lower than actual value"}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-md">
                <p className="text-sm font-medium text-purple-700">Model's Prediction</p>
                <p className="text-xl font-bold">${assessment.modelPrediction.toLocaleString()}</p>
                <p className="text-sm mt-1">
                  {Math.abs(assessment.modelPrediction - groundTruth) < 1000
                    ? "Very accurate!"
                    : assessment.modelPrediction > groundTruth
                      ? "Higher than actual value"
                      : "Lower than actual value"}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-md">
                <p className="text-sm font-medium text-green-700">Your Final Estimate</p>
                <p className="text-xl font-bold">${assessment.secondValuation.toLocaleString()}</p>
                <p className="text-sm mt-1">
                  {Math.abs(assessment.secondValuation - groundTruth) < 1000
                    ? "Very accurate!"
                    : assessment.secondValuation > groundTruth
                      ? "Higher than actual value"
                      : "Lower than actual value"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-muted-foreground mb-2">
            Your responses have been recorded. Thank you for participating in our study!
          </p>
          <Button onClick={handleStartNew} variant="outline" className="w-full">
            Start a New Assessment
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>© 2024 Car Valuation Research Team. All rights reserved.</p>
        <p>For questions about this study, please contact research@carvaluation.example.com</p>
      </div>
    </div>
  )
}
