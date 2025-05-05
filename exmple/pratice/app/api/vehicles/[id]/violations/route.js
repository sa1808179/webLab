import { addViolation } from "@/repos/violations"
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
  try {
    const data = await request.json()
    const { id } = params

    const violation = await addViolation(id, data)
    return NextResponse.json(violation, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
