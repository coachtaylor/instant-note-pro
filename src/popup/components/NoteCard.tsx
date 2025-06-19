import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Eye, Trash2, Calendar, Globe, Tag } from "lucide-react"
import type { Note } from "../../services/storage"

interface NoteCardProps {
  note: Note
  onView: (note: Note) => void
  onDelete: (id: string) => void
  className?: string
  isDarkMode?: boolean
}

export function NoteCard({ note, onView, onDelete, className = "", isDarkMode = false }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Format date
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get domain from URL
  function getDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  // Truncate text
  function truncateText(text: string, maxLength: number = 120): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Handle delete with animation
  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(note.id)
  }

  return (
    <motion.div 
      className={`p-4 rounded-lg border transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-[#0D2231] border-[#234E6D] text-gray-100' 
          : 'bg-white border-gray-200 text-gray-900'
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3">
        <div className={`text-sm mb-2 line-clamp-3 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {note.text}
        </div>
        <div className={`text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {new Date(note.timestamp).toLocaleString()}
        </div>
      </div>
      
      <motion.div 
        className={`flex items-center justify-between pt-2 border-t ${
          isDarkMode ? 'border-[#234E6D]' : 'border-gray-100'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onView(note)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isDarkMode 
                ? 'text-[#61AFEF] hover:bg-[#234E6D]' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-3 h-3" />
            View
          </motion.button>
          
          <motion.a
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:bg-[#234E6D]' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-3 h-3" />
            Source
          </motion.a>
        </div>
        
        <motion.button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'text-red-400 hover:bg-[#234E6D]' 
              : 'text-red-500 hover:bg-red-50'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
} 