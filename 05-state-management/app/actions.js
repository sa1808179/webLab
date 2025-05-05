"use server"

// Base API URL from environment variable
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api"

// Helper function to handle API responses
async function handleResponse(response, errorMessage) {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMsg = errorData.error || `${errorMessage}: ${response.status}`
      throw new Error(errorMsg)
    }
    return await response.json()
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error)
    throw error
  }
}

// Collection actions
export async function fetchDecks() {
  try {
    const response = await fetch(`${API_BASE}`, {
      credentials: "include",
      cache: "no-store",
    })

    return await handleResponse(response, "Failed to fetch decks")
  } catch (error) {
    console.error("Error fetching decks:", error)
    return { error: error.message || "Failed to fetch decks" }
  }
}

export async function createDeck(data) {
  try {
    if (!data.title || !data.title.trim()) {
      return { error: "Deck title is required" }
    }

    const response = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    return await handleResponse(response, "Failed to create deck")
  } catch (error) {
    console.error("Error creating deck:", error)
    return { error: error.message || "Failed to create deck" }
  }
}

export async function deleteDeck(deckId) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}`, {
      method: "DELETE",
      credentials: "include",
    })

    return await handleResponse(response, "Failed to delete deck")
  } catch (error) {
    console.error("Error deleting deck:", error)
    return { error: error.message || "Failed to delete deck" }
  }
}

// Deck actions
export async function fetchSlides(deckId) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}`, {
      credentials: "include",
      cache: "no-store",
    })

    return await handleResponse(response, "Failed to fetch slides")
  } catch (error) {
    console.error("Error fetching slides:", error)
    return { error: error.message || "Failed to fetch slides" }
  }
}

export async function createSlide(deckId, data) {
  try {
    if (!data.title || !data.title.trim()) {
      return { error: "Slide title is required" }
    }

    const response = await fetch(`${API_BASE}/${deckId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    return await handleResponse(response, "Failed to create slide")
  } catch (error) {
    console.error("Error creating slide:", error)
    return { error: error.message || "Failed to create slide" }
  }
}

export async function deleteSlide(deckId, slideId) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}/${slideId}`, {
      method: "DELETE",
      credentials: "include",
    })

    return await handleResponse(response, "Failed to delete slide")
  } catch (error) {
    console.error("Error deleting slide:", error)
    return { error: error.message || "Failed to delete slide" }
  }
}

// Slide actions
export async function fetchCards(deckId, slideId) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}/${slideId}`, {
      credentials: "include",
      cache: "no-store",
    })

    return await handleResponse(response, "Failed to fetch cards")
  } catch (error) {
    console.error("Error fetching cards:", error)
    return { error: error.message || "Failed to fetch cards" }
  }
}

export async function createCard(deckId, slideId, data) {
  try {
    if (!data.title || !data.title.trim()) {
      return { error: "Card title is required" }
    }

    if (!data.type) {
      return { error: "Card type is required" }
    }

    const response = await fetch(`${API_BASE}/${deckId}/${slideId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    return await handleResponse(response, "Failed to create card")
  } catch (error) {
    console.error("Error creating card:", error)
    return { error: error.message || "Failed to create card" }
  }
}

export async function updateCard(deckId, slideId, cardId, data) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}/${slideId}/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    return await handleResponse(response, "Failed to update card")
  } catch (error) {
    console.error("Error updating card:", error)
    return { error: error.message || "Failed to update card" }
  }
}

export async function deleteCard(deckId, slideId, cardId) {
  try {
    const response = await fetch(`${API_BASE}/${deckId}/${slideId}/${cardId}`, {
      method: "DELETE",
      credentials: "include",
    })

    return await handleResponse(response, "Failed to delete card")
  } catch (error) {
    console.error("Error deleting card:", error)
    return { error: error.message || "Failed to delete card" }
  }
}
