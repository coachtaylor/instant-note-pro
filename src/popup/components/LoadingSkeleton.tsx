import React from "react"
import { motion } from "framer-motion"

interface LoadingSkeletonProps {
  count?: number
  className?: string
  isDarkMode?: boolean
}

export function LoadingSkeleton({ count = 3, className = "", isDarkMode = false }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {skeletons.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className={`border rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          {/* Text skeleton */}
          <div className="space-y-2 mb-3">
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`h-4 rounded ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.2
              }}
              className={`h-4 rounded ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              style={{ width: `${Math.random() * 30 + 40}%` }}
            />
          </div>

          {/* Meta info skeleton */}
          <div className="flex items-center gap-4 mb-3">
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.4
              }}
              className={`h-3 rounded w-20 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.6
              }}
              className={`h-3 rounded w-16 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-3">
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 0.8
              }}
              className={`h-6 rounded-full w-16 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 1.0
              }}
              className={`h-6 rounded-full w-20 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
          </div>

          {/* Actions skeleton */}
          <div className={`flex items-center justify-between pt-2 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className="flex gap-2">
              <motion.div
                animate={{
                  background: [
                    isDarkMode 
                      ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                      : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    isDarkMode 
                      ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                      : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.2
                }}
                className={`h-7 rounded w-16 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
              <motion.div
                animate={{
                  background: [
                    isDarkMode 
                      ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                      : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    isDarkMode 
                      ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                      : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.4
                }}
                className={`h-7 rounded w-16 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              />
            </div>
            <motion.div
              animate={{
                background: [
                  isDarkMode 
                    ? "linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)"
                    : "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  isDarkMode 
                    ? "linear-gradient(90deg, #4b5563 25%, #374151 50%, #4b5563 75%)"
                    : "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: 1.6
              }}
              className={`h-7 w-7 rounded ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
} 