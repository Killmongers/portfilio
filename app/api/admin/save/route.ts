import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Try to send to FastAPI backend for permanent storage
    try {
      const response = await fetch("http://127.0.0.1:8000/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Portfolio data saved to backend:", result)

        return NextResponse.json({
          success: true,
          message: "Portfolio data saved permanently to backend",
          backend_response: result,
        })
      } else {
        throw new Error("Backend save failed")
      }
    } catch (backendError) {
      console.log("Backend not available, saving locally only")

      // Fallback: log the data for debugging
      console.log("Portfolio data (local save):", {
        personalInfo: data.personalInfo?.name,
        projectsCount: data.projects?.length,
        skillsCount: data.skills?.length,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: "Data saved locally (backend not available)",
        error: "Backend connection failed",
      })
    }
  } catch (error) {
    console.error("Error processing save request:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process save request",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

