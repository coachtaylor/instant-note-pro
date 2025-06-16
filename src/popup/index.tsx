import { useState, useEffect } from "react"
import { Sparkles, Copy, ExternalLink, Trash2 } from "lucide-react"
import { Storage } from "@plasmohq/storage"
import { STORAGE_KEYS, LIMITS } from "~lib/constants"
import type { UsageData, Highlight } from "~lib/types"

import "~base.css"

function IndexPopup() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const storage = new Storage()

  useEffect(() => {
    loadData()
    
    // Listen for storage changes
    const unsubscribe = storage.watch({
      [STORAGE_KEYS.HIGHLIGHTS]: (h) => setHighlights(h?.newValue || []),
      [STORAGE_KEYS.USAGE]: (u) => setUsage(u?.newValue)
    })
    
    return () => unsubscribe()
  }, [])

  async function loadData() {
    const [usageData, highlightData] = await Promise.all([
      storage.get<UsageData>(STORAGE_KEYS.USAGE),
      storage.get<Highlight[]>(STORAGE_KEYS.HIGHLIGHTS)
    ])
    
    setUsage(usageData)
    setHighlights(highlightData || [])
  }

  async function deleteHighlight(id: string) {
    const updated = highlights.filter(h => h.id !== id)
    setHighlights(updated)
    await storage.set(STORAGE_KEYS.HIGHLIGHTS, updated)
  }

  async function copyHighlight(text: string) {
    await navigator.clipboard.writeText(text)
    // Show feedback (you could add a toast here)
  }

  const remainingHighlights = usage ? usage.highlights.limit - usage.highlights.used : 0
  const isFreeTier = usage?.tier === "free"

  return (
    <div className="w-[400px] h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold">Instant Note Pro AI</h1>
          </div>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="text-gray-500 hover:text-gray-700"
          >
            ⚙️
          </button>
        </div>
        
        {/* Usage Stats */}
        {usage && (
          <div className="flex items-center justify-between text-sm">
            <div>
              {usage.tier === "trial" ? (
                <span className="text-green-600 font-medium">
                  🎉 Trial: Unlimited for {LIMITS.TRIAL_DAYS} days
                </span>
              ) : (
                <span className="text-gray-600">
                  {usage.highlights.used}/{usage.highlights.limit} highlights today
                </span>
              )}
            </div>
            {isFreeTier && remainingHighlights <= 2 && (
              <button
                onClick={() => chrome.tabs.create({ url: "/tabs/pricing.html" })}
                className="text-blue-500 hover:underline text-xs font-medium"
              >
                Upgrade
              </button>
            )}
          </div>
        )}
      </div>

      {/* Shortcuts reminder */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>💡 Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Ctrl+1</kbd> to save highlights</span>
        </div>
      </div>

      {/* Highlights list */}
      <div className="flex-1 overflow-y-auto">
        {highlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No highlights yet!</p>
            <p className="text-sm text-gray-400">
              Select any text and press Ctrl+1 to save
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="p-3 hover:bg-gray-50 group">
                <p className="text-sm text-gray-800 line-clamp-3 mb-2">
                  {highlight.text}
                </p>
                <div className="flex items-center justify-between">
                  
                    href={highlight.url}
                    target="_blank"
                    className="text-xs text-gray-500 hover:text-blue-500 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {new URL(highlight.url).hostname}
                  </a>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyHighlight(highlight.text)}
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteHighlight(highlight.id)}
                      className="p-1 hover:bg-gray-200 rounded text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {isFreeTier && remainingHighlights === 0 && (
        <div className="p-3 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-800 text-center">
            Daily limit reached! <a 
              href="#" 
              onClick={() => chrome.tabs.create({ url: "/tabs/pricing.html" })}
              className="font-semibold underline"
            >
              Upgrade for unlimited
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default IndexPopup