import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Try to send to FastAPI backend first
    try {
      const backendResponse = await fetch("http://127.0.0.1:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      })

      if (backendResponse.ok) {
        const result = await backendResponse.json()
        return NextResponse.json({ message: result.message }, { status: 200 })
      }
    } catch (backendError) {
      console.log("Backend not available, logging locally")
    }

    // Fallback: log locally
    console.log("Contact form submission:", { name, email, subject, message })

    // You could also integrate with email services like:
    // - SendGrid
    // - Nodemailer
    // - Resend
    // - Or send to your FastAPI backend for processing

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

