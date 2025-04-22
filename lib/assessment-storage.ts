import { createClientSideSupabaseClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Get or create a session ID to track the current user
const getSessionId = () => {
  if (typeof window !== "undefined") {
    let sessionId = localStorage.getItem("car_valuation_session_id")
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem("car_valuation_session_id", sessionId)
    }
    return sessionId
  }
  return null
}

export interface Assessment {
  id?: string
  sessionId?: string
  carId: string
  firstValuation: number
  firstConfidence: number
  secondValuation?: number
  secondConfidence?: number
  modelPrediction?: number
  groundTruth?: number
  timestamp: string
  completedAt?: string
}

// Save the initial assessment
export async function saveAssessment(assessment: Assessment): Promise<void> {
  try {
    // Always save to localStorage as a backup
    if (typeof window !== "undefined") {
      localStorage.setItem("car_valuation_assessment", JSON.stringify(assessment))
    }

    const sessionId = getSessionId()
    if (!sessionId) {
      console.error("No session ID available")
      return
    }

    try {
      const supabase = createClientSideSupabaseClient()

      // Check if the assessments table exists before trying to insert
      const { data: tableExists, error: checkError } = await supabase
        .from("assessments")
        .select("id")
        .limit(1)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking assessments table:", checkError)
        // Table might not exist, so we'll just use localStorage
        return
      }

      // Store in Supabase
      const { error } = await supabase.from("assessments").insert({
        session_id: sessionId,
        vehicle_id: assessment.carId,
        first_valuation: assessment.firstValuation,
        first_confidence: assessment.firstConfidence,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving assessment:", error.message, error.details, error.hint)
      }
    } catch (supabaseError) {
      console.error("Supabase error in saveAssessment:", supabaseError)
    }
  } catch (error) {
    console.error("General error in saveAssessment:", error)
  }
}

// Get the current assessment
export async function getAssessment(): Promise<Assessment | null> {
  try {
    // First try to get from localStorage as a fallback
    let localData = null
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("car_valuation_assessment")
      if (data) {
        localData = JSON.parse(data)
      }
    }

    const sessionId = getSessionId()
    if (!sessionId) {
      return localData
    }

    try {
      const supabase = createClientSideSupabaseClient()

      // Check if the assessments table exists
      const { error: checkError } = await supabase.from("assessments").select("id").limit(1).maybeSingle()

      if (checkError) {
        console.error("Error checking assessments table:", checkError)
        return localData
      }

      // Get from Supabase
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("Error getting assessment:", error.message)
        return localData
      }

      if (data) {
        // Convert from snake_case to camelCase
        return {
          id: data.id,
          sessionId: data.session_id,
          carId: data.vehicle_id,
          firstValuation: data.first_valuation,
          firstConfidence: data.first_confidence,
          secondValuation: data.second_valuation,
          secondConfidence: data.second_confidence,
          modelPrediction: data.model_prediction,
          groundTruth: data.ground_truth,
          timestamp: data.created_at,
          completedAt: data.completed_at,
        }
      }

      return localData
    } catch (supabaseError) {
      console.error("Supabase error in getAssessment:", supabaseError)
      return localData
    }
  } catch (error) {
    console.error("General error in getAssessment:", error)
    return null
  }
}

// Update the assessment with second valuation
export async function updateAssessment(assessment: Assessment): Promise<void> {
  try {
    // Always update localStorage as a backup
    if (typeof window !== "undefined") {
      localStorage.setItem("car_valuation_assessment", JSON.stringify(assessment))
    }

    const sessionId = getSessionId()
    if (!sessionId) {
      console.error("No session ID available")
      return
    }

    try {
      const supabase = createClientSideSupabaseClient()

      // Check if the assessments table exists
      const { error: checkError } = await supabase.from("assessments").select("id").limit(1).maybeSingle()

      if (checkError) {
        console.error("Error checking assessments table:", checkError)
        return
      }

      // Get the assessment ID from Supabase
      const { data, error: fetchError } = await supabase
        .from("assessments")
        .select("id")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (fetchError || !data) {
        console.error("Error fetching assessment for update:", fetchError?.message || "No data found")
        return
      }

      // Update in Supabase
      const { error } = await supabase
        .from("assessments")
        .update({
          second_valuation: assessment.secondValuation,
          second_confidence: assessment.secondConfidence,
          model_prediction: assessment.modelPrediction,
          ground_truth: assessment.groundTruth || null,
          completed_at: new Date().toISOString(),
        })
        .eq("id", data.id)

      if (error) {
        console.error("Error updating assessment:", error.message, error.details, error.hint)
      }
    } catch (supabaseError) {
      console.error("Supabase error in updateAssessment:", supabaseError)
    }
  } catch (error) {
    console.error("General error in updateAssessment:", error)
  }
}

// Clear the current assessment
export function clearAssessment(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("car_valuation_assessment")
  }
}
