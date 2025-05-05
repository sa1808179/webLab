import { updateViolation, deleteViolation } from "@/repos/violations"
import { NextResponse } from "next/server"

// PATCH /api/vehicles/:id/violations/:vid
export async function PATCH(request, { params }) {
  try {
    const { id, vid } = params
    const data = await request.json()

    const updated = await updateViolation(id, vid, data)
    return NextResponse.json(updated, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

// DELETE /api/vehicles/:id/violations/:vid
export async function DELETE(request, { params }) {
  try {
    const { id, vid } = params

    const deleted = await deleteViolation(id, vid)
    return NextResponse.json(deleted, { status: 200 })
  } catch (e) {
    const status = e.message.includes("unpaid") ? 403 : 400
    return NextResponse.json({ error: e.message }, { status })
  }
}
