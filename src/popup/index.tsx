import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotes } from "./hooks/useNotes"
import { useSearch } from "./hooks/useSearch"
import { SearchBar } from "./components/SearchBar"
import { NoteList } from "./components/NoteList"
import { EmptyState } from "./components/EmptyState"
import type { Note } from "../services/storage"
import { Download, Settings, Moon, Sun, X, Info, Upload, Trash2 } from "lucide-react"
import "../base.css"

function IndexPopup() {
  const {
    notes,
    loading,
    error,
    tags,
    domains,
    folders,
    statistics,
    deleteNote,
    updateNote,
    updateNoteTags,
    toggleFavorite,
    exportNotes,
    importNotes
  } = useNotes()

  const {
    searchQuery,
    setSearchQuery,
    filteredNotes,
    clearSearch,
    getSearchSuggestions
  } = useSearch(notes)

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  // Load dark mode preference from storage on mount
  useEffect(() => {
    const loadDarkModePreference = async () => {
      try {
        const result = await chrome.storage.sync.get(['instant_note_pro_dark_mode'])
        const savedDarkMode = result.instant_note_pro_dark_mode || false
        setIsDarkMode(savedDarkMode)
      } catch (error) {
        console.error('Failed to load dark mode preference:', error)
      }
    }
    
    loadDarkModePreference()
  }, [])

  // Dark mode toggle
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    try {
      await chrome.storage.sync.set({ instant_note_pro_dark_mode: newDarkMode })
    } catch (error) {
      console.error('Failed to save dark mode preference:', error)
    }
  }

  // Handler for viewing a note
  const handleViewNote = (note: Note) => {
    setSelectedNote(note)
    setShowNoteModal(true)
  }

  // Handler for closing note view
  const handleCloseNoteView = () => {
    setSelectedNote(null)
    setShowNoteModal(false)
  }

  // Handler for deleting a note
  const handleDeleteNote = async (id: string) => {
    await deleteNote(id)
    setSelectedNote(null)
    setShowNoteModal(false)
  }

  // Handler for exporting notes
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportNotes()
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement("a")
        a.href = url
        a.download = `instant-note-pro-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Handler for importing notes
  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    
    input.onchange = async (e: any) => {
      try {
        setImportError(null)
        
        const file = e.target.files[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = async (event) => {
          try {
            const jsonString = event.target?.result as string
            const result = await importNotes(jsonString)
            
            if (!result.success) {
              setImportError(result.error || "Failed to import notes")
            }
          } catch (err) {
            setImportError("Invalid file format")
          }
        }
        
        reader.readAsText(file)
      } catch (err) {
        setImportError("Failed to read file")
      }
    }
    
    input.click()
  }

  return (
    <motion.div 
      className={`min-w-[350px] max-w-[420px] min-h-[500px] p-4 ${
        isDarkMode ? 'dark' : ''
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <motion.h1 
          className="text-xl font-bold mb-4 tracking-tight flex items-center justify-between text-blue-700 dark:text-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span>Instant Note Pro</span>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md transition-colors ${
                isDarkMode ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.h1>

        {/* Stats panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Note Statistics</h3>
                  <button
                    onClick={() => setShowStats(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total notes</p>
                    <p className="text-lg font-semibold">{statistics?.totalNotes || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total tags</p>
                    <p className="text-lg font-semibold">{statistics?.totalTags || 0}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={clearSearch}
          suggestions={getSearchSuggestions()}
          placeholder="Search notes..."
          className="mb-4"
          isDarkMode={isDarkMode}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-red-500 dark:text-red-400">{error}</div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyState 
              type="no-notes"
              isDarkMode={isDarkMode}
            />
          ) : (
            <NoteList
              notes={filteredNotes}
              onView={handleViewNote}
              onDelete={handleDeleteNote}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Statistics"
            >
              <Info className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleImport}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Import notes"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting || filteredNotes.length === 0}
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export notes"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Import Error Toast */}
        <AnimatePresence>
          {importError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 left-4 right-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span>{importError}</span>
                <button
                  onClick={() => setImportError(null)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default IndexPopup