import { prisma } from "./prisma.js"

// Get all decks
export async function getAllDecks() {
  try {
    return await prisma.deck.findMany()
  } catch (error) {
    throw new Error(`Failed to get decks: ${error.message}`)
  }
}

// Get a deck by ID
export async function getDeckById(id) {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id },
    })

    if (!deck) {
      throw new Error(`Deck with ID ${id} not found`)
    }

    return deck
  } catch (error) {
    throw new Error(`Failed to get deck: ${error.message}`)
  }
}

// Create a new deck
export async function createDeck(data) {
  try {
    if (!data.title) {
      throw new Error("Deck title is required")
    }

    return await prisma.deck.create({
      data: {
        title: data.title,
        tags: data.tags || [],
      },
    })
  } catch (error) {
    throw new Error(`Failed to create deck: ${error.message}`)
  }
}

// Delete a deck if it's empty
export async function deleteDeck(id) {
  try {
    // Check if the deck exists
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: { slides: true },
    })

    if (!deck) {
      throw new Error(`Deck with ID ${id} not found`)
    }

    // Check if the deck has slides
    if (deck.slides.length > 0) {
      throw new Error(`Cannot delete deck with ID ${id} because it contains slides`)
    }

    // Delete the deck
    return await prisma.deck.delete({
      where: { id },
    })
  } catch (error) {
    throw new Error(`Failed to delete deck: ${error.message}`)
  }
}
