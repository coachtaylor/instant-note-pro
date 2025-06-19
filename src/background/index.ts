import { storageService } from "../services/storage"

// Handle extension installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Instant Note Pro installed:", details.reason)
  
  if (details.reason === "install") {
    // First time installation
    await initializeExtension()
  } else if (details.reason === "update") {
    // Extension updated
    await handleUpdate(details.previousVersion || "unknown")
  }
})

// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
  console.log("Instant Note Pro started")
  await initializeExtension()
})

// Initialize extension on install/startup
async function initializeExtension() {
  try {
    // Initialize storage with default settings
    const settingsResult = await storageService.getSettings()
    if (!settingsResult.success) {
      console.error("Failed to initialize settings:", settingsResult.error)
    }
    
    // Set up context menu
    await setupContextMenu()
    
    console.log("Instant Note Pro initialized successfully")
  } catch (error) {
    console.error("Failed to initialize extension:", error)
  }
}

// Handle extension updates
async function handleUpdate(previousVersion: string) {
  console.log(`Instant Note Pro updated from ${previousVersion}`)
  
  // Perform any necessary data migrations
  await migrateData(previousVersion)
  
  // Update context menu
  await setupContextMenu()
}

// Set up context menu
async function setupContextMenu() {
  // Remove existing context menu items
  await chrome.contextMenus.removeAll()
  
  // Add context menu for text selection
  chrome.contextMenus.create({
    id: "save-highlight",
    title: "Save Highlight to Instant Note Pro",
    contexts: ["selection"],
    documentUrlPatterns: ["<all_urls>"]
  })
  
  // Add context menu for page actions
  chrome.contextMenus.create({
    id: "open-popup",
    title: "Open Instant Note Pro",
    contexts: ["action"]
  })
  
  chrome.contextMenus.create({
    id: "export-notes",
    title: "Export All Notes",
    contexts: ["action"]
  })
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return
  
  switch (info.menuItemId) {
    case "save-highlight":
      if (info.selectionText) {
        await handleSaveHighlight(info.selectionText, tab)
      }
      break
      
    case "open-popup":
      await openPopup()
      break
      
    case "export-notes":
      await exportNotes()
      break
  }
})

// Handle saving highlight from context menu
async function handleSaveHighlight(text: string, tab: chrome.tabs.Tab) {
  if (!text?.trim() || !tab.url) return
  
  try {
    const note = {
      text: text.trim(),
      url: tab.url,
      title: tab.title || "Unknown Page",
      context: ""
    }
    
    const result = await storageService.saveNote(note)
    if (result.success) {
      // Show notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon128.png",
        title: "Instant Note Pro",
        message: "Highlight saved successfully!"
      })
    } else {
      console.error("Failed to save highlight:", result.error)
    }
  } catch (error) {
    console.error("Error saving highlight:", error)
  }
}

// Open popup programmatically
async function openPopup() {
  try {
    await chrome.action.openPopup()
  } catch (error) {
    console.error("Failed to open popup:", error)
  }
}

// Export notes
async function exportNotes() {
  try {
    const result = await storageService.exportNotes()
    if (result.success && result.data) {
      // Create download
      const blob = new Blob([result.data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      
      await chrome.downloads.download({
        url: url,
        filename: `instant-note-pro-export-${new Date().toISOString().split('T')[0]}.json`,
        saveAs: true
      })
      
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error("Failed to export notes:", error)
  }
}

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "save-highlight":
      await handleKeyboardSaveHighlight()
      break
      
    case "summarize-page":
      await handleSummarizePage()
      break
  }
})

// Handle keyboard shortcut for saving highlight
async function handleKeyboardSaveHighlight() {
  try {
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return
    
    // Execute content script to get selection
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selection = window.getSelection()
        return selection?.toString().trim() || ""
      }
    })
    
    const selectedText = results[0]?.result
    if (selectedText) {
      await handleSaveHighlight(selectedText, tab)
    }
  } catch (error) {
    console.error("Failed to handle keyboard save:", error)
  }
}

