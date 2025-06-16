export interface Highlight {
    id: string
    text: string
    url: string
    title: string
    timestamp: number
    context?: string
    enhanced?: string
    tags?: string[]
  }
  
  export interface PageSummary {
    id: string
    url: string
    title: string
    summary: string
    keyPoints: string[]
    timestamp: number
    readingTime?: number
  }
  
  export type UserTier = "trial" | "free" | "plus" | "pro" | "lifetime"
  
  export interface UsageData {
    highlights: { used: number; limit: number }
    summaries: { used: number; limit: number }
    lastReset: string
    trialStartDate?: string
    tier: UserTier
    customerId?: string
  }
  
  export interface AIRequest {
    text: string
    action: "summarize" | "tweetify" | "explain" | "page_summary"
    tier: UserTier
    userApiKey?: string
  }