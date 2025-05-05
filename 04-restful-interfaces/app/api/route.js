// Import Next.js helper for creating API responses
import { NextResponse } from "next/server"

// Import repository methods for getting and creating decks
import { getAllDecks, createDeck } from "@/repos/decks.js"


// GET /api - Return all the decks in the collection
export async function GET() {
  try {
    // Fetch all decks from the database using the repo method
    const decks = await getAllDecks()

    // Return the decks as JSON with a success response and count
    return NextResponse.json(
      {
        success: true,
        data: decks,
        count: decks.length,
      },
      { status: 200 }, // 200 OK
    )
  } catch (error) {
    // If something goes wrong, return a 500 Internal Server Error
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}


// POST /api - Create a deck based on the request body and return it
export async function POST(request) {
  try {
    // Extract the JSON body from the request
    const data = await request.json()

    // Validation: ensure the title is present
    if (!data.title) {
      return NextResponse.json(
        {
          success: false,
          error: "Deck title is required", // Custom error message
        },
        { status: 400 }, // 400 Bad Request
      )
    }

    // Call the repository method to create the deck
    const deck = await createDeck(data)

    // Return the newly created deck with a 201 Created status
    return NextResponse.json(
      {
        success: true,
        data: deck,
        message: "Deck created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    // Handle bad request or server error
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 },
    )
  }
}
