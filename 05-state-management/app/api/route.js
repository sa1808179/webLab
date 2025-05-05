import { NextResponse } from "next/server"
import { getAllDecks, createDeck } from "@/repos/decks.js"

// GET /api - Return all the decks in the collection
export async function GET() {
  try {
    const decks = await getAllDecks()
    return NextResponse.json(decks, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api - Create a deck based on the request body and return it
export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.title) {
      return NextResponse.json({ error: "Deck title is required" }, { status: 400 })
    }

    const deck = await createDeck(data)
    return NextResponse.json(deck, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
