import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Note } from "../../services/storage"
import { NoteCard } from "./NoteCard"
import { EmptyState } from "./EmptyState"
import { LoadingSkeleton } from "./LoadingSkeleton"
import { CheckSquare, Square, Trash2, Download } from "lucide-react"

interface NoteListProps {
  notes: Note[]
  loading?: boolean
  error?: string | null
  searchQuery?: string
  onView: (note: Note) => void
  onDelete: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onBulkExport?: (notes: Note[]) => void
  className?: string
  isDarkMode?: boolean
}

export function NoteList({
  notes,
  loading = false,
  error = null,
  searchQuery = "",
  onView,
  onDelete,
  onBulkDelete,
  onBulkExport,
  className = "",
  isDarkMode = false
}: NoteListProps) {
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
  const [isBulkMode, setIsBulkMode] = useState(false)

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode)
    if (isBulkMode) {
      setSelectedNotes(new Set())
    }
  }

  const toggleNoteSelection = (noteId: string) => {
    const newSelected = new Set(selectedNotes)
    if (newSelected.has(noteId)) {
      newSelected.delete(noteId)
    } else {
      newSelected.add(noteId)
    }
    setSelectedNotes(newSelected)
  }

  const selectAll = () => {
    setSelectedNotes(new Set(notes.map(note => note.id)))
  }

  const deselectAll = () => {
    setSelectedNotes(new Set())
  }

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedNotes.size > 0) {
      onBulkDelete(Array.from(selectedNotes))
      setSelectedNotes(new Set())
      setIsBulkMode(false)
    }
  }

  const handleBulkExport = () => {
    if (onBulkExport && selectedNotes.size > 0) {
      const selectedNoteObjects = notes.filter(note => selectedNotes.has(note.id))
      onBulkExport(selectedNoteObjects)
    }
  }

  if (loading) {
    return <LoadingSkeleton count={3} isDarkMode={isDarkMode} />
  }
  
  if (error) {
    return <EmptyState type="error" error={error} isDarkMode={isDarkMode} />
  }
  
  if (!notes.length) {
    if (searchQuery.trim()) {
      return <EmptyState type="no-results" searchQuery={searchQuery} isDarkMode={isDarkMode} />
    }
    return <EmptyState type="no-notes" isDarkMode={isDarkMode} />
  }

  return (
    <div className={className}>
      {/* Bulk Selection Controls */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleBulkMode}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isBulkMode ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {isBulkMode ? 'Exit Selection' : 'Select Multiple'}
          </motion.button>
          
          {isBulkMode && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={selectAll}
                className={`text-xs underline ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Select All
              </button>
              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>|</span>
              <button
                onClick={deselectAll}
                className={`text-xs underline ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                Clear
              </button>
              {selectedNotes.size > 0 && (
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({selectedNotes.size} selected)
                </span>
              )}
            </motion.div>
          )}
        </div>

        {isBulkMode && selectedNotes.size > 0 && (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.button
              onClick={handleBulkExport}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-3 h-3" />
              Export
            </motion.button>
            <motion.button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1
            }
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0, 
                y: -20, 
                scale: 0.95,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.05
              }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
              }}
              className={`relative ${isBulkMode ? 'pl-8' : ''}`}
            >
              {isBulkMode && (
                <motion.div
                  className="absolute left-0 top-4 z-10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedNotes.has(note.id)}
                    onChange={() => toggleNoteSelection(note.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </motion.div>
              )}
              <NoteCard
                note={note}
                onView={onView}
                onDelete={onDelete}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 