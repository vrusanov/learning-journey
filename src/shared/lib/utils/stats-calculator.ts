import type { Course } from "@/shared"

export interface UserStats {
  progress: number
  completed: number
  ongoing: number
  totalSessions: number
  totalMinutes: number
  avgAccuracy: number
  totalCourses: number
  xp: number
  level: number
}

export function calculateUserStats(courses: Course[]): UserStats {
  const completed = courses.filter((c) => c.status === "completed").length
  const ongoing = courses.filter((c) => c.status === "ongoing").length
  const totalCourses = completed + ongoing
  const progress = totalCourses > 0 ? Math.round((completed / totalCourses) * 100) : 0

  const totalSessions = courses.reduce((sum, c) => sum + c.sessions.length, 0)
  const totalMinutes = courses.reduce((sum, c) => sum + c.sessions.reduce((s, session) => s + session.minutes, 0), 0)

  const coursesWithPerformance = courses.filter((c) => c.status !== "recommended")
  const avgAccuracy =
    coursesWithPerformance.length > 0
      ? Math.round(
          coursesWithPerformance.reduce((sum, c) => sum + c.performance.accuracyPct, 0) / coursesWithPerformance.length
        )
      : 0

  const xp = completed * 100 + totalSessions * 10 + Math.floor(avgAccuracy * 5)

  const level = Math.floor(xp / 500) + 1

  return {
    progress,
    completed,
    ongoing,
    totalSessions,
    totalMinutes,
    avgAccuracy,
    totalCourses,
    xp,
    level,
  }
}
