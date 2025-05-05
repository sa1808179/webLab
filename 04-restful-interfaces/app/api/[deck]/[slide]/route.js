import { NextResponse } from "next/server"
import { deleteSlide, getSlideById } from "@/repos/slides.js"
import { getCardsBySlideId, createCard } from "@/repos/cards.js"

// GET /api/:deck/:slide - Return all the cards in a slide
export async function GET(request, context) {
  try {
    // Await the params object before accessing its properties
    const { slide, deck } = await context.params

    // Get slide information
    const slideData = await getSlideById(slide, deck)

    // Get all cards in the slide, verifying the slide belongs to the deck
    const cards = await getCardsBySlideId(slide, deck)
    return NextResponse.json(
      {
        success: true,
        data: cards,
        count: cards.length,
        slide: slideData,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// POST /api/:deck/:slide - Create a card based on the request body and return it
export async function POST(request, context) {
  try {
    // Await the params object before accessing its properties
    const { slide, deck } = await context.params

    const data = await request.json()

    if (!data.type) {
      return NextResponse.json(
        {
          success: false,
          error: "Card type is required",
        },
        { status: 400 },
      )
    }

    // Add a validation for card type to ensure it's one of the three valid types
    if (!["string-list", "playing-card", "foreign-word"].includes(data.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Card type must be one of: string-list, playing-card, foreign-word",
        },
        { status: 400 },
      )
    }

    if (!data.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Card data is required",
        },
        { status: 400 },
      )
    }

    const card = await createCard(slide, deck, data)
    return NextResponse.json(
      {
        success: true,
        data: card,
        message: "Card created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    )
  }
}

// DELETE /api/:deck/:slide - Delete the slide having the provided identifier if empty
export async function DELETE(request, context) {
  try {
    // Await the params object before accessing its properties
    const { slide, deck } = await context.params

    const slideResult = await deleteSlide(slide, deck)
    return NextResponse.json(
      {
        success: true,
        data: slideResult,
        message: "Slide deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 },
      )
    } else if (error.message.includes("contains cards")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    } else {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }
  }
}
