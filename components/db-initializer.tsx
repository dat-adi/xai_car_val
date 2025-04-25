"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClientSideSupabaseClient } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DbInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [dbStatus, setDbStatus] = useState<{ tables: string[]; exists: boolean } | null>(null)

  const checkDatabaseStatus = async () => {
    try {
      const supabase = createClientSideSupabaseClient()

      // Check if tables exist
      const { data: tables, error } = await supabase
      .from('tables')
      .select('table_name')
      .eq('table_schema', 'public')
      // You may need to specify the schema
      .schema('information_schema');

      if (error) {
        console.error("Error checking database status:", error)
        setDbStatus(null)
        return false
      }

      const tableNames = tables?.map((t) => t.table_name) || []
      const hasVehicles = tableNames.includes("vehicles")
      const hasAssessments = tableNames.includes("assessments")

      setDbStatus({
        tables: tableNames,
        exists: hasVehicles && hasAssessments,
      })

      return hasVehicles && hasAssessments
    } catch (err) {
      console.error("Error checking database:", err)
      setDbStatus(null)
      return false
    }
  }

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setMessage("")
    setError("")

    try {
      const supabase = createClientSideSupabaseClient()

      // Create extension for UUID generation
      const { error: extensionError } = await supabase.rpc("execute_sql", {
        sql_query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      }).then(({ error }) => ({ error }))

      if (extensionError) {
        console.warn("Could not create uuid-ossp extension:", extensionError)
        // Continue anyway, as it might already exist
      }

      // Create vehicles table
      const { error: vehiclesError } = await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS vehicles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            year INTEGER NOT NULL,
            mileage INTEGER NOT NULL,
            engine TEXT,
            transmission TEXT,
            service_visits INTEGER,
            accidents TEXT,
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (vehiclesError) {
        throw new Error(`Error creating vehicles table: ${vehiclesError.message}`)
      }

      // Create assessments table
      const { error: assessmentsError } = await supabase.rpc("execute_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS assessments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            session_id TEXT NOT NULL,
            vehicle_id TEXT,
            first_valuation DECIMAL NOT NULL,
            first_confidence INTEGER NOT NULL,
            second_valuation DECIMAL,
            second_confidence INTEGER,
            model_prediction DECIMAL,
            ground_truth DECIMAL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE
          );
          
          CREATE INDEX IF NOT EXISTS idx_assessments_session_id ON assessments(session_id);
        `,
      })

      if (assessmentsError) {
        throw new Error(`Error creating assessments table: ${assessmentsError.message}`)
      }

      // Seed a sample vehicle
      const { error: seedError } = await supabase.rpc("execute_sql", {
        sql_query: `
          INSERT INTO vehicles (brand, model, year, mileage, engine, transmission, service_visits, accidents)
          VALUES ('Toyota', 'Camry XSE', 2020, 45230, '2.5L 4-Cylinder', 'Automatic', 5, 'None reported')
          ON CONFLICT DO NOTHING;
        `,
      })

      if (seedError) {
        throw new Error(`Error seeding vehicle data: ${seedError.message}`)
      }

      await checkDatabaseStatus()
      setMessage("Database initialized successfully!")
    } catch (err) {
      console.error("Database initialization error:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsInitializing(false)
    }
  }

  // Check database status on component mount
  useState(() => {
    checkDatabaseStatus()
  })

  return (
    <div className="p-4 border rounded-md mb-6">
      <h2 className="text-lg font-semibold mb-2">Database Setup</h2>
      <p className="mb-4">Initialize the database tables for the car valuation study.</p>

      {dbStatus && (
        <Alert className="mb-4">
          <AlertTitle>Database Status</AlertTitle>
          <AlertDescription>
            {dbStatus.exists ? (
              <p className="text-green-600">Tables are set up correctly.</p>
            ) : (
              <p className="text-amber-600">Database tables need to be initialized.</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Found tables: {dbStatus.tables.length > 0 ? dbStatus.tables.join(", ") : "None"}
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button onClick={initializeDatabase} disabled={isInitializing}>
          {isInitializing ? "Initializing..." : "Initialize Database"}
        </Button>

        <Button variant="outline" onClick={checkDatabaseStatus} disabled={isInitializing}>
          Check Status
        </Button>
      </div>

      {message && <p className="mt-2 text-green-600">{message}</p>}

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600 font-medium">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
