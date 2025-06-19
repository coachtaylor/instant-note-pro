import { useState, useEffect, useMemo } from "react"
import type { Note } from "../../services/storage"

export function useSearch(notes: Note[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes)

  // Filter notes based on search query
  const filterNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes
    }

    const query = searchQuery.toLowerCase()
    return notes.filter(note =>
      note.text.toLowerCase().includes(query) ||
      note.title.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      note.url.toLowerCase().includes(query) ||
      getDomain(note.url).toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  // Update filtered notes when filter changes
  useEffect(() => {
    setFilteredNotes(filterNotes)
  }, [filterNotes])

  // Update filtered notes when notes change
  useEffect(() => {
    setFilteredNotes(filterNotes)
  }, [notes, filterNotes])

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
  }

  // Get domain from URL
  function getDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  // Get search suggestions based on current query
  const getSearchSuggestions = (): string[] => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const suggestions = new Set<string>()

    notes.forEach(note => {
      // Add matching tags
      note.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag)
        }
      })

      // Add matching domains
      const domain = getDomain(note.url)
      if (domain.toLowerCase().includes(query)) {
        suggestions.add(domain)
      }
    })

    return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
  }

  // Get search stats
  const searchStats = useMemo(() => {
    const total = notes.length
    const filtered = filteredNotes.length
    const hasResults = filtered > 0
    const hasQuery = searchQuery.trim().length > 0

    return {
      total,
      filtered,
      hasResults,
      hasQuery,
      isFiltered: hasQuery && filtered !== total
    }
  }, [notes.length, filteredNotes.length, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredNotes,
    clearSearch,
    getSearchSuggestions,
    searchStats,
    getDomain
  }
} 