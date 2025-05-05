"use client"

import { useState, useMemo } from "react"
import { deleteCard, updateCard } from "../app/actions"
import { X } from "lucide-react"
import { generateRandomCardData, generateCardTitle } from "../app/utils"

export default function Card({ card, deckId, slideId, filteredTags, onTagClick, callback, showToast }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)

  // Check if card exists before rendering
  if (!card) {
    return <div className="card card-error">Error: Card data is missing</div>
  }

  // Ensure tags are properly handled as arrays
  const cardTags = useMemo(() => {
    let tags = []
    if (card.tags) {
      if (Array.isArray(card.tags)) {
        tags = card.tags
      } else {
        try {
          tags = typeof card.tags === "string" ? JSON.parse(card.tags) : []
        } catch (e) {
          console.error("Error parsing tags:", e)
        }
      }
    }
    return tags
  }, [card?.tags])

  // Update the handleDeleteCard function to prevent double rendering
  const handleDeleteCard = async (e) => {
    // Stop event propagation to prevent triggering shuffle
    e.stopPropagation()

    if (!deckId || !slideId || !card.id) {
      showToast("Cannot delete card: Missing required IDs", "error")
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteCard(deckId, slideId, card.id)

      if (result.error) {
        showToast(result.error, "error")
        setIsDeleting(false)
      } else {
        // Call callback first to update state
        if (callback) callback()
        // Then show toast
        showToast("Card deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error in handleDeleteCard:", error)
      showToast("Failed to delete card. Please try again.", "error")
      setIsDeleting(false)
    }
  }

  // Update the handleShuffleCard function to prevent double rendering
  const handleShuffleCard = async () => {
    if (isShuffling || !deckId || !slideId || !card.id) {
      return
    }

    try {
      setIsShuffling(true)

      // Get the card type
      const type = card.type?.type || card.type || "string-list"

      // Generate random data for the card type
      const { tags, data, titleData } = generateRandomCardData(type)

      // Generate a new title based on the card type and data
      let newTitle = card.title || "Card"
      const generatedTitle = generateCardTitle(type, data, titleData)
      if (generatedTitle) {
        newTitle = generatedTitle
      }

      // Update the card with new data and title
      const result = await updateCard(deckId, slideId, card.id, {
        title: newTitle,
        tags,
        data,
      })

      if (result.error) {
        showToast(result.error, "error")
      } else {
        // Call callback first to update state
        if (callback) callback()
        // Then show toast
        showToast("Card shuffled successfully", "success")
      }
    } catch (error) {
      console.error("Error shuffling card:", error)
      showToast("Failed to shuffle card. Please try again.", "error")
    } finally {
      setIsShuffling(false)
    }
  }

  // Render different card content based on type
  const renderCardContent = () => {
    if (!card.type) return null

    const type = card.type?.type || card.type || "string-list"

    try {
      if (type === "foreign-word") {
        return (
          <div className="card-content">
            <p className="card-subtitle">{card.data?.pronunciation || ""}</p>
            <p>{card.data?.translation || ""}</p>
          </div>
        )
      } else if (type === "playing-card") {
        // Determine which symbol to display
        let symbol = "★"
        if (card.data?.symbol === "triangle") {
          symbol = "▲"
        }

        // Get the value and suit
        const value = card.data?.value
        const suit = card.data?.suit || ""

        return (
          <div className="numberContainer">
            <h2 className="number">
              {value}
              {suit}
            </h2>
          </div>
        )
      } else if (type === "string-list") {
        return (
          <div className="card-content">
            <ul className="list">
              {card.data &&
                Array.isArray(card.data) &&
                card.data.map((item, index) => (
                  <li key={index} className="listItem">
                    <span className="listNumber">{index + 1}.</span> {item}
                  </li>
                ))}
            </ul>
          </div>
        )
      }
    } catch (error) {
      console.error("Error rendering card content:", error)
      return (
        <div className="card-content error">
          <p>Error displaying card content</p>
        </div>
      )
    }

    return null
  }

  return (
    <div
      className="card"
      onClick={handleShuffleCard}
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <div className="card-header">
        <h3 className="card-title">{card.title || "Untitled Card"}</h3>
        {showDeleteButton && (
          <button onClick={handleDeleteCard} disabled={isDeleting} title="Delete card" className="card-delete-button">
            <X size={16} />
          </button>
        )}
      </div>

      {renderCardContent()}

      <div className="card-tags">
        {cardTags.map((tag) => (
          <span
            key={tag}
            className={`tag ${filteredTags?.includes(tag) ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation() // Prevent card shuffle when clicking on tag
              if (onTagClick) onTagClick(tag)
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
