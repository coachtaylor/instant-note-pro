// Updates to storage.ts to support tags and advanced filtering
import { v4 as uuidv4 } from 'uuid';

// Enhanced Note type with tags and more metadata
export interface Note {
  id: string
  text: string
  url: string
  title: string
  timestamp: number
  tags?: string[]
  domain?: string
  context?: string
  favorite?: boolean
  folder?: string
  updatedAt?: number
}

export interface StorageResult<T> {
  success: boolean
  data?: T
  error?: string
}

export interface StorageStats {
  totalNotes: number
  totalSize: number
  lastSync: number
  totalTags: number
  tagCounts: Record<string, number>
  domainCounts: Record<string, number>
}

// Storage keys
const STORAGE_KEYS = {
  NOTES: 'instant_note_pro_notes',
  SETTINGS: 'instant_note_pro_settings',
  STATS: 'instant_note_pro_stats',
  TAGS: 'instant_note_pro_tags',
  FOLDERS: 'instant_note_pro_folders'
} as const

// Default settings with added support for tags and folders
const DEFAULT_SETTINGS = {
  maxNotes: 1000,
  maxNoteSize: 10000, // 10KB per note
  autoSync: true,
  backupEnabled: true,
  defaultTags: [],
  defaultFolder: ''
}

export interface StorageSettings {
  maxNotes: number
  maxNoteSize: number
  autoSync: boolean
  backupEnabled: boolean
  defaultTags: string[]
  defaultFolder: string
}

// Filter options for searching notes
export interface NoteFilterOptions {
  query?: string
  tags?: string[]
  domains?: string[]
  dateFrom?: number
  dateTo?: number
  favorite?: boolean
  folder?: string
  sortBy?: 'timestamp' | 'updatedAt' | 'title' | 'text'
  sortDirection?: 'asc' | 'desc'
}

