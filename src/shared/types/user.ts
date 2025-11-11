export interface User {
  id: string
  name: string
  avatar?: string
  stats: {
    completed: number
    ongoing: number
    totalMinutes: number
    avgAccuracy: number
    xp: number
    level: number
    streak: number
  }
  isFriend: boolean
  isCurrentUser?: boolean
}
