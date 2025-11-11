export const CATEGORIES = ["Frontend", "Backend", "DevOps", "Data Science", "Mobile"] as const

export const COURSE_STATUSES = ["completed", "ongoing", "recommended", "locked"] as const

export const STATUS_COLORS = {
  completed: "green",
  ongoing: "blue",
  recommended: "violet",
  locked: "red",
} as const

export const ACHIEVEMENT_RARITIES = {
  common: { color: "gray", label: "Common" },
  rare: { color: "blue", label: "Rare" },
  epic: { color: "violet", label: "Epic" },
  legendary: { color: "yellow", label: "Legendary" },
} as const
