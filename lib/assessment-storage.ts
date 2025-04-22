// Simple localStorage-based storage for assessment data
// In a real application, you would use a database or API

const STORAGE_KEY = "car-valuation-assessment"

export interface Assessment {
  carId: string
  firstValuation: number
  firstConfidence: number
  secondValuation?: number
  secondConfidence?: number
  modelPrediction?: number
  timestamp: string
  completedAt?: string
}

export function saveAssessment(assessment: Assessment): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessment))
  }
}

export function getAssessment(): Assessment | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  }
  return null
}

export function updateAssessment(assessment: Assessment): void {
  saveAssessment(assessment)
}

export function clearAssessment(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}
