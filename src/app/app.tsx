import { MantineProvider, createTheme, Container, LoadingOverlay, Alert } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import { Header } from "@/widgets/header"
import { GamificationWidget } from "@/widgets/gamification"
import { CoursesGrid } from "@/widgets/courses-grid"
import { DashboardStats } from "@/widgets/dashboard"
import { SequenceGraph } from "@/widgets/sequence-graph"
import { FiltersBar } from "@/widgets/filters-bar"
import { Leaderboard } from "@/widgets/leaderboard"
import { useCourses } from "@/shared/api/queries/use-courses"
import { useLeaderboard } from "@/shared/api/queries/use-users"
import { useDashboardStats } from "@/shared/api/queries/use-stats"
import { useState, useMemo } from "react"
import { calculateUserStats } from "@/shared/lib"
import { MotionStack } from "@/shared/ui"
import { IconAlertCircle } from "@tabler/icons-react"
import classes from "./app.module.scss"

const theme = createTheme({
  primaryColor: "violet",
  defaultRadius: "md",
  fontFamily: "system-ui, -apple-system, sans-serif",
})

export function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useCourses({
    search: searchQuery || undefined,
  })

  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useLeaderboard({ limit: 10 })

  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats()

  const allCourses = useMemo(() => coursesData?.courses || [], [coursesData?.courses])

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
        return false
      }
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(course.status)) {
        return false
      }
      if (dateRange[0] && dateRange[1] && course.sessions.length > 0) {
        const hasSessionInRange = course.sessions.some((session) => {
          return session.startedAt >= dateRange[0]!.getTime() && session.startedAt <= dateRange[1]!.getTime()
        })
        if (!hasSessionInRange) return false
      }

      return true
    })
  }, [allCourses, selectedCategories, selectedStatuses, dateRange])

  const stats = useMemo(() => calculateUserStats(allCourses), [allCourses])

  const ongoingCourses = filteredCourses.filter((c) => c.status === "ongoing")
  const recommendedCourses = filteredCourses
    .filter((c) => c.status === "recommended")
    .sort((a, b) => (b.recommendedScore || 0) - (a.recommendedScore || 0))

  const isLoading = coursesLoading || leaderboardLoading || statsLoading
  const hasError = coursesError || leaderboardError || statsError

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Container size="xl" className={classes.container}>
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        {hasError && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error loading data" color="red" mb="md">
            {coursesError?.message || leaderboardError?.message || statsError?.message || "Failed to load data"}
          </Alert>
        )}

        <MotionStack
          className={classes.mainStack}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          <DashboardStats stats={stats} dashboardStats={dashboardStats} />
          <GamificationWidget />
          <Leaderboard users={leaderboardData?.users || []} />
          <FiltersBar
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            selectedStatuses={selectedStatuses}
            onStatusesChange={setSelectedStatuses}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <SequenceGraph courses={filteredCourses} />
          <CoursesGrid courses={ongoingCourses} title="Active Courses" allCourses={allCourses} />
          <CoursesGrid
            courses={recommendedCourses}
            title="Recommended for You"
            showRecommendationScore
            allCourses={allCourses}
          />
        </MotionStack>
      </Container>
    </MantineProvider>
  )
}
