import { NextResponse } from "next/server"
import { deleteSlide } from "@/repos/slides.js"
import { getCardsBySlideId, createCard } from "@/repos/cards.js"

// GET /api/:deck/:slide - Return all the cards in a slide
export async function GET(request, context) {
  try {
    // Await the params object before accessing its properties
    const { slide, deck } = await context.params

    // Get all cards in the slide, verifying the slide belongs to the deck
    const cards = await getCardsBySlideId(slide, deck)
    return NextResponse.json(cards, { status: 200 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/:deck/:slide - Create a card based on the request body and return it
export async function POST(request, context) {
  try {
    // Await the params object before accessing its properties
    const { slide, deck } = await context.params

    const data = await request.json()

    if (!data.type) {
      return NextResponse.json({ error: "Card type is required" }, { status: 400 })
    }

    if (!data.data) {
      return NextResponse.json({ error: "Card data is required" }, { status: 400 })
    }

    const card = await createCard(slide, deck, data)
    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE /api/:deck/:slide - Delete the slide having the provided identifier if empty
export async function DELETE(request, context) {
  try {
    // Await the params object before accessing its properties
    const { slide, deck } = await context.params

    const slideResult = await deleteSlide(slide, deck)
    return NextResponse.json(slideResult, { status: 200 })
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    } else if (error.message.includes("contains cards")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
