"use client"

import { useState, useEffect } from "react"
import { fetchDecks } from "./actions"
import Collection from "../components/collection"
import { useAlert } from "./error-alert"

export default function Page() {
  const [decks, setDecks] = useState([])
  const [filteredTags, setFilteredTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showAlert } = useAlert()

  // Fetch all decks on initial load
  useEffect(() => {
    async function loadDecks() {
      try {
        setLoading(true)
        const data = await fetchDecks()

        if (data.error) {
          setError(data.error)
          showAlert(data.error, "error")
        } else {
          setDecks(data)
          setError(null)
        }
      } catch (err) {
        console.error("Error in loadDecks:", err)
        setError("Failed to load decks")
        showAlert("Failed to load decks. Please check your API connection.", "error")
      } finally {
        setLoading(false)
      }
    }

    loadDecks()
  }, [showAlert])

  // Handle tag filtering
  const handleTagFilter = (tag) => {
    setFilteredTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  // Callback to refresh decks after changes
  const refreshDecks = async () => {
    try {
      setLoading(true)
      const data = await fetchDecks()

      if (data.error) {
        setError(data.error)
        showAlert(data.error, "error")
      } else {
        setDecks(data)
        setError(null)
      }
    } catch (err) {
      console.error("Error in refreshDecks:", err)
      setError("Failed to refresh decks")
      showAlert("Failed to refresh decks", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      {error ? (
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={refreshDecks} className="retry-button">
            Retry
          </button>
        </div>
      ) : (
        <Collection
          decks={decks}
          filteredTags={filteredTags}
          onTagClick={handleTagFilter}
          callback={refreshDecks}
          showToast={showAlert}
        />
      )}
    </div>
  )
}
