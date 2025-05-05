"use client"

import { useState, useEffect, useMemo } from "react"
import { fetchCards, createCard, deleteSlide } from "../app/actions"
import Card from "./card"
import { CreditCard } from "lucide-react"
import { determineCardType, generateRandomCardData, generateCardTitle } from "../app/utils"

export default function Slide({ slide, deckId, filteredTags, onTagClick, callback, showToast, cardsCache = [] }) {
  const [cards, setCards] = useState(cardsCache)
  const [loading, setLoading] = useState(cardsCache.length === 0)
  const [error, setError] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if slide exists before accessing its properties
  if (!slide) {
    return <div className="section">Error: Slide data is missing</div>
  }

  // Determine card type based on slide title
  const slideTitle = slide?.title || ""
  const cardType = determineCardType(slideTitle)

  // Extract all unique tags from this slide and its cards
  const tags = useMemo(() => {
    const tagSet = new Set()

    // Add slide tags
    if (slide?.tags && Array.isArray(slide.tags)) {
      slide.tags.forEach((tag) => tagSet.add(tag))
    }

    // Add card tags
    cards.forEach((card) => {
      if (card.tags && Array.isArray(card.tags)) {
        card.tags.forEach((tag) => tagSet.add(tag))
      }
    })

    return Array.from(tagSet)
  }, [slide, cards])

  // Fetch cards when slide changes if not provided in cache
  useEffect(() => {
    async function loadCards() {
      if (!slide?.id || !deckId || cardsCache.length > 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchCards(deckId, slide.id)

        if (data.error) {
          setError(data.error)
          console.error("Error loading cards:", data.error)
        } else {
          setCards(data)
          setError(null)
        }
      } catch (err) {
        console.error("Error in loadCards:", err)
        setError("Failed to load cards")
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [deckId, slide?.id, cardsCache])

  // Filter cards based on selected tags
  const filteredCards = useMemo(() => {
    if (filteredTags.length === 0) return cards

    return cards.filter((card) => {
      if (!card.tags || !Array.isArray(card.tags)) return false
      return filteredTags.some((tag) => card.tags.includes(tag))
    })
  }, [cards, filteredTags])

  // Update the handleCreateCard function to create cards without requiring a title
  const handleCreateCard = async () => {
    if (!slide?.id || !deckId) {
      showToast("Cannot create card: Invalid slide or deck ID", "error")
      return
    }

    try {
      setIsCreating(true)

      // Generate random data for the card
      const { tags, data, titleData } = generateRandomCardData(cardType)

      // Generate a title based on the card type and data
      let cardTitle = `Card ${cards.length + 1}`
      const generatedTitle = generateCardTitle(cardType, data, titleData)
      if (generatedTitle) {
        cardTitle = generatedTitle
      }

      const cardData = {
        title: cardTitle,
        type: cardType,
        tags,
        data,
      }

      const result = await createCard(deckId, slide.id, cardData)

      if (result.error) {
        showToast(result.error, "error")
      } else {
        // Update state first
        const data = await fetchCards(deckId, slide.id)
        if (!data.error) {
          setCards(data)
        }
        // Then show toast
        showToast("Card created successfully", "success")
      }
    } catch (error) {
      console.error("Error in handleCreateCard:", error)
      showToast("Failed to create card. Please try again.", "error")
    } finally {
      setIsCreating(false)
    }
  }

  // Update the handleDeleteSlide function to prevent double rendering
  const handleDeleteSlide = async () => {
    if (!slide?.id || !deckId) {
      showToast("Cannot delete slide: Invalid slide or deck ID", "error")
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteSlide(deckId, slide.id)

      if (result.error) {
        // Check for specific error messages
        if (result.error.includes("contains cards")) {
          showToast("Cannot delete slide that contains cards. Delete all cards first.", "error")
        } else {
          showToast(result.error, "error")
        }
        setIsDeleting(false)
      } else {
        // Call callback first to update state
        if (callback) callback()
        // Then show toast
        showToast("Slide deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error in handleDeleteSlide:", error)
      showToast("Failed to delete slide. Please try again.", "error")
      setIsDeleting(false)
    }
  }

  // Callback to refresh cards after changes
  const refreshCards = async () => {
    if (!slide?.id || !deckId) {
      showToast("Cannot refresh cards: Invalid slide or deck ID", "error")
      return
    }

    try {
      const data = await fetchCards(deckId, slide.id)
      if (data.error) {
        showToast("Failed to refresh cards: " + data.error, "error")
      } else {
        setCards(data)
      }
    } catch (err) {
      console.error("Error in refreshCards:", err)
      showToast("Failed to refresh cards", "error")
    }
  }

  const noCardsFoundMessage =
    filteredTags.length > 0 && filteredCards.length === 0 ? (
      <div className="no-results">
        <p>No cards found with the selected tags.</p>
        <p className="filter-hint">Click on the selected tag again to clear the filter.</p>
      </div>
    ) : filteredCards.length === 0 ? (
      <p>No cards found. Create your first card!</p>
    ) : null

  if (loading) {
    return <div className="section">Loading cards...</div>
  }

  return (
    <div className="section">
      <div className="section-header">
        <h4 className={`section-title deletable`} onClick={handleDeleteSlide} title="Click to delete slide">
          {slide.title}
        </h4>
        <div className="section-actions">
          <button
            onClick={handleCreateCard}
            disabled={isCreating}
            className="add-button"
            title={`Add new ${cardType.replace("-", " ")}`}
          >
            <CreditCard size={18} />
          </button>
        </div>
      </div>

      <div className="tags">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`tag ${filteredTags.includes(tag) ? "active" : ""}`}
            onClick={() => onTagClick(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>

      {error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={refreshCards}>Retry</button>
        </div>
      ) : (
        <div className="card-list">
          {noCardsFoundMessage}
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              deckId={deckId}
              slideId={slide.id}
              filteredTags={filteredTags}
              onTagClick={onTagClick}
              callback={refreshCards}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  )
}
