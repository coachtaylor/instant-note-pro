// Message types for communication between extension components
export interface MessageTypes {
  SAVE_NOTE: {
    text: string
    url: string
    domain: string
    title: string
    timestamp: number
  }
  NOTE_SAVED: {
    note: any
  }
  GET_STATS: {}
  EXPORT_NOTES: {}
  IMPORT_NOTES: {
    jsonString: string
  }
  DELETE_NOTE: {
    id: string
  }
  UPDATE_NOTE: {
    id: string
    updates: any
  }
  SEARCH_NOTES: {
    query: string
  }
  GET_NOTES_BY_URL: {
    url: string
  }
  CLEAR_ALL_NOTES: {}
  UPDATE_SETTINGS: {
    settings: any
  }
  GET_SETTINGS: {}
  CHECK_QUOTA: {}
}

// Message sender utility
export class MessageService {
  /**
   * Send a message to the background script
   */
  static async sendToBackground<T extends keyof MessageTypes>(
    type: T,
    data?: MessageTypes[T]
  ): Promise<any> {
    try {
      return await chrome.runtime.sendMessage({ type, ...data })
    } catch (error) {
      console.error(`Failed to send message ${type}:`, error)
      throw error
    }
  }

  /**
   * Send a message to a specific tab
   */
  static async sendToTab<T extends keyof MessageTypes>(
    tabId: number,
    type: T,
    data?: MessageTypes[T]
  ): Promise<any> {
    try {
      return await chrome.tabs.sendMessage(tabId, { type, ...data })
    } catch (error) {
      console.error(`Failed to send message ${type} to tab ${tabId}:`, error)
      throw error
    }
  }

  /**
   * Send a message to all tabs
   */
  static async sendToAllTabs<T extends keyof MessageTypes>(
    type: T,
    data?: MessageTypes[T]
  ): Promise<void> {
    try {
      const tabs = await chrome.tabs.query({})
      const promises = tabs.map(tab => 
        tab.id ? this.sendToTab(tab.id, type, data) : Promise.resolve()
      )
      await Promise.allSettled(promises)
    } catch (error) {
      console.error(`Failed to send message ${type} to all tabs:`, error)
      throw error
    }
  }

  /**
   * Listen for messages
   */
  static addListener<T extends keyof MessageTypes>(
    type: T,
    handler: (data: MessageTypes[T], sender: chrome.runtime.MessageSender) => Promise<any> | any
  ): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === type) {
        try {
          const result = handler(message, sender)
          if (result instanceof Promise) {
            result.then(sendResponse).catch(error => {
              console.error(`Error in message handler for ${type}:`, error)
              sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
            })
            return true // Indicate async response
          } else {
            sendResponse(result)
          }
        } catch (error) {
          console.error(`Error in message handler for ${type}:`, error)
          sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
        }
      }
    })
  }

  /**
   * Remove message listener
   */
  static removeListener<T extends keyof MessageTypes>(
    type: T,
    handler: (data: MessageTypes[T], sender: chrome.runtime.MessageSender) => Promise<any> | any
  ): void {
    // Note: Chrome doesn't provide a direct way to remove specific listeners
    // This is a placeholder for future implementation if needed
    console.log(`Removing listener for ${type}`)
  }
}

// Convenience functions for common operations
export const messageUtils = {
  /**
   * Notify that a note was saved
   */
  async notifyNoteSaved(note: any): Promise<void> {
    await MessageService.sendToBackground('NOTE_SAVED', { note })
  },

  /**
   * Get storage statistics
   */
  async getStats(): Promise<any> {
    return await MessageService.sendToBackground('GET_STATS')
  },

  /**
   * Export all notes
   */
  async exportNotes(): Promise<any> {
    return await MessageService.sendToBackground('EXPORT_NOTES')
  },

  /**
   * Import notes from JSON
   */
  async importNotes(jsonString: string): Promise<any> {
    return await MessageService.sendToBackground('IMPORT_NOTES', { jsonString })
  },

  /**
   * Delete a note
   */
  async deleteNote(id: string): Promise<any> {
    return await MessageService.sendToBackground('DELETE_NOTE', { id })
  },

  /**
   * Update a note
   */
  async updateNote(id: string, updates: any): Promise<any> {
    return await MessageService.sendToBackground('UPDATE_NOTE', { id, updates })
  },

  /**
   * Search notes
   */
  async searchNotes(query: string): Promise<any> {
    return await MessageService.sendToBackground('SEARCH_NOTES', { query })
  },

  /**
   * Get notes by URL
   */
  async getNotesByUrl(url: string): Promise<any> {
    return await MessageService.sendToBackground('GET_NOTES_BY_URL', { url })
  },

  /**
   * Clear all notes
   */
  async clearAllNotes(): Promise<any> {
    return await MessageService.sendToBackground('CLEAR_ALL_NOTES')
  },

  /**
   * Update settings
   */
  async updateSettings(settings: any): Promise<any> {
    return await MessageService.sendToBackground('UPDATE_SETTINGS', { settings })
  },

  /**
   * Get settings
   */
  async getSettings(): Promise<any> {
    return await MessageService.sendToBackground('GET_SETTINGS')
  },

  /**
   * Check storage quota
   */
  async checkQuota(): Promise<any> {
    return await MessageService.sendToBackground('CHECK_QUOTA')
  }
} 