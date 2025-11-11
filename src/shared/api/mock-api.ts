import { Course } from "../types/course"
import { User } from "../types/user"
import { MOCK_COURSES } from "../../entities/course/model/mock-courses"
import { MOCK_USERS } from "../../entities/user/model/mock-users"

const mockCourses = [...MOCK_COURSES]
const mockUsers = [...MOCK_USERS]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const shouldFail = () => Math.random() < 0.05

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export interface FetchCoursesParams {
  status?: Course["status"]
  category?: string
  search?: string
}

export interface FetchCoursesResponse {
  courses: Course[]
  total: number
}

export const fetchCourses = async (params?: FetchCoursesParams): Promise<FetchCoursesResponse> => {
  await delay(500)

  if (shouldFail()) {
    throw new ApiError("Failed to fetch courses", 500)
  }

  let filtered = [...mockCourses]

  if (params?.status) {
    filtered = filtered.filter((c: Course) => c.status === params.status)
  }

  if (params?.category) {
    filtered = filtered.filter((c: Course) => c.category === params.category)
  }

  if (params?.search) {
    const searchLower = params.search.toLowerCase()
    filtered = filtered.filter(
      (c: Course) => c.title.toLowerCase().includes(searchLower) || c.description.toLowerCase().includes(searchLower)
    )
  }

  return {
    courses: filtered,
    total: filtered.length,
  }
}

export const fetchCourseById = async (id: string): Promise<Course> => {
  await delay(300)

  if (shouldFail()) {
    throw new ApiError("Failed to fetch course", 500)
  }

  const course = mockCourses.find((c: Course) => c.id === id)

  if (!course) {
    throw new ApiError("Course not found", 404)
  }

  return course
}

export const updateCourseStatus = async (id: string, status: Course["status"]): Promise<Course> => {
  await delay(400)

  if (shouldFail()) {
    throw new ApiError("Failed to update course", 500)
  }

  const course = mockCourses.find((c: Course) => c.id === id)

  if (!course) {
    throw new ApiError("Course not found", 404)
  }
  course.status = status

  return course
}

export interface FetchLeaderboardParams {
  limit?: number
  offset?: number
}

export interface FetchLeaderboardResponse {
  users: User[]
  total: number
  hasMore: boolean
}

export const fetchLeaderboard = async (params?: FetchLeaderboardParams): Promise<FetchLeaderboardResponse> => {
  await delay(600)

  if (shouldFail()) {
    throw new ApiError("Failed to fetch leaderboard", 500)
  }

  const limit = params?.limit || 10
  const offset = params?.offset || 0
  const sorted = [...mockUsers].sort((a, b) => b.stats.xp - a.stats.xp)

  const users = sorted.slice(offset, offset + limit)
  const hasMore = offset + limit < sorted.length

  return {
    users,
    total: sorted.length,
    hasMore,
  }
}

export const fetchCurrentUser = async (): Promise<User> => {
  await delay(300)

  if (shouldFail()) {
    throw new ApiError("Failed to fetch user", 500)
  }

  return mockUsers[0]
}

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Pick<User, "name" | "avatar">>
): Promise<User> => {
  await delay(500)

  if (shouldFail()) {
    throw new ApiError("Failed to update profile", 500)
  }

  const user = mockUsers.find((u: User) => u.id === userId)

  if (!user) {
    throw new ApiError("User not found", 404)
  }
  Object.assign(user, updates)

  return user
}

export interface DashboardStats {
  totalCourses: number
  completedCourses: number
  ongoingCourses: number
  recommendedCourses: number
  totalXP: number
  currentLevel: number
  currentStreak: number
  achievements: number
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await delay(400)

  if (shouldFail()) {
    throw new ApiError("Failed to fetch stats", 500)
  }

  const currentUser = mockUsers[0]

  const stats: DashboardStats = {
    totalCourses: mockCourses.length,
    completedCourses: mockCourses.filter((c: Course) => c.status === "completed").length,
    ongoingCourses: mockCourses.filter((c: Course) => c.status === "ongoing").length,
    recommendedCourses: mockCourses.filter((c: Course) => c.status === "recommended").length,
    totalXP: currentUser.stats.xp,
    currentLevel: currentUser.stats.level,
    currentStreak: currentUser.stats.streak,
    achievements: 0,
  }

  return stats
}
