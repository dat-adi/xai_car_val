import { DbInitializer } from "@/components/db-initializer"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the car valuation study</p>
      </header>

      <DbInitializer />

      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>© 2024 Car Valuation Research Team. All rights reserved.</p>
      </div>
    </div>
  )
}
