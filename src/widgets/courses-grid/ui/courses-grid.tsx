import { Stack, Text, Badge, Group, Progress, Grid, Tooltip, Box } from "@mantine/core"
import { IconClock, IconTarget, IconStar, IconLock, IconLockOpen, IconSparkles } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useMemo } from "react"
import type { Course } from "@/shared/types"
import { MotionCard, MotionBadge } from "@/shared/ui"
import { STATUS_COLORS } from "@/shared/config"
import classes from "./courses-grid.module.css"

interface CoursesGridProps {
  courses: Course[]
  title?: string
  showRecommendationScore?: boolean
  allCourses?: Course[]
}

export function CoursesGrid({
  courses,
  title = "Your Courses",
  showRecommendationScore = false,
  allCourses = [],
}: CoursesGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const courseMap = useMemo(() => {
    const map = new Map<string, string>()
    allCourses.forEach((c) => map.set(c.id, c.title))
    return map
  }, [allCourses])

  if (courses.length === 0) {
    return (
      <Stack gap="md">
        <Text size="xl" fw={600}>
          {title}
        </Text>
        <Text c="dimmed">No courses found matching your filters</Text>
      </Stack>
    )
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Text size="xl" fw={600}>
            {title}
          </Text>
        </motion.div>
        <MotionBadge
          variant="light"
          size="lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
        >
          {courses.length} {courses.length === 1 ? "Course" : "Courses"}
        </MotionBadge>
      </Group>

      <Grid gutter="md">
        <AnimatePresence>
          {courses.map((course, index) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={course.id}>
              <MotionCard
                shadow="sm"
                padding="lg"
                radius="xl"
                withBorder
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredId(course.id)}
                onHoverEnd={() => setHoveredId(null)}
                style={{
                  height: "100%",
                  cursor: "pointer",
                  perspective: "1000px",
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <MotionBadge
                      variant="light"
                      color={STATUS_COLORS[course.status]}
                      animate={hoveredId === course.id ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {course.status}
                    </MotionBadge>
                    <motion.div
                      animate={hoveredId === course.id ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Badge variant="outline" color="gray" size="sm">
                        {course.category}
                      </Badge>
                    </motion.div>
                  </Group>

                  <motion.div animate={hoveredId === course.id ? { x: [0, 5, 0] } : {}} transition={{ duration: 0.4 }}>
                    <Text fw={600} size="lg" lineClamp={2}>
                      {course.title}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
                      {course.description}
                    </Text>
                  </motion.div>

                  {course.status !== "recommended" && (
                    <>
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">
                            Progress
                          </Text>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                          >
                            <Text size="sm" fw={500}>
                              {course.totalProgress}%
                            </Text>
                          </motion.div>
                        </Group>
                        <motion.div
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: index * 0.05 + 0.4 }}
                        >
                          <Progress
                            value={course.totalProgress}
                            size="sm"
                            radius="xl"
                            color={STATUS_COLORS[course.status]}
                          />
                        </motion.div>
                      </Stack>

                      <Group gap="xl">
                        <Group gap="xs">
                          <motion.div
                            animate={hoveredId === course.id ? { scale: [1, 1.3, 1] } : {}}
                            transition={{
                              duration: 0.3,
                              repeat: hoveredId === course.id ? Number.POSITIVE_INFINITY : 0,
                              repeatDelay: 1,
                            }}
                          >
                            <IconTarget size={16} className={classes.targetIcon} />
                          </motion.div>
                          <Text size="sm" c="dimmed">
                            {course.performance.accuracyPct}%
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <motion.div
                            animate={hoveredId === course.id ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          >
                            <IconClock size={16} className={classes.targetIcon} />
                          </motion.div>
                          <Text size="sm" c="dimmed">
                            {course.sessions.length} sessions
                          </Text>
                        </Group>
                      </Group>
                    </>
                  )}

                  {course.status === "recommended" && (
                    <Tooltip
                      label={
                        <Stack gap="xs" p="xs">
                          {course.recommendationReason && (
                            <Box>
                              <Group gap={4} mb={4}>
                                <IconSparkles size={14} className={classes.sparklesIcon} />
                                <Text size="xs" fw={600} c="yellow">
                                  Why recommended:
                                </Text>
                              </Group>
                              <Text size="xs" c="dimmed">
                                {course.recommendationReason}
                              </Text>
                            </Box>
                          )}
                          {course.unlockedCourseIds && course.unlockedCourseIds.length > 0 && (
                            <Box>
                              <Group gap={4} mb={4}>
                                <IconLockOpen size={14} className={classes.lockOpenIcon} />
                                <Text size="xs" fw={600} c="green">
                                  Unlocks {course.unlockedCourseIds.length}{" "}
                                  {course.unlockedCourseIds.length === 1 ? "course" : "courses"}:
                                </Text>
                              </Group>
                              <Stack gap={2}>
                                {course.unlockedCourseIds.map((id) => (
                                  <Group key={id} gap={4}>
                                    <IconLock size={10} className={classes.targetIcon} />
                                    <Text size="xs" c="dimmed">
                                      {courseMap.get(id) || id}
                                    </Text>
                                  </Group>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      }
                      multiline
                      w={300}
                      withArrow
                      position="top"
                      transitionProps={{ transition: "pop", duration: 200 }}
                    >
                      <Stack gap="xs">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.5 }}
                        >
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {course.description}
                          </Text>
                        </motion.div>
                        {showRecommendationScore && course.recommendedScore && (
                          <Group gap="xs">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{
                                duration: 2,
                                repeat: hoveredId === course.id ? Number.POSITIVE_INFINITY : 0,
                              }}
                            >
                              <IconStar size={16} className={classes.sparklesIcon} />
                            </motion.div>
                            <Text size="sm" fw={500} c="yellow">
                              {course.recommendedScore}% match
                            </Text>
                          </Group>
                        )}
                        <Group gap={4}>
                          <IconSparkles size={12} className={classes.sparklesSmallIcon} />
                          <Text size="xs" c="violet" fs="italic">
                            Hover for details
                          </Text>
                        </Group>
                      </Stack>
                    </Tooltip>
                  )}

                  {course.status === "locked" && (
                    <Stack gap="xs">
                      <Group gap="xs" justify="center">
                        <IconLock size={32} className={classes.lockIcon} />
                      </Group>
                      <Text size="sm" c="red" ta="center" fw={500}>
                        Locked
                      </Text>
                      <Text size="xs" c="dimmed" ta="center">
                        Complete prerequisites to unlock
                      </Text>
                      {course.prereqIds.length > 0 && (
                        <Stack gap={4} mt="xs">
                          <Text size="xs" fw={600} c="dimmed">
                            Required:
                          </Text>
                          {course.prereqIds.map((prereqId) => (
                            <Text key={prereqId} size="xs" c="dimmed">
                              • {courseMap.get(prereqId) || prereqId}
                            </Text>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  )}
                </Stack>
              </MotionCard>
            </Grid.Col>
          ))}
        </AnimatePresence>
      </Grid>
    </Stack>
  )
}
