import { MantineProvider, createTheme, Container, Title, Text } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import { GamificationWidget } from "@/widgets/gamification"
import { CoursesGrid } from "@/widgets/courses-grid"
import { DashboardStats } from "@/widgets/dashboard"
import { SequenceGraph } from "@/widgets/sequence-graph"
import { FiltersBar } from "@/widgets/filters-bar"
import { Leaderboard } from "@/widgets/leaderboard"
import { motion } from "framer-motion"
import { MOCK_COURSES } from "@/entities/course"
import { MOCK_USERS } from "@/entities/user"
import { useState, useMemo } from "react"
import { calculateUserStats } from "@/shared/lib"
import { MotionStack } from "@/shared/ui"
import classes from "./app.module.css"

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

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
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
  }, [searchQuery, selectedCategories, selectedStatuses, dateRange])

  const stats = useMemo(() => calculateUserStats(MOCK_COURSES), [])

  const ongoingCourses = filteredCourses.filter((c) => c.status === "ongoing")
  const recommendedCourses = filteredCourses
    .filter((c) => c.status === "recommended")
    .sort((a, b) => (b.recommendedScore || 0) - (a.recommendedScore || 0))

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Container size="xl" className={classes.container}>
        <MotionStack
          className={classes.mainStack}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Title order={1} mb="xs" className={classes.title}>
              Learning Journey
            </Title>
            <Text c="dimmed" className={classes.subtitle}>
              {stats.completed} completed · {stats.ongoing} in progress · {recommendedCourses.length} recommended
            </Text>
          </motion.div>

          <DashboardStats stats={stats} />
          <GamificationWidget />
          <Leaderboard users={MOCK_USERS} />
          <FiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            selectedStatuses={selectedStatuses}
            onStatusesChange={setSelectedStatuses}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <SequenceGraph courses={filteredCourses} />
          <CoursesGrid courses={ongoingCourses} title="Active Courses" allCourses={MOCK_COURSES} />
          <CoursesGrid
            courses={recommendedCourses}
            title="Recommended for You"
            showRecommendationScore
            allCourses={MOCK_COURSES}
          />
        </MotionStack>
      </Container>
    </MantineProvider>
  )
}
