import React, { useState, useRef, useEffect } from "react"
import { Search, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  suggestions?: string[]
  placeholder?: string
  className?: string
  isDarkMode?: boolean
}

export function SearchBar({
  value,
  onChange,
  onClear,
  suggestions = [],
  placeholder = "Search notes...",
  className = "",
  isDarkMode = false
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onClear()
    inputRef.current?.focus()
  }

  return (
    <div className={className}>
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-[#0D2231] border-[#234E6D] text-gray-100 placeholder-gray-400 focus:border-[#61AFEF] focus:outline-none' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none'
          }`}
        />
        
        <AnimatePresence>
          {value && (
            <motion.button
              onClick={handleClear}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-[#234E6D]' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
} 