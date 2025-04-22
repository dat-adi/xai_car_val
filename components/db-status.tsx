"use client"

import { useState, useEffect } from "react"
import { createClientSideSupabaseClient } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export function DbStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createClientSideSupabaseClient()
        const { data, error } = await supabase.from("vehicles").select("count()", { count: "exact" }).limit(0)

        if (error) {
          console.error("Database connection error:", error)
          setStatus("error")
          setMessage(error.message)
          return
        }

        setStatus("connected")
        setMessage(`Connected to database`)
      } catch (err) {
        console.error("Failed to check database connection:", err)
        setStatus("error")
        setMessage(err instanceof Error ? err.message : String(err))
      }
    }

    checkConnection()
  }, [])

  if (status === "loading") {
    return (
      <Alert className="bg-gray-50">
        <AlertTitle className="flex items-center">
          <span className="animate-pulse mr-2">⏳</span> Checking database connection...
        </AlertTitle>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTitle className="flex items-center">
          <XCircle className="h-4 w-4 mr-2" /> Database Connection Error
        </AlertTitle>
        <AlertDescription>
          {message}
          <p className="text-sm mt-1">
            Please visit the{" "}
            <a href="/admin" className="underline">
              admin page
            </a>{" "}
            to initialize the database.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-green-50">
      <AlertTitle className="flex items-center">
        <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Database Connected
      </AlertTitle>
    </Alert>
  )
}
