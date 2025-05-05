import { getVehicles, createVehicle } from "@/repos/vehicles"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const vehicles = await getVehicles()
    return NextResponse.json(vehicles, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const vehicle = await createVehicle(body)
    return NextResponse.json(vehicle, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
