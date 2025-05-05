import { NextResponse } from "next/server"
import { getDeckById, deleteDeck } from "@/repos/decks.js"
import { getSlidesByDeckId, createSlide } from "@/repos/slides.js"

// GET /api/:deck - Return of all the slides in a deck
export async function GET(request, context) {
  try {
    // Await the params object before accessing its properties
    const { deck } = await context.params

    // First check if the deck exists
    await getDeckById(deck)

    // Get all slides in the deck
    const slides = await getSlidesByDeckId(deck)
    return NextResponse.json(slides, { status: 200 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/:deck - Create a slide based on the request body and return it
export async function POST(request, context) {
  try {
    // Await the params object before accessing its properties
    const { deck } = await context.params

    const data = await request.json()

    if (!data.title) {
      return NextResponse.json({ error: "Slide title is required" }, { status: 400 })
    }

    const slide = await createSlide(deck, data)
    return NextResponse.json(slide, { status: 201 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE /api/:deck - Delete the deck having the provided identifier if empty
export async function DELETE(request, context) {
  try {
    // Await the params object before accessing its properties
    const { deck } = await context.params

    const deckResult = await deleteDeck(deck)
    return NextResponse.json(deckResult, { status: 200 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    } else if (error.message.includes("contains slides")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
