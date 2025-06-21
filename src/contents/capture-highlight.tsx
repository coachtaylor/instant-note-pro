import type { PlasmoContentScript } from "plasmo"
import { useEffect, useState } from "react"
import { MessageService } from "../services/messages"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"]
}

// Create a unique ID for our styles to avoid conflicts
const STYLE_ID = "instant-note-pro-styles"

export const getStyle = () => {
  // First, check if style already exists and remove it to prevent duplicates
  const existingStyle = document.getElementById(STYLE_ID)
  if (existingStyle) {
    existingStyle.remove()
  }

  const style = document.createElement("style")
  style.id = STYLE_ID
  style.setAttribute("type", "text/css")
  
  // Using !important to override any conflicting styles on the page
  style.textContent = `
    .instant-note-pro-tooltip {
      all: initial !important;
      position: fixed !important;
      background: #4F46E5 !important;
      color: white !important;
      padding: 8px 16px !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
      z-index: 2147483647 !important; /* Highest possible z-index */
      pointer-events: auto !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      transition: all 0.2s ease !important;
      margin: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      line-height: normal !important;
      text-align: left !important;
      max-width: none !important;
      max-height: none !important;
      transform: translate(-50%, -100%) !important;
    }

    .instant-note-pro-tooltip:hover {
      background: #4338CA !important;
      transform: translate(-50%, calc(-100% - 2px)) !important;
    }
    
    .instant-note-pro-tooltip > svg {
      width: 16px !important;
      height: 16px !important;
      fill: currentColor !important;
      display: inline-block !important;
      flex-shrink: 0 !important;
      vertical-align: middle !important;
    }
    
    .instant-note-pro-tooltip > span {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
      font-size: 14px !important;
      color: white !important;
      font-weight: normal !important;
      line-height: normal !important;
      letter-spacing: normal !important;
      text-transform: none !important;
    }
    
    .instant-note-pro-success {
      all: initial !important;
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #10B981 !important;
      color: white !important;
      padding: 12px 20px !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
      z-index: 2147483647 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      animation: instant_note_pro_slide_in 0.3s ease-out !important;
      margin: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      line-height: normal !important;
      text-align: left !important;
    }
    
    .instant-note-pro-success > svg {
      width: 20px !important;
      height: 20px !important;
      fill: currentColor !important;
      display: inline-block !important;
      flex-shrink: 0 !important;
      vertical-align: middle !important;
    }
    
    .instant-note-pro-success > span {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
      font-size: 14px !important;
      color: white !important;
      font-weight: normal !important;
      line-height: normal !important;
    }
    
    @keyframes instant_note_pro_slide_in {
      from {
        transform: translateX(100%) !important;
        opacity: 0 !important;
      }
      to {
        transform: translateX(0) !important;
        opacity: 1 !important;
      }
    }
    
    @keyframes instant_note_pro_slide_out {
      from {
        transform: translateX(0) !important;
        opacity: 1 !important;
      }
      to {
        transform: translateX(100%) !important;
        opacity: 0 !important;
      }
    }
    
    .instant-note-pro-success.fade-out {
      animation: instant_note_pro_slide_out 0.3s ease-out forwards !important;
    }
    
    .instant-note-pro-error {
      all: initial !important;
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #EF4444 !important;
      color: white !important;
      padding: 12px 20px !important;
      border-radius: 6px !important;
      font-size: 14px !important;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
      z-index: 2147483647 !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      animation: instant_note_pro_slide_in 0.3s ease-out !important;
      margin: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      line-height: normal !important;
      text-align: left !important;
    }
    
    .instant-note-pro-error > svg {
      width: 20px !important;
      height: 20px !important;
      fill: currentColor !important;
      display: inline-block !important;
      flex-shrink: 0 !important;
      vertical-align: middle !important;
    }
    
    .instant-note-pro-error > span {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
      font-size: 14px !important;
      color: white !important;
      font-weight: normal !important;
      line-height: normal !important;
    }
    
    .instant-note-pro-error.fade-out {
      animation: instant_note_pro_slide_out 0.3s ease-out forwards !important;
    }
  `
  return style
}

export const getInlineAnchor = () => {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  return selection.getRangeAt(0);
}

const HighlightTooltip = () => {
  const [notification, setNotification] = useState<"success" | "error" | null>(null)
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleSave = async () => {
    const selection = window.getSelection();
    if (!selection) return; // Guard against null selection
    
    const text = selection.toString().trim();
    if (!text) return

    console.log("Saving note:", text.substring(0, 30) + "...")
    
    try {
      const response = await chrome.runtime.sendMessage({
        type: "SAVE_NOTE",
        text: text,
        url: window.location.href,
        domain: window.location.hostname,
        title: document.title,
        timestamp: Date.now()
      })

      if (response?.success) {
        setNotification("success")
        window.getSelection()?.removeAllRanges()
      } else {
        throw new Error(response?.error || "Unknown error")
      }
    } catch (error) {
      console.error("Failed to save note:", error)
      setNotification("error")
    }
  }
  
  return (
    <div
      className="instant-note-pro-tooltip"
      onClick={handleSave}
      style={{
        marginLeft: '10px' // Add some space from the selected text
      }}
    >
      <span>Save Note</span>
      {notification && (
        <div className={`instant-note-pro-${notification}`}>
          <span>
            {notification === "success" ? "Note Saved!" : "Note Not Saved"}
          </span>
        </div>
      )}
    </div>
  )
}

export default HighlightTooltip