class StorageService {
  private static instance: StorageService

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  /**
   * Save a new note with enhanced metadata
   */
  async saveNote(note: Omit<Note, 'id' | 'timestamp' | 'updatedAt' | 'domain'>): Promise<StorageResult<Note>> {
    try {
      // Validate note size
      const noteSize = JSON.stringify(note).length
      if (noteSize > DEFAULT_SETTINGS.maxNoteSize) {
        return {
          success: false,
          error: `Note too large (${noteSize} bytes). Maximum allowed: ${DEFAULT_SETTINGS.maxNoteSize} bytes`
        }
      }

      // Get existing notes
      const existingNotesResult = await this.getNotes()
      if (!existingNotesResult.success) {
        return {
          success: false,
          error: existingNotesResult.error
        }
      }

      const notes = existingNotesResult.data || []

      // Check storage quota
      if (notes.length >= DEFAULT_SETTINGS.maxNotes) {
        return {
          success: false,
          error: `Storage limit reached. Maximum ${DEFAULT_SETTINGS.maxNotes} notes allowed`
        }
      }

      // Get default settings for tags and folders
      const settingsResult = await this.getSettings()
      const settings = settingsResult.success ? settingsResult.data : DEFAULT_SETTINGS
      
      // Extract domain from URL
      let domain = ''
      try {
        domain = new URL(note.url).hostname.replace('www.', '')
      } catch (e) {
        // If URL parsing fails, just use empty domain
      }

      // Create new note with enhanced metadata
      const timestamp = Date.now()
      const newNote: Note = {
        ...note,
        id: uuidv4(), // Using UUID for more reliable IDs
        timestamp,
        updatedAt: timestamp,
        domain,
        tags: note.tags || settings.defaultTags || [],
        folder: note.folder || settings.defaultFolder || '',
        favorite: note.favorite || false
      }

      // Add to beginning of array (most recent first)
      notes.unshift(newNote)

      // Save to storage
      await chrome.storage.sync.set({ [STORAGE_KEYS.NOTES]: notes })

      // Update stats
      await this.updateStats(notes)

      return {
        success: true,
        data: newNote
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to save note: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get all notes
   */
  async getNotes(): Promise<StorageResult<Note[]>> {
    try {
      const result = await chrome.storage.sync.get([STORAGE_KEYS.NOTES])
      const notes = result[STORAGE_KEYS.NOTES] || []
      
      return {
        success: true,
        data: notes
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve notes: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get a single note by ID
   */
  async getNote(id: string): Promise<StorageResult<Note>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const note = notesResult.data?.find(n => n.id === id)
      if (!note) {
        return {
          success: false,
          error: `Note with ID ${id} not found`
        }
      }

      return {
        success: true,
        data: note
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve note: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Update an existing note
   */
  async updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'timestamp'>>): Promise<StorageResult<Note>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const noteIndex = notes.findIndex(n => n.id === id)

      if (noteIndex === -1) {
        return {
          success: false,
          error: `Note with ID ${id} not found`
        }
      }

      // Add updatedAt timestamp to updates
      const updatedNote = { 
        ...notes[noteIndex], 
        ...updates,
        updatedAt: Date.now()
      }

      // Validate updated note size
      const noteSize = JSON.stringify(updatedNote).length
      if (noteSize > DEFAULT_SETTINGS.maxNoteSize) {
        return {
          success: false,
          error: `Updated note too large (${noteSize} bytes). Maximum allowed: ${DEFAULT_SETTINGS.maxNoteSize} bytes`
        }
      }

      // Update the note
      notes[noteIndex] = updatedNote

      // Save to storage
      await chrome.storage.sync.set({ [STORAGE_KEYS.NOTES]: notes })

      // Update stats
      await this.updateStats(notes)

      return {
        success: true,
        data: updatedNote
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to update note: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Delete a note by ID
   */
  async deleteNote(id: string): Promise<StorageResult<boolean>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const filteredNotes = notes.filter(n => n.id !== id)

      if (filteredNotes.length === notes.length) {
        return {
          success: false,
          error: `Note with ID ${id} not found`
        }
      }

      // Save to storage
      await chrome.storage.sync.set({ [STORAGE_KEYS.NOTES]: filteredNotes })

      // Update stats
      await this.updateStats(filteredNotes)

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete note: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Delete all notes
   */
  async deleteAllNotes(): Promise<StorageResult<boolean>> {
    try {
      await chrome.storage.sync.remove([STORAGE_KEYS.NOTES])
      
      // Update stats
      await this.updateStats([])

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete all notes: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Advanced search with filtering options
   */
  async searchNotes(options: NoteFilterOptions = {}): Promise<StorageResult<Note[]>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      let notes = notesResult.data || []
      
      // Apply text search if query is provided
      if (options.query) {
        const query = options.query.toLowerCase().trim()
        if (query) {
          notes = notes.filter(note => 
            note.text.toLowerCase().includes(query) ||
            note.title.toLowerCase().includes(query) ||
            note.url.toLowerCase().includes(query) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
          )
        }
      }
      
      // Filter by tags
      if (options.tags && options.tags.length > 0) {
        notes = notes.filter(note => 
          note.tags && options.tags!.every(tag => note.tags.includes(tag))
        )
      }
      
      // Filter by domains
      if (options.domains && options.domains.length > 0) {
        notes = notes.filter(note => 
          note.domain && options.domains!.includes(note.domain)
        )
      }
      
      // Filter by date range
      if (options.dateFrom) {
        notes = notes.filter(note => note.timestamp >= options.dateFrom!)
      }
      
      if (options.dateTo) {
        notes = notes.filter(note => note.timestamp <= options.dateTo!)
      }
      
      // Filter by favorite status
      if (options.favorite !== undefined) {
        notes = notes.filter(note => note.favorite === options.favorite)
      }
      
      // Filter by folder
      if (options.folder) {
        notes = notes.filter(note => note.folder === options.folder)
      }
      
      // Sort results
      const sortBy = options.sortBy || 'timestamp'
      const sortDirection = options.sortDirection || 'desc'
      
      notes.sort((a, b) => {
        let valueA: any = a[sortBy as keyof Note]
        let valueB: any = b[sortBy as keyof Note]
        
        // Handle string comparison
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA)
        }
        
        // Handle number comparison
        return sortDirection === 'asc' 
          ? (valueA || 0) - (valueB || 0)
          : (valueB || 0) - (valueA || 0)
      })

      return {
        success: true,
        data: notes
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to search notes: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get all unique tags
   */
  async getTags(): Promise<StorageResult<string[]>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const tagSet = new Set<string>()
      
      notes.forEach(note => {
        if (note.tags && note.tags.length > 0) {
          note.tags.forEach(tag => tagSet.add(tag))
        }
      })
      
      const tags = Array.from(tagSet).sort()

      return {
        success: true,
        data: tags
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get tags: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get all unique domains
   */
  async getDomains(): Promise<StorageResult<string[]>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const domainSet = new Set<string>()
      
      notes.forEach(note => {
        if (note.domain) {
          domainSet.add(note.domain)
        }
      })
      
      const domains = Array.from(domainSet).sort()

      return {
        success: true,
        data: domains
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get domains: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get all folders
   */
  async getFolders(): Promise<StorageResult<string[]>> {
    try {
      const result = await chrome.storage.sync.get([STORAGE_KEYS.FOLDERS])
      const folders = result[STORAGE_KEYS.FOLDERS] || []
      
      return {
        success: true,
        data: folders
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get folders: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Add a new folder
   */
  async addFolder(name: string): Promise<StorageResult<string[]>> {
    try {
      const foldersResult = await this.getFolders()
      if (!foldersResult.success) {
        return {
          success: false,
          error: foldersResult.error
        }
      }

      const folders = foldersResult.data || []
      
      // Check if folder already exists
      if (folders.includes(name)) {
        return {
          success: true,
          data: folders
        }
      }
      
      // Add new folder
      const updatedFolders = [...folders, name].sort()
      
      // Save to storage
      await chrome.storage.sync.set({ [STORAGE_KEYS.FOLDERS]: updatedFolders })

      return {
        success: true,
        data: updatedFolders
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to add folder: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Rename a folder
   */
  async renameFolder(oldName: string, newName: string): Promise<StorageResult<boolean>> {
    try {
      // Update folder name in all notes
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const updatedNotes = notes.map(note => {
        if (note.folder === oldName) {
          return { ...note, folder: newName }
        }
        return note
      })
      
      // Update folders list
      const foldersResult = await this.getFolders()
      if (!foldersResult.success) {
        return {
          success: false,
          error: foldersResult.error
        }
      }

      let folders = foldersResult.data || []
      folders = folders.filter(f => f !== oldName)
      
      if (newName && !folders.includes(newName)) {
        folders.push(newName)
        folders.sort()
      }
      
      // Save updated data
      await chrome.storage.sync.set({ 
        [STORAGE_KEYS.NOTES]: updatedNotes,
        [STORAGE_KEYS.FOLDERS]: folders
      })
      
      // Update stats
      await this.updateStats(updatedNotes)

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to rename folder: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Delete a folder
   */
  async deleteFolder(name: string): Promise<StorageResult<boolean>> {
    try {
      // Remove folder from all notes
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const updatedNotes = notes.map(note => {
        if (note.folder === name) {
          const updatedNote = { ...note }
          delete updatedNote.folder
          return updatedNote
        }
        return note
      })
      
      // Update folders list
      const foldersResult = await this.getFolders()
      if (!foldersResult.success) {
        return {
          success: false,
          error: foldersResult.error
        }
      }

      let folders = foldersResult.data || []
      folders = folders.filter(f => f !== name)
      
      // Save updated data
      await chrome.storage.sync.set({ 
        [STORAGE_KEYS.NOTES]: updatedNotes,
        [STORAGE_KEYS.FOLDERS]: folders
      })
      
      // Update stats
      await this.updateStats(updatedNotes)

      return {
        success: true,
        data: true
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete folder: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Toggle favorite status of a note
   */
  async toggleFavorite(id: string): Promise<StorageResult<Note>> {
    try {
      const noteResult = await this.getNote(id)
      if (!noteResult.success) {
        return {
          success: false,
          error: noteResult.error
        }
      }

      const note = noteResult.data!
      const isFavorite = note.favorite || false
      
      return await this.updateNote(id, { favorite: !isFavorite })
    } catch (error) {
      return {
        success: false,
        error: `Failed to toggle favorite: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Export all notes as JSON
   */
  async exportNotes(): Promise<StorageResult<string>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const foldersResult = await this.getFolders()
      const folders = foldersResult.success ? foldersResult.data : []
      
      const exportData = {
        version: "2.0.0",
        exportedAt: new Date().toISOString(),
        notes: notes,
        folders: folders
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      return {
        success: true,
        data: jsonString
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to export notes: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Import notes from JSON
   */
  async importNotes(jsonString: string): Promise<StorageResult<{ 
    notesAdded: number, 
    foldersAdded: number 
  }>> {
    try {
      const importData = JSON.parse(jsonString)
      
      if (!importData.notes || !Array.isArray(importData.notes)) {
        return {
          success: false,
          error: "Invalid import format: notes array not found"
        }
      }

      // Handle notes import
      const existingNotesResult = await this.getNotes()
      if (!existingNotesResult.success) {
        return {
          success: false,
          error: existingNotesResult.error
        }
      }

      const existingNotes = existingNotesResult.data || []
      const existingIds = new Set(existingNotes.map(note => note.id))

      // Filter out notes that already exist
      const newNotes = importData.notes.filter((note: Note) => !existingIds.has(note.id))
      
      // Validate note sizes
      for (const note of newNotes) {
        const noteSize = JSON.stringify(note).length
        if (noteSize > DEFAULT_SETTINGS.maxNoteSize) {
          return {
            success: false,
            error: `Note too large (${noteSize} bytes). Maximum allowed: ${DEFAULT_SETTINGS.maxNoteSize} bytes`
          }
        }
      }

      // Check storage quota
      if (existingNotes.length + newNotes.length > DEFAULT_SETTINGS.maxNotes) {
        return {
          success: false,
          error: `Import would exceed storage limit. Maximum ${DEFAULT_SETTINGS.maxNotes} notes allowed`
        }
      }

      // Handle folders import
      let foldersAdded = 0
      if (importData.folders && Array.isArray(importData.folders)) {
        const existingFoldersResult = await this.getFolders()
        const existingFolders = existingFoldersResult.success ? existingFoldersResult.data || [] : []
        
        // Add new folders
        const newFolders = importData.folders.filter((folder: string) => 
          !existingFolders.includes(folder)
        )
        
        if (newFolders.length > 0) {
          const allFolders = [...existingFolders, ...newFolders].sort()
          await chrome.storage.sync.set({ [STORAGE_KEYS.FOLDERS]: allFolders })
          foldersAdded = newFolders.length
        }
      }

      // Add new notes to existing notes
      const updatedNotes = [...newNotes, ...existingNotes]

      // Save to storage
      await chrome.storage.sync.set({ [STORAGE_KEYS.NOTES]: updatedNotes })

      // Update stats
      await this.updateStats(updatedNotes)

      return {
        success: true,
        data: {
          notesAdded: newNotes.length,
          foldersAdded
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to import notes: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get storage statistics with enhanced tag and domain info
   */
  async getStats(): Promise<StorageResult<StorageStats>> {
    try {
      const notesResult = await this.getNotes()
      if (!notesResult.success) {
        return {
          success: false,
          error: notesResult.error
        }
      }

      const notes = notesResult.data || []
      const totalSize = JSON.stringify(notes).length
      
      // Calculate tag statistics
      const tagCounts: Record<string, number> = {}
      let totalTags = 0
      
      // Calculate domain statistics
      const domainCounts: Record<string, number> = {}
      
      notes.forEach(note => {
        // Count tags
        if (note.tags && note.tags.length > 0) {
          note.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
            totalTags++
          })
        }
        
        // Count domains
        if (note.domain) {
          domainCounts[note.domain] = (domainCounts[note.domain] || 0) + 1
        }
      })

      const stats: StorageStats = {
        totalNotes: notes.length,
        totalSize,
        lastSync: Date.now(),
        totalTags,
        tagCounts,
        domainCounts
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get stats: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Get storage settings
   */
  async getSettings(): Promise<StorageResult<StorageSettings>> {
    try {
      const result = await chrome.storage.sync.get([STORAGE_KEYS.SETTINGS])
      const settings = result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS
      
      return {
        success: true,
        data: settings
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to get settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Update storage settings
   */
  async updateSettings(settings: Partial<StorageSettings>): Promise<StorageResult<StorageSettings>> {
    try {
      const currentSettingsResult = await this.getSettings()
      if (!currentSettingsResult.success) {
        return {
          success: false,
          error: currentSettingsResult.error
        }
      }

      const currentSettings = currentSettingsResult.data || DEFAULT_SETTINGS
      const updatedSettings: StorageSettings = {
        ...currentSettings,
        ...settings
      }

      await chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: updatedSettings })

      return {
        success: true,
        data: updatedSettings
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to update settings: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Check storage quota
   */
  async checkQuota(): Promise<StorageResult<{ used: number; total: number; percentage: number }>> {
    try {
      const result = await chrome.storage.sync.getBytesInUse()
      const used = result || 0
      const total = 102400 // 100KB limit for sync storage
      const percentage = Math.round((used / total) * 100)

      return {
        success: true,
        data: { used, total, percentage }
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to check quota: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Update storage statistics
   */
  private async updateStats(notes: Note[]): Promise<void> {
    try {
      // Calculate tag statistics
      const tagCounts: Record<string, number> = {}
      let totalTags = 0
      
      // Calculate domain statistics
      const domainCounts: Record<string, number> = {}
      
      notes.forEach(note => {
        // Count tags
        if (note.tags && note.tags.length > 0) {
          note.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
            totalTags++
          })
        }
        
        // Count domains
        if (note.domain) {
          domainCounts[note.domain] = (domainCounts[note.domain] || 0) + 1
        }
      })
      
      const totalSize = JSON.stringify(notes).length
      const stats: StorageStats = {
        totalNotes: notes.length,
        totalSize,
        lastSync: Date.now(),
        totalTags,
        tagCounts,
        domainCounts
      }
      
      await chrome.storage.sync.set({ [STORAGE_KEYS.STATS]: stats })
    } catch (error) {
      console.error("Failed to update stats:", error)
    }
  }
}

// Create and export singleton instance
export const storageService = StorageService.getInstance()