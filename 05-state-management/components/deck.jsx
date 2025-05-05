"use client"

import { useState, useEffect, useMemo } from "react"
import { fetchSlides, createSlide, deleteDeck } from "../app/actions"
import Slide from "./slide"
import { LayoutList } from "lucide-react"

export default function Deck({
  deck,
  filteredTags,
  onTagClick,
  callback,
  showToast,
  slidesCache = [],
  cardsCache = {},
}) {
  const [slides, setSlides] = useState(slidesCache)
  const [loading, setLoading] = useState(slidesCache.length === 0)
  const [error, setError] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if deck exists before accessing its properties
  if (!deck) {
    return <div className="section">Error: Deck data is missing</div>
  }

  // Extract all unique tags from this deck and its slides
  const tags = useMemo(() => {
    const tagSet = new Set()

    // Add deck tags
    if (deck?.tags && Array.isArray(deck.tags)) {
      deck.tags.forEach((tag) => tagSet.add(tag))
    }

    // Add slide tags
    if (slides && Array.isArray(slides)) {
      slides.forEach((slide) => {
        if (slide.tags && Array.isArray(slide.tags)) {
          slide.tags.forEach((tag) => tagSet.add(tag))
        }

        // Add card tags
        const cards = cardsCache[slide.id] || []
        cards.forEach((card) => {
          if (card.tags && Array.isArray(card.tags)) {
            card.tags.forEach((tag) => tagSet.add(tag))
          }
        })
      })
    }

    return Array.from(tagSet)
  }, [deck, slides, cardsCache])

  // Fetch slides when deck changes if not provided in cache
  useEffect(() => {
    async function loadSlides() {
      if (!deck?.id || slidesCache.length > 0) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await fetchSlides(deck.id)

        if (data.error) {
          setError(data.error)
          console.error("Error loading slides:", data.error)
        } else {
          setSlides(data)
          setError(null)
        }
      } catch (err) {
        console.error("Error in loadSlides:", err)
        setError("Failed to load slides")
      } finally {
        setLoading(false)
      }
    }

    loadSlides()
  }, [deck?.id, slidesCache])

  // Check if a slide should be visible based on filtered tags
  const shouldShowSlide = (slide) => {
    if (filteredTags.length === 0) return true

    // Check if slide has any of the filtered tags
    if (slide.tags && Array.isArray(slide.tags)) {
      if (filteredTags.some((tag) => slide.tags.includes(tag))) {
        return true
      }
    }

    // Check if any card in the slide has any of the filtered tags
    const cards = cardsCache[slide.id] || []
    for (const card of cards) {
      if (card.tags && Array.isArray(card.tags)) {
        if (filteredTags.some((tag) => card.tags.includes(tag))) {
          return true
        }
      }
    }

    return false
  }

  // Filter slides based on selected tags
  const filteredSlides = useMemo(() => {
    if (!slides) return []

    return slides.filter((slide) => shouldShowSlide(slide))
  }, [slides, filteredTags, cardsCache])

  // Handle creating a new slide
  const handleCreateSlide = async () => {
    if (!deck?.id) {
      showToast("Cannot create slide: Invalid deck ID", "error")
      return
    }

    try {
      setIsCreating(true)
      // Generate a default title
      const defaultTitle = `Slide ${slides.length + 1}`
      const result = await createSlide(deck.id, { title: defaultTitle, tags: [] })

      if (result.error) {
        showToast(result.error, "error")
      } else {
        // Update state first
        const data = await fetchSlides(deck.id)
        if (!data.error) {
          setSlides(data)
        }
        // Then show toast
        showToast("Slide created successfully", "success")
      }
    } catch (error) {
      console.error("Error in handleCreateSlide:", error)
      showToast("Failed to create slide. Please try again.", "error")
    } finally {
      setIsCreating(false)
    }
  }

  // Handle deleting the deck
  const handleDeleteDeck = async () => {
    if (!deck?.id) {
      showToast("Cannot delete deck: Invalid deck ID", "error")
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteDeck(deck.id)

      if (result.error) {
        // Check for specific error messages
        if (result.error.includes("contains slides")) {
          showToast("Cannot delete deck that contains slides. Delete all slides first.", "error")
        } else {
          showToast(result.error, "error")
        }
        setIsDeleting(false)
      } else {
        // Call callback first to update state
        if (callback) callback()
        // Then show toast
        showToast("Deck deleted successfully", "success")
      }
    } catch (error) {
      console.error("Error in handleDeleteDeck:", error)
      showToast("Failed to delete deck. Please try again.", "error")
      setIsDeleting(false)
    }
  }

  // Callback to refresh slides after changes
  const refreshSlides = async () => {
    if (!deck?.id) {
      showToast("Cannot refresh slides: Invalid deck ID", "error")
      return
    }

    try {
      const data = await fetchSlides(deck.id)
      if (data.error) {
        showToast("Failed to refresh slides: " + data.error, "error")
      } else {
        setSlides(data)
      }
    } catch (err) {
      console.error("Error in refreshSlides:", err)
      showToast("Failed to refresh slides", "error")
    }
  }

  if (loading) {
    return <div className="section">Loading slides...</div>
  }

  return (
    <div className="section">
      <div className="section-header">
        <h3 className={`section-title deletable`} onClick={handleDeleteDeck} title="Click to delete deck">
          {deck.title}
        </h3>
        <div className="section-actions">
          <button onClick={handleCreateSlide} disabled={isCreating} className="add-button" title="Add new slide">
            <LayoutList size={18} />
          </button>
        </div>
      </div>

      <div className="tags">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`tag ${filteredTags?.includes(tag) ? "active" : ""}`}
            onClick={() => onTagClick && onTagClick(tag)}
          >
            #{tag}
          </span>
        ))}
      </div>

      {error ? (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={refreshSlides}>Retry</button>
        </div>
      ) : (
        <div className="slide-list">
          {filteredTags.length > 0 && filteredSlides.length === 0 ? (
            <div className="no-results">
              <p>No slides found with the selected tags.</p>
              <p className="filter-hint">Click on the selected tag again to clear the filter.</p>
            </div>
          ) : filteredSlides.length === 0 ? (
            <p>No slides found. Create your first slide!</p>
          ) : (
            filteredSlides.map((slide) => (
              <Slide
                key={slide.id}
                slide={slide}
                deckId={deck.id}
                filteredTags={filteredTags}
                onTagClick={onTagClick}
                callback={refreshSlides}
                showToast={showToast}
                cardsCache={cardsCache[slide.id] || []}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
