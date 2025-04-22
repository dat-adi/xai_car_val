"use server"

import { supabase } from "@/lib/supabase"

export async function createTables() {
  try {
    // Create vehicles table
    const { error: vehiclesError } = await supabase.rpc("create_vehicles_table", {})

    if (vehiclesError) {
      console.error("Error creating vehicles table:", vehiclesError)
      return { success: false, error: vehiclesError.message }
    }

    // Create assessments table
    const { error: assessmentsError } = await supabase.rpc("create_assessments_table", {})

    if (assessmentsError) {
      console.error("Error creating assessments table:", assessmentsError)
      return { success: false, error: assessmentsError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in createTables:", error)
    return { success: false, error: String(error) }
  }
}
