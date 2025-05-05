import { prisma } from "./prisma.js"

// Get all slides in a deck
export async function getSlidesByDeckId(deckId) {
  try {
    // First check if the deck exists
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
    })

    if (!deck) {
      throw new Error(`Deck with ID ${deckId} not found`)
    }

    // Get all slides in the deck
    return await prisma.slide.findMany({
      where: { deckId },
    })
  } catch (error) {
    throw new Error(`Failed to get slides: ${error.message}`)
  }
}

// Create a new slide in a deck
export async function createSlide(deckId, data) {
  try {
    // First check if the deck exists
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
    })

    if (!deck) {
      throw new Error(`Deck with ID ${deckId} not found`)
    }

    if (!data.title) {
      throw new Error("Slide title is required")
    }

    // Create the slide
    return await prisma.slide.create({
      data: {
        title: data.title,
        tags: data.tags || [],
        deck: {
          connect: { id: deckId },
        },
      },
    })
  } catch (error) {
    throw new Error(`Failed to create slide: ${error.message}`)
  }
}

// Delete a slide if it's empty
export async function deleteSlide(slideId, deckId) {
  try {
    // Check if the slide exists and belongs to the deck
    const slide = await prisma.slide.findFirst({
      where: {
        id: slideId,
        deckId: deckId,
      },
      include: { cards: true },
    })

    if (!slide) {
      throw new Error(`Slide with ID ${slideId} not found in deck with ID ${deckId}`)
    }

    // Check if the slide has cards
    if (slide.cards.length > 0) {
      throw new Error(`Cannot delete slide with ID ${slideId} because it contains cards`)
    }

    // Delete the slide
    return await prisma.slide.delete({
      where: { id: slideId },
    })
  } catch (error) {
    throw new Error(`Failed to delete slide: ${error.message}`)
  }
}

// Get a slide by ID and verify it belongs to the specified deck
export async function getSlideById(slideId, deckId) {
  try {
    const slide = await prisma.slide.findFirst({
      where: {
        id: slideId,
        deckId: deckId,
      },
    })

    if (!slide) {
      throw new Error(`Slide with ID ${slideId} not found in deck with ID ${deckId}`)
    }

    return slide
  } catch (error) {
    throw new Error(`Failed to get slide: ${error.message}`)
  }
}
