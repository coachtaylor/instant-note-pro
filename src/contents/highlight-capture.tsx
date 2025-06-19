import type { PlasmoCSConfig } from "plasmo"
import { MessageService } from "../services/messages"

export const config: PlasmoCSConfig = {
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
  `
  return style
}

// Creates a tooltip element that's completely disconnected from the page's styles
const createTooltipElement = (x: number, y: number, text: string, onClick: () => void) => {
  const tooltip = document.createElement('div')
  tooltip.className = 'instant-note-pro-tooltip'
  
  // Adjust position to ensure tooltip stays within viewport
  const adjustedPosition = adjustTooltipPosition(x, y)
  
  tooltip.style.cssText = `
    position: fixed !important;
    left: ${adjustedPosition.x}px !important;
    top: ${adjustedPosition.y}px !important;
    transform: translate(-50%, -100%) !important;
    z-index: 2147483647 !important;
  `
  tooltip.innerHTML = `
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2 1 1 0 100-2 2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"></path>
    </svg>
    <span>Save Note (Cmd+1)</span>
  `
  
  tooltip.addEventListener('click', (e) => {
    e.stopPropagation()
    onClick()
  })
  
  return tooltip
}

// Adjust tooltip position to stay within viewport
const adjustTooltipPosition = (x: number, y: number) => {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  
  // Estimate tooltip dimensions (adjust based on actual tooltip size)
  const tooltipWidth = 200 // Approximate width
  const tooltipHeight = 40 // Approximate height
  
  let adjustedX = x
  let adjustedY = y
  
  // Adjust horizontal position to prevent overflow
  if (x - tooltipWidth / 2 < 10) {
    // Too close to left edge
    adjustedX = tooltipWidth / 2 + 10
  } else if (x + tooltipWidth / 2 > viewport.width - 10) {
    // Too close to right edge
    adjustedX = viewport.width - tooltipWidth / 2 - 10
  }
  
  // Adjust vertical position to prevent overflow
  if (y - tooltipHeight < 10) {
    // Too close to top edge - show below selection
    adjustedY = y + tooltipHeight + 10
  } else if (y > viewport.height - 10) {
    // Too close to bottom edge
    adjustedY = viewport.height - tooltipHeight - 10
  }
  
  return { x: adjustedX, y: adjustedY }
}

// Creates a success notification element
const createSuccessElement = () => {
  const notification = document.createElement('div')
  notification.className = 'instant-note-pro-success'
  notification.innerHTML = `
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>
    <span>Note saved successfully!</span>
  `
  
  return notification
}

// Main content script logic using vanilla JavaScript
console.log("HighlightCapture mounted")

// References to the DOM elements
let tooltipElement: HTMLDivElement | null = null
let successElement: HTMLDivElement | null = null
let successTimeout: NodeJS.Timeout | null = null
let mouseUpTimeout: NodeJS.Timeout | null = null

// Tracking references
let lastSelectionText = ""
let tooltipClicked = false
let currentSelectionText = ""

// Get selection details
const getSelectionDetails = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return null
  }

  const text = selection.toString().trim()
  if (!text) {
    return null
  }

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  // Don't show tooltip for selections in input fields
  const activeElement = document.activeElement as HTMLElement
  if (activeElement && (
    activeElement.tagName === 'INPUT' ||
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.contentEditable === 'true'
  )) {
    return null
  }

  return {
    text,
    rect: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    }
  }
}

// Show tooltip for current selection
const showTooltipForSelection = () => {
  // Remove existing tooltip if it exists
  if (tooltipElement && document.body.contains(tooltipElement)) {
    document.body.removeChild(tooltipElement)
    tooltipElement = null
  }
  
  const details = getSelectionDetails()
  
  if (details) {
    // If we just clicked the tooltip to save a note, don't immediately show it again
    if (tooltipClicked) {
      return
    }
    
    // Update the last selection ref
    lastSelectionText = details.text
    currentSelectionText = details.text
    
    // Create and add the tooltip
    const tooltipEl = createTooltipElement(
      details.rect.left + details.rect.width / 2,
      details.rect.top - 10,
      details.text,
      handleTooltipClick
    )
    
    document.body.appendChild(tooltipEl)
    tooltipElement = tooltipEl
  }
}

// Hide the tooltip
const hideTooltip = () => {
  if (tooltipElement && document.body.contains(tooltipElement)) {
    document.body.removeChild(tooltipElement)
    tooltipElement = null
  }
}

// Show success notification
const showSuccessNotification = () => {
  if (successElement && document.body.contains(successElement)) {
    document.body.removeChild(successElement)
  }
  
  const successEl = createSuccessElement()
  document.body.appendChild(successEl)
  successElement = successEl
  
  if (successTimeout) {
    clearTimeout(successTimeout)
  }
  
  successTimeout = setTimeout(() => {
    if (successElement && document.body.contains(successElement)) {
      successElement.classList.add('fade-out')
      setTimeout(() => {
        if (successElement && document.body.contains(successElement)) {
          document.body.removeChild(successElement)
          successElement = null
        }
      }, 300)
    }
  }, 2000)
}

// Save note to background
const saveNote = async (text: string) => {
  try {
    // Send message to background script
    const response = await MessageService.sendToBackground("SAVE_NOTE", {
      text,
      url: window.location.href,
      domain: window.location.hostname,
      title: document.title,
      timestamp: Date.now()
    })

    if (response && response.success) {
      showSuccessNotification()
      console.log("Note saved:", text)
    } else {
      console.error("Failed to save note:", response?.error)
    }
  } catch (error) {
    console.error("Error saving note:", error)
  }
}

// Handle tooltip click
const handleTooltipClick = () => {
  const text = currentSelectionText
  console.log("Tooltip clicked, saving:", text)
  
  if (text) {
    saveNote(text)
    hideTooltip()
    
    // Set the tooltip clicked flag to prevent immediately showing it again
    tooltipClicked = true
    
    // Clear the current selection
    window.getSelection()?.removeAllRanges()
  }
}

// Handler for mouse up event
const handleMouseUp = (event: MouseEvent) => {
  // Don't process if the click was on the tooltip itself
  if (tooltipElement && tooltipElement.contains(event.target as Node)) {
    return
  }
  
  // Clear any existing timeout
  if (mouseUpTimeout) {
    clearTimeout(mouseUpTimeout)
  }
  
  // Delay checking for selection to ensure it's complete
  mouseUpTimeout = setTimeout(() => {
    const details = getSelectionDetails()
    
    if (details) {
      // Reset the tooltip clicked flag
      tooltipClicked = false
      
      // Show the tooltip
      showTooltipForSelection()
    } else {
      // Only hide if we didn't just click the tooltip
      if (!tooltipClicked) {
        hideTooltip()
      }
    }
  }, 50) // Small delay to ensure selection is complete
}

// Handler for clicks outside the tooltip
const handleDocumentClick = (event: MouseEvent) => {
  // Don't hide if clicking on the tooltip
  if (tooltipElement && tooltipElement.contains(event.target as Node)) {
    return
  }
  
  // Check if we have a selection after the click
  const selection = window.getSelection()
  const text = selection?.toString().trim()
  
  // If no text is selected, hide the tooltip
  if (!text) {
    hideTooltip()
  }
}

// Handler for keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  // Check for Cmd+1 (Mac) or Ctrl+1 (Windows/Linux)
  if ((e.metaKey || e.ctrlKey) && e.key === '1') {
    const details = getSelectionDetails()
    
    if (details) {
      currentSelectionText = details.text
      saveNote(details.text)
      hideTooltip()
      tooltipClicked = true
      window.getSelection()?.removeAllRanges()
    }
  }
}

// Attach event listeners
document.addEventListener("mouseup", handleMouseUp)
document.addEventListener("click", handleDocumentClick)
document.addEventListener('keydown', handleKeyDown)

// Cleanup function (called when content script is unloaded)
const cleanup = () => {
  document.removeEventListener("mouseup", handleMouseUp)
  document.removeEventListener("click", handleDocumentClick)
  document.removeEventListener('keydown', handleKeyDown)
  
  if (successTimeout) {
    clearTimeout(successTimeout)
  }
  
  if (mouseUpTimeout) {
    clearTimeout(mouseUpTimeout)
  }
}

// Export cleanup for Plasmo
export { cleanup }