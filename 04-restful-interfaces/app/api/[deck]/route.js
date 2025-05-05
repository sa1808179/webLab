// Import Next.js helper for creating API responses
import { NextResponse } from "next/server";

// Import required repository methods for decks and slides
import { getDeckById, deleteDeck } from "@/repos/decks.js";
import { getSlidesByDeckId, createSlide } from "@/repos/slides.js";

/**
 * GET /api/:deck
 * Returns all slides that belong to a specific deck.
 */
export async function GET(request, context) {
  try {
    const { deck } = await context.params;

    // Check if the deck exists
    const deckData = await getDeckById(deck);

    // Retrieve all slides under the deck
    const slides = await getSlidesByDeckId(deck);

    return NextResponse.json(
      {
        success: true,
        data: slides,
        count: slides.length,
        deck: deckData,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/:deck
 * Creates a new slide inside a specified deck.
 */
export async function POST(request, context) {
  try {
    const { deck } = await context.params;
    const data = await request.json();

    // Ensure the slide has a title
    if (!data.title) {
      return NextResponse.json(
        {
          success: false,
          error: "Slide title is required",
        },
        { status: 400 }
      );
    }

    // Create the slide
    const slide = await createSlide(deck, data);

    return NextResponse.json(
      {
        success: true,
        data: slide,
        message: "Slide created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/:deck
 * Deletes a deck if it's empty (i.e., contains no slides).
 */
export async function DELETE(request, context) {
  try {
    const { deck } = await context.params;

    // Attempt to delete the deck
    const deckResult = await deleteDeck(deck);

    return NextResponse.json(
      {
        success: true,
        data: deckResult,
        message: "Deck deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    } else if (error.message.includes("contains slides")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
}
