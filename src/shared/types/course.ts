export type CourseStatus = "completed" | "ongoing" | "recommended" | "locked"

export interface Session {
  id: string
  startedAt: number
  endedAt: number
  minutes: number
  completedTasks: number
  totalTasks: number
}

export interface PerformanceMetrics {
  accuracyPct: number
  pace: number
  totalTasksCompleted: number
  totalTasksAttempted: number
}

export interface Course {
  id: string
  title: string
  category: string
  status: CourseStatus
  sessions: Session[]
  performance: PerformanceMetrics
  prereqIds: string[]
  recommendedScore?: number
  recommendationReason?: string
  unlockedCourseIds?: string[]
  description: string
  totalProgress: number
}
