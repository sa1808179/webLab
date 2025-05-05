import { prisma } from "./prisma.js"

// Get all cards in a slide with detailed type information
export async function getCardsBySlideId(slideId, deckId) {
  try {
    // First check if the slide exists and belongs to the deck
    const slide = await prisma.slide.findFirst({
      where: {
        id: slideId,
        deckId: deckId,
      },
    })

    if (!slide) {
      throw new Error(`Slide with ID ${slideId} not found in deck with ID ${deckId}`)
    }

    // Get all cards in the slide with type information
    return await prisma.card.findMany({
      where: { slideId },
      include: {
        type: {
          select: {
            id: true,
            type: true,
          },
        },
      },
      orderBy: {
        title: "asc",
      },
    })
  } catch (error) {
    throw new Error(`Failed to retrieve cards: ${error.message}`)
  }
}

// Create a new card in a slide with validation
export async function createCard(slideId, deckId, data) {
  try {
    // First check if the slide exists and belongs to the deck
    const slide = await prisma.slide.findFirst({
      where: {
        id: slideId,
        deckId: deckId,
      },
    })

    if (!slide) {
      throw new Error(`Slide with ID ${slideId} not found in deck with ID ${deckId}`)
    }

    // Validate card type
    if (!data.type || typeof data.type !== "string") {
      throw new Error("Card type is required and must be a string")
    }

    // Get the card type
    const cardType = await prisma.cardType.findFirst({
      where: { type: data.type },
    })

    if (!cardType) {
      throw new Error(`Card type "${data.type}" not found. Available types: string-list, playing-card, foreign-word`)
    }

    // Validate data based on card type
    if (!data.data) {
      throw new Error("Card data is required")
    }

    // Validate tags if provided
    if (data.tags && !Array.isArray(data.tags)) {
      throw new Error("Tags must be an array")
    }

    // Create the card
    return await prisma.card.create({
      data: {
        title: data.title || "Untitled Card",
        tags: data.tags || [],
        data: data.data,
        slide: {
          connect: { id: slideId },
        },
        type: {
          connect: { id: cardType.id },
        },
      },
      include: {
        type: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(`Failed to create card: ${error.message}`)
  }
}

// Delete a card with verification
export async function deleteCard(cardId, slideId, deckId) {
  try {
    // Check if the card exists and belongs to the slide in the deck
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        slide: {
          id: slideId,
          deckId: deckId,
        },
      },
    })

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found in slide with ID ${slideId} in deck with ID ${deckId}`)
    }

    // Delete the card
    return await prisma.card.delete({
      where: { id: cardId },
      include: {
        type: true,
      },
    })
  } catch (error) {
    throw new Error(`Failed to delete card: ${error.message}`)
  }
}

// Update a card with validation
export async function updateCard(cardId, slideId, deckId, data) {
  try {
    // Check if the card exists and belongs to the slide in the deck
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        slide: {
          id: slideId,
          deckId: deckId,
        },
      },
      include: {
        type: true,
      },
    })

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found in slide with ID ${slideId} in deck with ID ${deckId}`)
    }

    // Validate tags if provided
    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      throw new Error("Tags must be an array")
    }

    // Prepare update data
    const updateData = {
      title: data.title !== undefined ? data.title : card.title,
      tags: data.tags !== undefined ? data.tags : card.tags,
    }

    // Only update data if provided
    if (data.data !== undefined) {
      updateData.data = data.data
    }

    // Update the card
    return await prisma.card.update({
      where: { id: cardId },
      data: updateData,
      include: {
        type: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(`Failed to update card: ${error.message}`)
  }
}
