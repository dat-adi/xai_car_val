import { Progress } from "@/components/ui/progress"

type Factor = {
  name: string
  score: number
  impact: "positive" | "negative" | "neutral"
}

interface ExplanationFactorsProps {
  factors: Factor[]
}

export function ExplanationFactors({ factors }: ExplanationFactorsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Key Valuation Factors</h3>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{factor.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  factor.impact === "positive"
                    ? "bg-green-100 text-green-800"
                    : factor.impact === "negative"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {factor.impact === "positive" ? "+" : factor.impact === "negative" ? "-" : ""}
                {factor.score.toFixed(1)}
              </span>
            </div>
            <Progress
              value={factor.score * 10}
              className={`h-2 ${
                factor.impact === "positive"
                  ? "bg-green-100"
                  : factor.impact === "negative"
                    ? "bg-red-100"
                    : "bg-gray-100"
              }`}
              indicatorClassName={
                factor.impact === "positive"
                  ? "bg-green-500"
                  : factor.impact === "negative"
                    ? "bg-red-500"
                    : "bg-gray-500"
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}