// Handle page summarization (placeholder for future feature)
async function handleSummarizePage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return
    
    // TODO: Implement page summarization
    console.log("Page summarization feature coming soon!")
    
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/icon128.png",
      title: "Instant Note Pro",
      message: "Page summarization feature coming soon!"
    })
  } catch (error) {
    console.error("Failed to summarize page:", error)
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "SAVE_NOTE":
      handleSaveNoteFromContent(message, sender, sendResponse)
      break
      
    case "NOTE_SAVED":
      handleNoteSaved(message.note, sender)
      break
      
    case "GET_STATS":
      handleGetStats(sendResponse)
      break
      
    case "EXPORT_NOTES":
      handleExportNotes(sendResponse)
      break
      
    default:
      console.log("Unknown message type:", message.type)
  }
  
  // Return true to indicate async response
  return true
})

// Handle save note from content script
async function handleSaveNoteFromContent(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
  try {
    const note = {
      text: message.text,
      url: message.url,
      title: message.title,
      context: ""
    }
    
    const result = await storageService.saveNote(note)
    if (result.success) {
      // Show notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon128.png",
        title: "Instant Note Pro",
        message: "Highlight saved successfully!"
      })
      
      // Send success response
      sendResponse({ success: true, note: result.data })
    } else {
      console.error("Failed to save note:", result.error)
      sendResponse({ success: false, error: result.error })
    }
  } catch (error) {
    console.error("Error saving note:", error)
    sendResponse({ success: false, error: "Failed to save note" })
  }
}

// Handle note saved event
async function handleNoteSaved(note: any, sender: chrome.runtime.MessageSender) {
  try {
    // Update stats
    const statsResult = await storageService.getStats()
    if (statsResult.success) {
      console.log("Note saved, updated stats:", statsResult.data)
    }
    
    // Show notification if enabled (default to true for now)
    const settingsResult = await storageService.getSettings()
    const notificationEnabled = settingsResult.success && settingsResult.data ? true : true
    
    if (notificationEnabled) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon128.png",
        title: "Instant Note Pro",
        message: `Saved: "${note.text.substring(0, 50)}${note.text.length > 50 ? '...' : ''}"`
      })
    }
  } catch (error) {
    console.error("Failed to handle note saved:", error)
  }
}

// Handle get stats request
async function handleGetStats(sendResponse: (response: any) => void) {
  try {
    const statsResult = await storageService.getStats()
    const quotaResult = await storageService.checkQuota()
    
    sendResponse({
      stats: statsResult.success ? statsResult.data : null,
      quota: quotaResult.success ? quotaResult.data : null
    })
  } catch (error) {
    console.error("Failed to get stats:", error)
    sendResponse({ error: "Failed to get stats" })
  }
}

// Handle export notes request
async function handleExportNotes(sendResponse: (response: any) => void) {
  try {
    const result = await storageService.exportNotes()
    sendResponse(result)
  } catch (error) {
    console.error("Failed to export notes:", error)
    sendResponse({ success: false, error: "Failed to export notes" })
  }
}

// Data migration function
async function migrateData(previousVersion: string) {
  try {
    console.log(`Migrating data from version ${previousVersion}`)
    
    // Add migration logic here as needed
    // Example: if (previousVersion < "1.1.0") { ... }
    
  } catch (error) {
    console.error("Failed to migrate data:", error)
  }
}

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    console.log("Storage changed:", changes)
    
    // Handle specific storage changes
    if (changes.instant_note_pro_notes) {
      console.log("Notes updated")
    }
    
    if (changes.instant_note_pro_settings) {
      console.log("Settings updated")
    }
  }
})

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Inject content script if needed
    console.log("Tab updated:", tab.url)
  }
})

console.log("Instant Note Pro background service worker loaded") 