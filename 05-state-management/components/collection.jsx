"use client"

import { useState, useEffect, useMemo } from "react"
import { createDeck, fetchSlides, fetchCards } from "../app/actions"
import Deck from "./deck"
import { Filter, LayoutGridIcon as LayoutColumns } from "lucide-react"

export default function Collection({ decks, filteredTags, onTagClick, callback, showToast }) {
  const [isCreating, setIsCreating] = useState(false)
  const [slidesCache, setSlidesCache] = useState({})
  const [cardsCache, setCardsCache] = useState({})
  const [loading, setLoading] = useState(false)

  // Extract all unique tags from decks, slides, and cards
  const allTags = useMemo(() => {
    const tagSet = new Set()

    // Add deck tags
    decks.forEach((deck) => {
      if (deck.tags && Array.isArray(deck.tags)) {
        deck.tags.forEach((tag) => tagSet.add(tag))
      }

      // Add slide tags from cache
      const slides = slidesCache[deck.id] || []
      slides.forEach((slide) => {
        if (slide.tags && Array.isArray(slide.tags)) {
          slide.tags.forEach((tag) => tagSet.add(tag))
        }

        // Add card tags from cache
        const cards = cardsCache[slide.id] || []
        cards.forEach((card) => {
          if (card.tags && Array.isArray(card.tags)) {
            card.tags.forEach((tag) => tagSet.add(tag))
          }
        })
      })
    })

    return Array.from(tagSet)
  }, [decks, slidesCache, cardsCache])

  // Load all slides and cards for tag filtering
  useEffect(() => {
    async function loadAllData() {
      if (decks.length === 0) return

      setLoading(true)
      const newSlidesCache = { ...slidesCache }
      const newCardsCache = { ...cardsCache }

      // Load slides for each deck
      for (const deck of decks) {
        if (!newSlidesCache[deck.id]) {
          try {
            const slides = await fetchSlides(deck.id)
            if (!slides.error) {
              newSlidesCache[deck.id] = slides

              // Load cards for each slide
              for (const slide of slides) {
                if (!newCardsCache[slide.id]) {
                  try {
                    const cards = await fetchCards(deck.id, slide.id)
                    if (!cards.error) {
                      newCardsCache[slide.id] = cards
                    }
                  } catch (err) {
                    console.error(`Error loading cards for slide ${slide.id}:`, err)
                  }
                }
              }
            }
          } catch (err) {
            console.error(`Error loading slides for deck ${deck.id}:`, err)
          }
        }
      }

      setSlidesCache(newSlidesCache)
      setCardsCache(newCardsCache)
      setLoading(false)
    }

    loadAllData()
  }, [decks])

  // Check if a deck should be visible based on filtered tags
  const shouldShowDeck = (deck) => {
    if (filteredTags.length === 0) return true

    // Check if deck has any of the filtered tags
    if (deck.tags && Array.isArray(deck.tags)) {
      if (filteredTags.some((tag) => deck.tags.includes(tag))) {
        return true
      }
    }

    // Check if any slide in the deck has any of the filtered tags
    const slides = slidesCache[deck.id] || []
    for (const slide of slides) {
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
    }

    return false
  }

  // Filter decks based on selected tags
  const filteredDecks = useMemo(() => {
    if (filteredTags.length === 0) return decks
    return decks.filter((deck) => shouldShowDeck(deck))
  }, [decks, filteredTags, slidesCache, cardsCache])

  // Handle creating a new deck
  const handleCreateDeck = async () => {
    try {
      setIsCreating(true)
      // Generate a default title
      const defaultTitle = `Deck ${decks.length + 1}`
      const result = await createDeck({ title: defaultTitle, tags: [] })

      if (result.error) {
        showToast(result.error, "error")
      } else {
        // Call callback first to update state
        if (callback) callback()
        // Then show toast
        showToast("Deck created successfully", "success")
      }
    } catch (error) {
      console.error("Error in handleCreateDeck:", error)
      showToast("Failed to create deck. Please try again.", "error")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <header className="header">
        <div className="logo">
          <Filter size={20} />
          <h1>Flashcards Collection</h1>
        </div>

        <div className="tags">
          {allTags.map((tag) => (
            <span
              key={tag}
              className={`tag ${filteredTags.includes(tag) ? "active" : ""}`}
              onClick={() => onTagClick(tag)}
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <main className="main">
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Decks</h2>
            <button onClick={handleCreateDeck} disabled={isCreating} className="add-button" title="Add new deck">
              <LayoutColumns size={18} />
            </button>
          </div>

          <div className="deck-list">
            {loading ? (
              <p>Loading content...</p>
            ) : filteredDecks.length === 0 ? (
              <div className="no-results">
                <p>No decks found with the selected tags.</p>
                <p className="filter-hint">Click on the selected tag again to clear the filter.</p>
              </div>
            ) : (
              filteredDecks.map((deck) => (
                <Deck
                  key={deck.id}
                  deck={deck}
                  filteredTags={filteredTags}
                  onTagClick={onTagClick}
                  callback={callback}
                  showToast={showToast}
                  slidesCache={slidesCache[deck.id] || []}
                  cardsCache={cardsCache}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  )
}
