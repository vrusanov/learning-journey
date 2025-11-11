/**
 * Courses Grid component with React Query
 * Fetches courses from API with filters
 */

import { Stack, Text, Loader, Alert, Center } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { useCourses, FetchCoursesParams } from "@/shared/api"
import { CoursesGrid } from "./courses-grid"

interface CoursesGridQueryProps {
  filters?: FetchCoursesParams
  title?: string
  showRecommendationScore?: boolean
}

export function CoursesGridQuery({ filters, title, showRecommendationScore }: CoursesGridQueryProps) {
  const { data, isLoading, isError, error } = useCourses(filters)

  // Loading state
  if (isLoading) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            Loading courses...
          </Text>
        </Stack>
      </Center>
    )
  }

  // Error state
  if (isError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error loading courses" color="red">
        {error instanceof Error ? error.message : "Failed to load courses"}
      </Alert>
    )
  }

  // No data
  if (!data) {
    return null
  }

  // Use the existing CoursesGrid component
  return (
    <CoursesGrid
      courses={data.courses}
      title={title}
      showRecommendationScore={showRecommendationScore}
      allCourses={data.courses}
    />
  )
}
