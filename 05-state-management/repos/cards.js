import { prisma } from "./prisma.js"

// Get all cards in a slide
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

    // Get all cards in the slide
    return await prisma.card.findMany({
      where: { slideId },
      include: { type: true },
    })
  } catch (error) {
    throw new Error(`Failed to get cards: ${error.message}`)
  }
}

// Create a new card in a slide
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

    // Check if the card type exists
    if (!data.type) {
      throw new Error("Card type is required")
    }

    // Get the card type
    const cardType = await prisma.cardType.findFirst({
      where: { type: data.type },
    })

    if (!cardType) {
      throw new Error(`Card type ${data.type} not found`)
    }

    // Create the card
    return await prisma.card.create({
      data: {
        title: data.title,
        tags: data.tags || [],
        data: data.data,
        slide: {
          connect: { id: slideId },
        },
        type: {
          connect: { id: cardType.id },
        },
      },
      include: { type: true },
    })
  } catch (error) {
    throw new Error(`Failed to create card: ${error.message}`)
  }
}

// Delete a card
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
    })
  } catch (error) {
    throw new Error(`Failed to delete card: ${error.message}`)
  }
}

// Update a card
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
    })

    if (!card) {
      throw new Error(`Card with ID ${cardId} not found in slide with ID ${slideId} in deck with ID ${deckId}`)
    }

    // Update the card
    return await prisma.card.update({
      where: { id: cardId },
      data: {
        title: data.title !== undefined ? data.title : card.title,
        tags: data.tags !== undefined ? data.tags : card.tags,
        data: data.data !== undefined ? data.data : card.data,
      },
      include: { type: true },
    })
  } catch (error) {
    throw new Error(`Failed to update card: ${error.message}`)
  }
}
