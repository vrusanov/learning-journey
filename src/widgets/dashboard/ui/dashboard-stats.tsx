import { Group, Stack, Text, RingProgress, Grid } from "@mantine/core"
import { IconBook, IconClock, IconTrendingUp } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { MotionCard } from "@/shared/ui"
import { useCounterAnimation } from "@/shared/lib"
import type { UserStats } from "@/shared/lib/utils/stats-calculator"
import classes from "./dashboard-stats.module.scss"

interface DashboardStatsProps {
  stats: UserStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const [progress, setProgress] = useState(0)
  const displayCompleted = useCounterAnimation(stats.completed, 500)
  const displayOngoing = useCounterAnimation(stats.ongoing, 600)
  const displayHours = useCounterAnimation(Math.floor(stats.totalMinutes / 60), 700)
  const displayAccuracy = useCounterAnimation(stats.avgAccuracy, 800)

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const target = stats.progress
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
  }, [stats.progress])

  return (
    <Grid gutter="md">
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
          whileTap={{ scale: 0.98 }}
          className={classes.card}
        >
          <Stack align="center" gap="md">
            <RingProgress
              size={120}
              thickness={12}
              roundCaps
              sections={[{ value: progress, color: "violet" }]}
              label={
                <Stack align="center" gap={0}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Text size="xl" fw={700}>
                      {progress}%
                    </Text>
                  </motion.div>
                  <Text size="xs" c="dimmed">
                    Overall
                  </Text>
                </Stack>
              }
            />
            <Text size="sm" fw={500}>
              Overall Progress
            </Text>
          </Stack>
        </MotionCard>
      </Grid.Col>

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
          whileTap={{ scale: 0.98 }}
        >
          <Stack gap="xs">
            <Group gap="xs">
              <IconBook size={24} className={classes.bookIcon} />
              <Text size="sm" c="dimmed">
                Courses
              </Text>
            </Group>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Text size="xl" fw={700}>
                {displayCompleted + displayOngoing}
              </Text>
            </motion.div>
            <Text size="xs" c="dimmed">
              {displayOngoing} active • {displayCompleted} completed
            </Text>
          </Stack>
        </MotionCard>
      </Grid.Col>

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
          whileTap={{ scale: 0.98 }}
          className={classes.card}
        >
          <Stack gap="xs">
            <Group gap="xs">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <IconClock size={24} className={classes.clockIcon} />
              </motion.div>
              <Text size="sm" c="dimmed">
                Study Time
              </Text>
            </Group>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Text size="xl" fw={700}>
                {displayHours}h
              </Text>
            </motion.div>
            <Text size="xs" c="dimmed">
              {stats.totalSessions} sessions total
            </Text>
          </Stack>
        </MotionCard>
      </Grid.Col>

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
          whileTap={{ scale: 0.98 }}
          className={classes.card}
        >
          <Stack gap="xs">
            <Group gap="xs">
              <IconTrendingUp size={24} className={classes.trendingIcon} />
              <Text size="sm" c="dimmed">
                Accuracy
              </Text>
            </Group>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Text size="xl" fw={700}>
                {displayAccuracy}%
              </Text>
            </motion.div>
            <Text size="xs" c="dimmed">
              Average score
            </Text>
          </Stack>
        </MotionCard>
      </Grid.Col>
    </Grid>
  )
}
