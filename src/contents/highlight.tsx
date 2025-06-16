import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"
import { STORAGE_KEYS, LIMITS } from "~lib/constants"
import type { Highlight, UsageData } from "~lib/types"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const storage = new Storage({ area: "local" })

// Listen for keyboard shortcuts
document.addEventListener("keydown", async (e) => {
  // Ctrl+1 or Cmd+1
  if ((e.ctrlKey || e.metaKey) && e.key === "1") {
    e.preventDefault()
    await captureHighlight()
  }
})

async function captureHighlight() {
  const selection = window.getSelection()
  const text = selection?.toString().trim()
  
  if (!text) {
    showToast("No text selected", "error")
    return
  }

  // Check usage limits
  const usage = await checkUsageLimits()
  if (!usage.canHighlight) {
    showUpgradePrompt()
    return
  }

  // Create highlight object
  const highlight: Highlight = {
    id: `hl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    url: window.location.href,
    title: document.title,
    timestamp: Date.now(),
    context: getTextContext(selection)
  }

  // Save to storage
  try {
    const highlights = await storage.get<Highlight[]>(STORAGE_KEYS.HIGHLIGHTS) || []
    highlights.unshift(highlight) // Add to beginning
    await storage.set(STORAGE_KEYS.HIGHLIGHTS, highlights)
    
    // Update usage
    await incrementUsage()
    
    // Show confirmation
    showToast("✨ Highlight saved!", "success")
    
    // Clear selection
    selection?.removeAllRanges()
  } catch (error) {
    console.error("Failed to save highlight:", error)
    showToast("Failed to save highlight", "error")
  }
}

async function checkUsageLimits(): Promise<{ canHighlight: boolean; usage: UsageData }> {
  let usage = await storage.get<UsageData>(STORAGE_KEYS.USAGE)
  
  // Initialize usage if not exists
  if (!usage) {
    usage = {
      highlights: { used: 0, limit: 999 },
      summaries: { used: 0, limit: 999 },
      lastReset: new Date().toDateString(),
      trialStartDate: new Date().toISOString(),
      tier: "trial"
    }
    await storage.set(STORAGE_KEYS.USAGE, usage)
  }
  
  // Check if we need to reset daily counts
  const today = new Date().toDateString()
  if (usage.lastReset !== today) {
    usage.highlights.used = 0
    usage.summaries.used = 0
    usage.lastReset = today
    await storage.set(STORAGE_KEYS.USAGE, usage)
  }
  
  // Check trial expiry
  if (usage.tier === "trial" && usage.trialStartDate) {
    const trialStart = new Date(usage.trialStartDate)
    const daysSince = Math.floor((Date.now() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSince >= LIMITS.TRIAL_DAYS) {
      // Convert to free tier
      usage.tier = "free"
      usage.highlights.limit = LIMITS.FREE.HIGHLIGHTS_PER_DAY
      usage.summaries.limit = LIMITS.FREE.SUMMARIES_PER_DAY
      await storage.set(STORAGE_KEYS.USAGE, usage)
    }
  }
  
  return {
    canHighlight: usage.highlights.used < usage.highlights.limit,
    usage
  }
}

async function incrementUsage() {
  const usage = await storage.get<UsageData>(STORAGE_KEYS.USAGE)
  if (usage) {
    usage.highlights.used++
    await storage.set(STORAGE_KEYS.USAGE, usage)
  }
}

function getTextContext(selection: Selection): string {
  if (!selection.rangeCount) return ""
  
  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer
  
  // Get the parent element
  let element = container.nodeType === Node.TEXT_NODE
    ? container.parentElement
    : container as Element
    
  // Try to find a meaningful parent (p, div, article, etc)
  while (element && element.tagName && ['SPAN', 'EM', 'STRONG', 'B', 'I'].includes(element.tagName)) {
    element = element.parentElement
  }
  
  return element?.textContent?.slice(0, 500) || ""
}

function showToast(message: string, type: "success" | "error") {
  // Remove existing toasts
  document.querySelectorAll('.highlight-toast').forEach(t => t.remove())
  
  const toast = document.createElement("div")
  toast.className = `highlight-toast highlight-toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === "success" ? "#10b981" : "#ef4444"};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
  `
  
  // Add animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)
  
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = "0"
    toast.style.transform = "translateX(100%)"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

function showUpgradePrompt() {
  const modal = document.createElement("div")
  modal.className = "highlight-upgrade-modal"
  modal.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-out;
    ">
      <div style="
        background: white;
        padding: 24px;
        border-radius: 12px;
        max-width: 400px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.2);
        animation: scaleIn 0.2s ease-out;
      ">
        <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">Daily Limit Reached</h3>
        <p style="margin: 0 0 16px 0; color: #666; line-height: 1.5;">
          You've used all 5 highlights for today. Upgrade to Plus for unlimited captures!
        </p>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.open('chrome-extension://${chrome.runtime.id}/tabs/pricing.html')" style="
            flex: 1;
            background: #3b82f6;
            color: white;
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
          ">Upgrade Now</button>
          <button onclick="this.closest('.highlight-upgrade-modal').remove()" style="
            padding: 10px 16px;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            background: white;
          ">Maybe Later</button>
        </div>
      </div>
    </div>
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    </style>
  `
  document.body.appendChild(modal)
}

// Initial setup
console.log("Instant Note Pro AI: Content script loaded ✓")