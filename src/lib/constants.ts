export const STORAGE_KEYS = {
    HIGHLIGHTS: "highlights",
    SUMMARIES: "summaries",
    USAGE: "usage",
    USER_API_KEY: "userApiKey",
    USER_TIER: "userTier",
    TRIAL_START: "trialStartDate"
  } as const
  
  export const LIMITS = {
    TRIAL_DAYS: 7,
    FREE: {
      HIGHLIGHTS_PER_DAY: 5,
      SUMMARIES_PER_DAY: 1
    },
    PLUS: {
      HIGHLIGHTS_PER_DAY: 999,
      SUMMARIES_PER_DAY: 10
    },
    PRO: {
      HIGHLIGHTS_PER_DAY: 999,
      SUMMARIES_PER_DAY: 999
    }
  } as const
  
  export const MODELS = {
    FREE: "claude-3-haiku-20240307",
    PAID: "claude-3-5-sonnet-20241022",
    PRO: "claude-3-5-sonnet-20241022" // Can upgrade to opus later
  } as const
  
  export const LIFETIME_DEALS = {
    TIER_1: { price: 39.99, limit: 100 },
    TIER_2: { price: 59.99, limit: 400 },
    TIER_3: { price: 79.99, limit: 500 },
    REGULAR: { price: 99.99, limit: null }
  } as const