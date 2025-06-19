import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect, useRef } from "react"
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
  tooltip.style.cssText = `
    position: fixed !important;
    left: ${x}px !important;
    top: ${y}px !important;
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

const HighlightCapture = () => {
  console.log("HighlightCapture mounted")
  
  // References to the DOM elements
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const successRef = useRef<HTMLDivElement | null>(null)
  const successTimeoutRef = useRef<NodeJS.Timeout>()
  const mouseUpTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Tracking references
  const lastSelectionRef = useRef<string>("")
  const tooltipClickedRef = useRef<boolean>(false)
  const currentSelectionTextRef = useRef<string>("")
  
  // Inject the styles when the component mounts
  useEffect(() => {
    const style = getStyle()
    document.head.appendChild(style)
    
    return () => {
      if (style && document.head.contains(style)) {
        style.remove()
      }
    }
  }, [])
  
  // Clean up the tooltip when component unmounts
  useEffect(() => {
    return () => {
      if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
        document.body.removeChild(tooltipRef.current)
      }
      
      if (successRef.current && document.body.contains(successRef.current)) {
        document.body.removeChild(successRef.current)
      }
      
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      
      if (mouseUpTimeoutRef.current) {
        clearTimeout(mouseUpTimeoutRef.current)
      }
    }
  }, [])
  
  // Get selection details
  const getSelectionDetails = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim() || ""
    
    if (text && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      
      return {
        text,
        rect
      }
    }
    
    return null
  }
  
  // Show tooltip for current selection
  const showTooltipForSelection = () => {
    // Remove existing tooltip if it exists
    if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
      document.body.removeChild(tooltipRef.current)
      tooltipRef.current = null
    }
    
    const details = getSelectionDetails()
    
    if (details) {
      // If we just clicked the tooltip to save a note, don't immediately show it again
      if (tooltipClickedRef.current) {
        return
      }
      
      // Update the last selection ref
      lastSelectionRef.current = details.text
      currentSelectionTextRef.current = details.text
      
      // Create and add the tooltip
      const tooltipElement = createTooltipElement(
        details.rect.left + details.rect.width / 2,
        details.rect.top - 10,
        details.text,
        handleTooltipClick
      )
      
      document.body.appendChild(tooltipElement)
      tooltipRef.current = tooltipElement
    }
  }
  
  // Hide the tooltip
  const hideTooltip = () => {
    if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
      document.body.removeChild(tooltipRef.current)
      tooltipRef.current = null
    }
  }
  
  // Show success notification
  const showSuccessNotification = () => {
    if (successRef.current && document.body.contains(successRef.current)) {
      document.body.removeChild(successRef.current)
    }
    
    const successElement = createSuccessElement()
    document.body.appendChild(successElement)
    successRef.current = successElement
    
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }
    
    successTimeoutRef.current = setTimeout(() => {
      if (successRef.current && document.body.contains(successRef.current)) {
        successRef.current.classList.add('fade-out')
        setTimeout(() => {
          if (successRef.current && document.body.contains(successRef.current)) {
            document.body.removeChild(successRef.current)
            successRef.current = null
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
    const text = currentSelectionTextRef.current
    console.log("Tooltip clicked, saving:", text)
    
    if (text) {
      saveNote(text)
      hideTooltip()
      
      // Set the tooltip clicked flag to prevent immediately showing it again
      tooltipClickedRef.current = true
      
      // Clear the current selection
      window.getSelection()?.removeAllRanges()
    }
  }
  
  // Set up event listeners
  useEffect(() => {
    // Handler for mouse up event
    const handleMouseUp = (event: MouseEvent) => {
      // Don't process if the click was on the tooltip itself
      if (tooltipRef.current && tooltipRef.current.contains(event.target as Node)) {
        return
      }
      
      // Clear any existing timeout
      if (mouseUpTimeoutRef.current) {
        clearTimeout(mouseUpTimeoutRef.current)
      }
      
      // Delay checking for selection to ensure it's complete
      mouseUpTimeoutRef.current = setTimeout(() => {
        const details = getSelectionDetails()
        
        if (details) {
          // Reset the tooltip clicked flag
          tooltipClickedRef.current = false
          
          // Show the tooltip
          showTooltipForSelection()
        } else {
          // Only hide if we didn't just click the tooltip
          if (!tooltipClickedRef.current) {
            hideTooltip()
          }
        }
      }, 50) // Small delay to ensure selection is complete
    }
    
    // Handler for clicks outside the tooltip
    const handleDocumentClick = (event: MouseEvent) => {
      // Don't hide if clicking on the tooltip
      if (tooltipRef.current && tooltipRef.current.contains(event.target as Node)) {
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
          currentSelectionTextRef.current = details.text
          saveNote(details.text)
          hideTooltip()
          tooltipClickedRef.current = true
          window.getSelection()?.removeAllRanges()
        }
      }
    }
    
    // Attach event listeners
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("click", handleDocumentClick)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("click", handleDocumentClick)
      document.removeEventListener('keydown', handleKeyDown)
      
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      
      if (mouseUpTimeoutRef.current) {
        clearTimeout(mouseUpTimeoutRef.current)
      }
    }
  }, [])

  // We don't return any JSX elements because we're creating and appending elements directly to the DOM
  return null
}

export default HighlightCapture