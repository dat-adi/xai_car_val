import { Bar } from "@/components/ui/bar"

interface ValuationComparisonProps {
  firstValuation: number
  secondValuation: number
  modelPrediction: number
  groundTruth?: number
}

export function ValuationComparison({
  firstValuation,
  secondValuation,
  modelPrediction,
  groundTruth,
}: ValuationComparisonProps) {
  // Find the max value for scaling the chart
  const maxValue = Math.max(firstValuation, secondValuation, modelPrediction, groundTruth || 0) * 1.1

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Valuation Comparison</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Initial Valuation</span>
            <span className="font-bold">${firstValuation.toLocaleString()}</span>
          </div>
          <Bar value={(firstValuation / maxValue) * 100} className="h-8 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Model Prediction</span>
            <span className="font-bold">${modelPrediction.toLocaleString()}</span>
          </div>
          <Bar
            value={(modelPrediction / maxValue) * 100}
            className="h-8 bg-purple-100"
            indicatorClassName="bg-purple-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Revised Valuation</span>
            <span className="font-bold">${secondValuation.toLocaleString()}</span>
          </div>
          <Bar
            value={(secondValuation / maxValue) * 100}
            className="h-8 bg-green-100"
            indicatorClassName="bg-green-500"
          />
        </div>

        {groundTruth && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Ground Truth (Actual Value)</span>
              <span className="font-bold">${groundTruth.toLocaleString()}</span>
            </div>
            <Bar
              value={(groundTruth / maxValue) * 100}
              className="h-8 bg-amber-100"
              indicatorClassName="bg-amber-500"
            />
          </div>
        )}
      </div>
    </div>
  )
}
