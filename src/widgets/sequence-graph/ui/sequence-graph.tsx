import { Text, Badge, Group, Box, ScrollArea, Paper } from "@mantine/core"
import { motion } from "framer-motion"
import { IconArrowRight, IconCheck, IconLock } from "@tabler/icons-react"
import { useMemo } from "react"
import type { Course } from "@/shared/types"
import { MotionPaper } from "@/shared/ui"
import classes from "./sequence-graph.module.css"

interface SequenceGraphProps {
  courses: Course[]
}

export function SequenceGraph({ courses }: SequenceGraphProps) {
  const layers = useMemo(() => {
    const completed = courses.filter((c) => c.status === "completed")
    const ongoing = courses.filter((c) => c.status === "ongoing")
    const recommended = courses.filter((c) => c.status === "recommended")
    const locked = courses.filter((c) => c.status === "locked")

    const visited = new Set<string>()
    const result: Course[][] = []

    const startCourses = completed.filter((c) => c.prereqIds.length === 0)
    if (startCourses.length > 0) {
      result.push(startCourses)
      startCourses.forEach((c) => visited.add(c.id))
    }

    const completedWithPrereqs = completed.filter((c) => c.prereqIds.length > 0 && !visited.has(c.id))
    if (completedWithPrereqs.length > 0) {
      result.push(completedWithPrereqs)
      completedWithPrereqs.forEach((c) => visited.add(c.id))
    }

    if (ongoing.length > 0) {
      result.push(ongoing)
    }

    if (recommended.length > 0) {
      result.push(recommended)
    }

    if (locked.length > 0) {
      result.push(locked)
    }

    return result
  }, [courses])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "cyan"
      case "ongoing":
        return "yellow"
      case "recommended":
        return "gray"
      case "locked":
        return "red"
      default:
        return "gray"
    }
  }

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "completed":
        return "2px solid #22b8cf"
      case "ongoing":
        return "2px dashed #fab005"
      case "recommended":
        return "2px dashed #868e96"
      case "locked":
        return "2px solid #fa5252"
      default:
        return "none"
    }
  }

  return (
    <MotionPaper
      p="xl"
      radius="lg"
      style={{
        background: "linear-gradient(135deg, rgba(76, 29, 149, 0.15) 0%, rgba(17, 24, 39, 0.3) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Group justify="space-between" mb="xl">
        <Box>
          <Text size="xl" fw={700} mb={4}>
            Learning Sequence & Relationships
          </Text>
          <Text size="sm" c="dimmed">
            Visual representation of your learning path
          </Text>
        </Box>
        <Group gap="md">
          <Group gap={6}>
            <Box w={20} h={20} className={classes.legendCompleted} />
            <Text size="xs" c="dimmed">
              Completed
            </Text>
          </Group>
          <Group gap={6}>
            <Box w={20} h={20} className={classes.legendOngoing} />
            <Text size="xs" c="dimmed">
              Ongoing
            </Text>
          </Group>
          <Group gap={6}>
            <Box w={20} h={20} className={classes.legendRecommended} />
            <Text size="xs" c="dimmed">
              Recommended
            </Text>
          </Group>
          <Group gap={6}>
            <Box w={20} h={20} className={classes.legendLocked} />
            <Text size="xs" c="dimmed">
              Locked
            </Text>
          </Group>
        </Group>
      </Group>

      <ScrollArea>
        <Box className={classes.scrollContent}>
          <Group gap="xl" align="flex-start" wrap="nowrap">
            {layers.map((layer, layerIndex) => (
              <Box key={layerIndex} className={classes.layerContainer}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: layerIndex * 0.1 }}
                >
                  <Box
                    p="lg"
                    style={{
                      border: getStatusBorder(layer[0].status),
                      borderRadius: "16px",
                      background:
                        layer[0].status === "ongoing"
                          ? "rgba(250, 176, 5, 0.05)"
                          : layer[0].status === "recommended"
                            ? "rgba(134, 142, 150, 0.05)"
                            : "rgba(34, 184, 207, 0.05)",
                      minWidth: "200px",
                    }}
                  >
                    <Group gap="md" mb="sm">
                      {layer.map((course) => (
                        <motion.div
                          key={course.id}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Paper
                            p="md"
                            radius="md"
                            style={{
                              cursor: "pointer",
                              border: getStatusBorder(course.status),
                              background:
                                course.status === "completed"
                                  ? "rgba(34, 184, 207, 0.15)"
                                  : course.status === "ongoing"
                                    ? "rgba(250, 176, 5, 0.15)"
                                    : course.status === "locked"
                                      ? "rgba(250, 82, 82, 0.1)"
                                      : "rgba(134, 142, 150, 0.1)",
                              width: "160px",
                              height: "160px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                          >
                            {course.status === "completed" && (
                              <motion.div
                                style={{
                                  position: "absolute",
                                  top: "12px",
                                  right: "12px",
                                }}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                              >
                                <IconCheck size={24} color="#22b8cf" />
                              </motion.div>
                            )}
                            {course.status === "ongoing" && (
                              <motion.div
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  left: "8px",
                                  right: "8px",
                                }}
                                animate={{
                                  boxShadow: ["0 0 0 0 rgba(250, 176, 5, 0.7)", "0 0 0 10px rgba(250, 176, 5, 0)"],
                                }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              >
                                <Box w="100%" h={3} className={classes.ongoingIndicator} />
                              </motion.div>
                            )}
                            {course.status === "locked" && (
                              <motion.div
                                style={{
                                  position: "absolute",
                                  top: "12px",
                                  right: "12px",
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                              >
                                <IconLock size={24} color="#fa5252" />
                              </motion.div>
                            )}
                            <Text size="sm" fw={600} ta="center" lineClamp={3}>
                              {course.title}
                            </Text>
                            <Badge
                              size="xs"
                              color={getStatusColor(course.status)}
                              variant="light"
                              mt="xs"
                              className={classes.badgeCapitalize}
                            >
                              {course.status}
                            </Badge>
                          </Paper>
                        </motion.div>
                      ))}
                    </Group>
                  </Box>
                </motion.div>

                {layerIndex < layers.length - 1 && (
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "-30px",
                      transform: "translateY(-50%)",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: layerIndex * 0.1 + 0.2 }}
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <IconArrowRight
                        size={32}
                        color={layers[layerIndex + 1][0].status === "recommended" ? "#868e96" : "#7c3aed"}
                        style={{
                          filter: "drop-shadow(0 0 8px rgba(124, 58, 237, 0.5))",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </Box>
            ))}
          </Group>
        </Box>
      </ScrollArea>
    </MotionPaper>
  )
}
