import { prisma } from "./prisma.js"

// Get all decks with count of slides
export async function getAllDecks() {
  try {
    const decks = await prisma.deck.findMany({
      include: {
        _count: {
          select: { slides: true },
        },
      },
    })

    return decks.map((deck) => ({
      ...deck,
      slideCount: deck._count.slides,
      _count: undefined,
    }))
  } catch (error) {
    throw new Error(`Failed to retrieve decks: ${error.message}`)
  }
}

// Get a deck by ID with slide information
export async function getDeckById(id) {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        _count: {
          select: { slides: true },
        },
      },
    })

    if (!deck) {
      throw new Error(`Deck with ID ${id} not found in database`)
    }

    return {
      ...deck,
      slideCount: deck._count.slides,
      _count: undefined,
    }
  } catch (error) {
    throw new Error(`Failed to retrieve deck: ${error.message}`)
  }
}

// Create a new deck with validation
export async function createDeck(data) {
  try {
    // Validate required fields
    if (!data.title || data.title.trim() === "") {
      throw new Error("Deck title is required and cannot be empty")
    }

    // Validate tags if provided
    if (data.tags && !Array.isArray(data.tags)) {
      throw new Error("Tags must be an array")
    }

    // Create the deck
    return await prisma.deck.create({
      data: {
        title: data.title.trim(),
        tags: data.tags || [],
      },
    })
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error(`A deck with this identifier already exists`)
    }
    throw new Error(`Failed to create deck: ${error.message}`)
  }
}

// Delete a deck if it's empty
export async function deleteDeck(id) {
  try {
    // Check if the deck exists
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        slides: {
          select: { id: true },
        },
      },
    })

    if (!deck) {
      throw new Error(`Deck with ID ${id} not found in database`)
    }

    // Check if the deck has slides
    if (deck.slides.length > 0) {
      throw new Error(`Cannot delete deck with ID ${id} because it contains ${deck.slides.length} slides`)
    }

    // Delete the deck
    return await prisma.deck.delete({
      where: { id },
    })
  } catch (error) {
    throw new Error(`Failed to delete deck: ${error.message}`)
  }
}
