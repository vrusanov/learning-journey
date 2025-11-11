import { Card, Stack, Text, Group, Avatar, Badge, Progress, Box, Tabs } from "@mantine/core"
import { IconTrophy, IconFlame, IconClock, IconTarget, IconStar } from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { User } from "@/shared/types"
import { MotionCard } from "@/shared/ui"
import classes from "./leaderboard.module.css"

interface LeaderboardProps {
  users: User[]
}

type SortBy = "xp" | "completed" | "accuracy" | "streak"

const SORT_OPTIONS = [
  { value: "xp" as const, label: "XP", icon: <IconTrophy size={16} /> },
  { value: "completed" as const, label: "Completed", icon: <IconTarget size={16} /> },
  { value: "accuracy" as const, label: "Accuracy", icon: <IconStar size={16} /> },
  { value: "streak" as const, label: "Streak", icon: <IconFlame size={16} /> },
]

export function Leaderboard({ users }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<SortBy>("xp")

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case "xp":
        return b.stats.xp - a.stats.xp
      case "completed":
        return b.stats.completed - a.stats.completed
      case "accuracy":
        return b.stats.avgAccuracy - a.stats.avgAccuracy
      case "streak":
        return b.stats.streak - a.stats.streak
      default:
        return 0
    }
  })

  const getRankColor = (rank: number) => {
    if (rank === 1) return "yellow"
    if (rank === 2) return "gray"
    if (rank === 3) return "orange"
    return "blue"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const getStatValue = (user: User) => {
    switch (sortBy) {
      case "xp":
        return `${user.stats.xp} XP`
      case "completed":
        return `${user.stats.completed} courses`
      case "accuracy":
        return `${user.stats.avgAccuracy}%`
      case "streak":
        return `${user.stats.streak} days`
    }
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconTrophy size={28} className={classes.trophyIcon} />
          <Text size="xl" fw={600}>
            Leaderboard
          </Text>
        </Group>
        <Badge size="lg" variant="light" color="violet">
          {users.length} friends
        </Badge>
      </Group>

      <Tabs value={sortBy} onChange={(value) => setSortBy(value as SortBy)}>
        <Tabs.List grow>
          {SORT_OPTIONS.map((option) => (
            <Tabs.Tab key={option.value} value={option.value} leftSection={option.icon}>
              {option.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <Stack gap="sm">
        <AnimatePresence mode="popLayout">
          {sortedUsers.map((user, index) => {
            const rank = index + 1
            const isCurrentUser = user.isCurrentUser

            return (
              <MotionCard
                key={user.id}
                shadow="sm"
                padding="md"
                radius="lg"
                withBorder
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  cursor: "pointer",
                  background: isCurrentUser
                    ? "linear-gradient(135deg, rgba(109, 40, 217, 0.15) 0%, rgba(17, 24, 39, 0.3) 100%)"
                    : undefined,
                  border: isCurrentUser ? "2px solid rgba(109, 40, 217, 0.5)" : undefined,
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="md" wrap="nowrap">
                    {/* Rank Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
                    >
                      <Badge
                        size="xl"
                        variant="filled"
                        color={getRankColor(rank)}
                        style={{
                          minWidth: "50px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                        }}
                      >
                        {getRankIcon(rank)}
                      </Badge>
                    </motion.div>

                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 + 0.1 }}
                    >
                      <Avatar size="lg" radius="xl" style={{ fontSize: "1.5rem" }}>
                        {user.avatar}
                      </Avatar>
                    </motion.div>

                    {/* User Info */}
                    <Stack gap={4}>
                      <Group gap="xs">
                        <Text fw={600} size="lg">
                          {user.name}
                        </Text>
                        {isCurrentUser && (
                          <Badge size="sm" variant="light" color="violet">
                            You
                          </Badge>
                        )}
                      </Group>
                      <Group gap="xs">
                        <Badge size="sm" variant="light" color="blue" leftSection={<IconTrophy size={12} />}>
                          Level {user.stats.level}
                        </Badge>
                        <Badge size="sm" variant="light" color="orange" leftSection={<IconFlame size={12} />}>
                          {user.stats.streak}🔥
                        </Badge>
                      </Group>
                    </Stack>
                  </Group>

                  {/* Stats */}
                  <Stack gap={4} align="flex-end" style={{ minWidth: "120px" }}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <Text size="xl" fw={700} c="violet">
                        {getStatValue(user)}
                      </Text>
                    </motion.div>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">
                        {user.stats.completed} completed
                      </Text>
                      <Text size="xs" c="dimmed">
                        •
                      </Text>
                      <Text size="xs" c="dimmed">
                        {Math.floor(user.stats.totalMinutes / 60)}h
                      </Text>
                    </Group>
                  </Stack>
                </Group>

                {/* Progress Bar for Current User */}
                {isCurrentUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box mt="md">
                      <Group justify="space-between" mb={4}>
                        <Text size="xs" c="dimmed">
                          Progress to next level
                        </Text>
                        <Text size="xs" fw={600} c="violet">
                          {user.stats.xp % 500} / 500 XP
                        </Text>
                      </Group>
                      <Progress value={(user.stats.xp % 500) / 5} color="violet" size="sm" radius="xl" animated />
                    </Box>
                  </motion.div>
                )}
              </MotionCard>
            )
          })}
        </AnimatePresence>
      </Stack>

      {/* Summary Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card padding="md" radius="lg" withBorder style={{ background: "rgba(109, 40, 217, 0.05)" }}>
          <Group justify="space-around">
            <Stack gap={4} align="center">
              <IconTarget size={20} className={classes.targetIcon} />
              <Text size="xs" c="dimmed">
                Avg Completed
              </Text>
              <Text size="lg" fw={700}>
                {Math.round(users.reduce((sum, u) => sum + u.stats.completed, 0) / users.length)}
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <IconStar size={20} className={classes.starIcon} />
              <Text size="xs" c="dimmed">
                Avg Accuracy
              </Text>
              <Text size="lg" fw={700}>
                {Math.round(users.reduce((sum, u) => sum + u.stats.avgAccuracy, 0) / users.length)}%
              </Text>
            </Stack>
            <Stack gap={4} align="center">
              <IconClock size={20} className={classes.clockIcon} />
              <Text size="xs" c="dimmed">
                Total Hours
              </Text>
              <Text size="lg" fw={700}>
                {Math.floor(users.reduce((sum, u) => sum + u.stats.totalMinutes, 0) / 60)}h
              </Text>
            </Stack>
          </Group>
        </Card>
      </motion.div>
    </Stack>
  )
}
