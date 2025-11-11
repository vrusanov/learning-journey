import { Modal, Stack, Text, Badge, Group, Progress, Button, Grid, Timeline, Divider, ThemeIcon } from "@mantine/core"
import {
  IconClock,
  IconTarget,
  IconTrendingUp,
  IconPlayerPlay,
  IconCheck,
  IconBook,
  IconCalendar,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import type { Course, CourseStatus } from "@/shared/types"
import { MotionCard } from "@/shared/ui"

interface CourseDetailModalProps {
  course: Course | null
  opened: boolean
  onClose: () => void
}

const statusColors: Record<CourseStatus, string> = {
  completed: "green",
  ongoing: "blue",
  recommended: "violet",
  locked: "red",
}

export function CourseDetailModal({ course, opened, onClose }: CourseDetailModalProps) {
  if (!course) return null

  const totalMinutes = course.sessions.reduce((sum, s) => sum + s.minutes, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60

  const getActionButton = () => {
    switch (course.status) {
      case "ongoing":
        return (
          <Button size="lg" fullWidth leftSection={<IconPlayerPlay size={20} />} color="blue">
            Continue Learning
          </Button>
        )
      case "recommended":
        return (
          <Button size="lg" fullWidth leftSection={<IconPlayerPlay size={20} />} color="violet">
            Start Course
          </Button>
        )
      case "completed":
        return (
          <Button size="lg" fullWidth leftSection={<IconCheck size={20} />} color="green" variant="light">
            Review Course
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={
        <Group gap="sm">
          <Badge color={statusColors[course.status]} size="lg" variant="light">
            {course.status}
          </Badge>
          <Badge variant="outline" color="gray">
            {course.category}
          </Badge>
        </Group>
      }
      centered
    >
      <Stack gap="xl">
        {/* Course Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Text size="xl" fw={700} mb="sm">
            {course.title}
          </Text>
          <Text c="dimmed">{course.description}</Text>
        </motion.div>
        {course.status !== "recommended" && (
          <MotionCard
            withBorder
            padding="lg"
            radius="md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Overall Progress</Text>
                <Text size="xl" fw={700} c={statusColors[course.status]}>
                  {course.totalProgress}%
                </Text>
              </Group>
              <Progress value={course.totalProgress} size="xl" radius="xl" color={statusColors[course.status]} />
            </Stack>
          </MotionCard>
        )}
        <Grid gutter="md">
          <Grid.Col span={6}>
            <MotionCard
              withBorder
              padding="md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" size="lg">
                  <IconClock size={18} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Time Spent
                </Text>
              </Group>
              <Text size="xl" fw={700}>
                {totalHours}h {remainingMinutes}m
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {course.sessions.length} sessions
              </Text>
            </MotionCard>
          </Grid.Col>

          <Grid.Col span={6}>
            <MotionCard
              withBorder
              padding="md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" size="lg" color="green">
                  <IconTarget size={18} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Accuracy
                </Text>
              </Group>
              <Text size="xl" fw={700}>
                {course.performance.accuracyPct}%
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {course.performance.totalTasksCompleted} / {course.performance.totalTasksAttempted} tasks
              </Text>
            </MotionCard>
          </Grid.Col>

          <Grid.Col span={6}>
            <MotionCard
              withBorder
              padding="md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" size="lg" color="blue">
                  <IconTrendingUp size={18} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Pace
                </Text>
              </Group>
              <Text size="xl" fw={700}>
                {course.performance.pace}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                tasks per hour
              </Text>
            </MotionCard>
          </Grid.Col>

          <Grid.Col span={6}>
            <MotionCard
              withBorder
              padding="md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Group gap="xs" mb="xs">
                <ThemeIcon variant="light" size="lg" color="violet">
                  <IconBook size={18} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Prerequisites
                </Text>
              </Group>
              <Text size="xl" fw={700}>
                {course.prereqIds.length}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                required courses
              </Text>
            </MotionCard>
          </Grid.Col>
        </Grid>
        {course.status === "recommended" && course.recommendedScore && (
          <MotionCard
            withBorder
            padding="lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Group justify="space-between">
              <Text fw={600}>Recommendation Score</Text>
              <Badge size="xl" variant="gradient" gradient={{ from: "violet", to: "grape" }}>
                {course.recommendedScore}% Match
              </Badge>
            </Group>
            <Text size="sm" c="dimmed" mt="sm">
              This course is highly recommended based on your learning history and preferences.
            </Text>
          </MotionCard>
        )}

        {/* Recent Sessions Timeline */}
        {course.sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Divider my="md" />
            <Text fw={600} mb="md">
              Recent Sessions
            </Text>
            <Timeline active={3} bulletSize={24} lineWidth={2}>
              {course.sessions.slice(0, 5).map((session) => {
                const date = new Date(session.startedAt)
                return (
                  <Timeline.Item
                    key={session.id}
                    bullet={<IconCalendar size={12} />}
                    title={
                      <Group gap="xs">
                        <Text size="sm" fw={500}>
                          {date.toLocaleDateString()}
                        </Text>
                        <Badge size="sm" variant="light">
                          {session.minutes}min
                        </Badge>
                      </Group>
                    }
                  >
                    <Text size="xs" c="dimmed">
                      Completed {session.completedTasks} / {session.totalTasks} tasks
                    </Text>
                  </Timeline.Item>
                )
              })}
            </Timeline>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {getActionButton()}
        </motion.div>
      </Stack>
    </Modal>
  )
}
