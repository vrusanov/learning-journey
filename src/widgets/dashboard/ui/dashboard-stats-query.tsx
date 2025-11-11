/**
 * Dashboard Stats component with React Query
 * Fetches stats from API instead of using props
 */

import { Group, Stack, Text, RingProgress, Grid, Loader, Alert } from "@mantine/core"
import { IconBook, IconClock, IconTrendingUp, IconAlertCircle } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { MotionCard } from "@/shared/ui"
import { useCounterAnimation } from "@/shared/lib"
import { useDashboardStats } from "@/shared/api"
import classes from "./dashboard-stats.module.css"

export function DashboardStatsQuery() {
  const { data: stats, isLoading, isError, error } = useDashboardStats()
  const [progress, setProgress] = useState(0)

  // Calculate progress percentage
  const progressPercent = stats ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0

  const displayCompleted = useCounterAnimation(stats?.completedCourses || 0, 500)
  const displayOngoing = useCounterAnimation(stats?.ongoingCourses || 0, 600)
  const displayRecommended = useCounterAnimation(stats?.recommendedCourses || 0, 700)
  const displayXP = useCounterAnimation(stats?.totalXP || 0, 800)

  useEffect(() => {
    if (!stats) return

    const timer = setTimeout(() => {
      let current = 0
      const target = progressPercent
      const interval = setInterval(() => {
        current += 2
        if (current >= target) {
          setProgress(target)
          clearInterval(interval)
        } else {
          setProgress(current)
        }
      }, 20)
      return () => clearInterval(interval)
    }, 400)
    return () => clearTimeout(timer)
  }, [progressPercent, stats])

  // Loading state
  if (isLoading) {
    return (
      <Grid gutter="md">
        {[1, 2, 3, 4].map((i) => (
          <Grid.Col key={i} span={{ base: 12, sm: 6, md: 3 }}>
            <MotionCard
              shadow="sm"
              padding="lg"
              radius="xl"
              withBorder
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={classes.card}
            >
              <Stack align="center" gap="md">
                <Loader size="lg" />
                <Text size="sm" c="dimmed">
                  Loading...
                </Text>
              </Stack>
            </MotionCard>
          </Grid.Col>
        ))}
      </Grid>
    )
  }

  // Error state
  if (isError) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error loading stats" color="red">
        {error instanceof Error ? error.message : "Failed to load dashboard statistics"}
      </Alert>
    )
  }

  // No data
  if (!stats) {
    return null
  }

  return (
    <Grid gutter="md">
      {/* Completed Courses */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MotionCard
          shadow="sm"
          padding="lg"
          radius="xl"
          withBorder
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={classes.card}
        >
          <Group justify="space-between" mb="xs">
            <div className={classes.iconContainer}>
              <IconBook size={24} className={classes.bookIcon} />
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
              <Text size="xl" fw={700}>
                {displayCompleted}
              </Text>
            </motion.div>
          </Group>
          <Text size="sm" c="dimmed">
            Completed Courses
          </Text>
        </MotionCard>
      </Grid.Col>

      {/* Ongoing Courses */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MotionCard
          shadow="sm"
          padding="lg"
          radius="xl"
          withBorder
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={classes.card}
        >
          <Group justify="space-between" mb="xs">
            <div className={classes.iconContainer}>
              <IconClock size={24} className={classes.clockIcon} />
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
              <Text size="xl" fw={700}>
                {displayOngoing}
              </Text>
            </motion.div>
          </Group>
          <Text size="sm" c="dimmed">
            Ongoing Courses
          </Text>
        </MotionCard>
      </Grid.Col>

      {/* Recommended Courses */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MotionCard
          shadow="sm"
          padding="lg"
          radius="xl"
          withBorder
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={classes.card}
        >
          <Group justify="space-between" mb="xs">
            <div className={classes.iconContainer}>
              <IconTrendingUp size={24} className={classes.trendingIcon} />
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
              <Text size="xl" fw={700}>
                {displayRecommended}
              </Text>
            </motion.div>
          </Group>
          <Text size="sm" c="dimmed">
            Recommended
          </Text>
        </MotionCard>
      </Grid.Col>

      {/* Overall Progress */}
      <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
        <MotionCard
          shadow="sm"
          padding="lg"
          radius="xl"
          withBorder
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className={classes.card}
        >
          <Stack align="center" gap="xs">
            <RingProgress
              size={80}
              thickness={8}
              sections={[{ value: progress, color: "teal" }]}
              label={
                <Text ta="center" size="lg" fw={700}>
                  {progress}%
                </Text>
              }
            />
            <Text size="sm" c="dimmed" ta="center">
              Overall Progress
            </Text>
            <Text size="xs" c="dimmed">
              {displayXP} XP • Level {stats.currentLevel}
            </Text>
          </Stack>
        </MotionCard>
      </Grid.Col>
    </Grid>
  )
}
