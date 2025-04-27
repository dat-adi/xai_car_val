import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Car Valuation Study</h1>
        <p className="text-xl text-muted-foreground">Expert Assessment & Model Comparison</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to Our Research Study</CardTitle>
          <CardDescription>
            We're investigating how experts value vehicles and how model-based explanations might influence those
            valuations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Study Purpose</h3>
          <p>
            This study aims to understand how automotive experts assess vehicle values and whether AI-generated
            explanations can provide useful insights to improve valuation accuracy.
          </p>

          <h3 className="text-lg font-semibold">What to Expect</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>You'll be shown images of vehicles and asked to provide your expert valuation</li>
            <li>First, you'll make an initial assessment based solely on the vehicle image</li>
            <li>Then, you'll see model-generated explanations highlighting key valuation factors</li>
            <li>You'll have the opportunity to revise your valuation if desired</li>
            <li>The entire process takes approximately 10-15 minutes</li>
          </ul>

          <h3 className="text-lg font-semibold">Your Participation Matters</h3>
          <p>
            Your expertise is invaluable in helping us understand how professionals evaluate vehicles and how AI tools
            might support this process in the future.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/first-assessment" passHref>
            <Button size="lg" className="w-full sm:w-auto">
              Begin Study
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>© 2025 Car Valuation Research Team. All rights reserved.</p>
      </div>
    </div>
  )
}
