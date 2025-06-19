import React from "react"
import { Bookmark, Search, Plus, Globe } from "lucide-react"
import { motion } from "framer-motion"

interface EmptyStateProps {
  type: "no-notes" | "no-results" | "loading" | "error"
  searchQuery?: string
  error?: string
  onRetry?: () => void
  className?: string
  isDarkMode?: boolean
}

export function EmptyState({
  type,
  searchQuery = "",
  error,
  onRetry,
  className = "",
  isDarkMode = false
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "no-notes":
        return {
          icon: Bookmark,
          title: "No notes yet",
          description: "Start highlighting text on any webpage to save your first note.",
          action: "Select some text and press Ctrl+1 to save a highlight!",
          color: "text-blue-500"
        }
      
      case "no-results":
        return {
          icon: Search,
          title: "No results found",
          description: `No notes match "${searchQuery}"`,
          action: "Try a different search term or browse all your notes.",
          color: "text-gray-500"
        }
      
      case "loading":
        return {
          icon: Bookmark,
          title: "Loading notes...",
          description: "Please wait while we fetch your saved highlights.",
          action: "",
          color: "text-blue-500"
        }
      
      case "error":
        return {
          icon: Globe,
          title: "Something went wrong",
          description: error || "Failed to load your notes. Please try again.",
          action: onRetry ? "Click to retry" : "",
          color: "text-red-500"
        }
      
      default:
        return {
          icon: Bookmark,
          title: "No notes",
          description: "You haven't saved any highlights yet.",
          action: "",
          color: "text-gray-500"
        }
    }
  }

  const content = getContent()
  const IconComponent = content.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`mb-4 p-4 rounded-full ${content.color} ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      >
        <IconComponent className="w-8 h-8" />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-lg font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {content.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-sm mb-4 max-w-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        {content.description}
      </motion.p>

      {/* Action */}
      {content.action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {type === "error" && onRetry ? (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Retry
            </button>
          ) : (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              <Bookmark className="w-4 h-4" />
              {content.action}
            </div>
          )}
        </motion.div>
      )}

      {/* Additional help for no-notes state */}
      {type === "no-notes" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 p-4 rounded-lg border max-w-sm ${
            isDarkMode 
              ? 'bg-blue-900 border-blue-700' 
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <h4 className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-blue-200' : 'text-blue-900'
          }`}>
            How to get started:
          </h4>
          <ul className={`text-xs space-y-1 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-800'
          }`}>
            <li className="flex items-start gap-2">
              <span className={`mt-0.5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>1.</span>
              <span>Select any text on a webpage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`mt-0.5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>2.</span>
              <span>Click "Save Note" or press Ctrl+1</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`mt-0.5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>3.</span>
              <span>Your highlights will appear here</span>
            </li>
          </ul>
        </motion.div>
      )}

      {/* Search tips for no-results state */}
      {type === "no-results" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 p-4 rounded-lg border max-w-sm ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h4 className={`text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}>
            Search tips:
          </h4>
          <ul className={`text-xs space-y-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <li>• Try shorter, more general terms</li>
            <li>• Search by website domain</li>
            <li>• Use tags if you've added them</li>
            <li>• Check spelling and try synonyms</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
} 