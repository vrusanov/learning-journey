import { useEffect, useRef, useState } from "react"
import { Group, Stack, Text, Progress, Badge, Grid, Indicator, Switch } from "@mantine/core"
import { motion } from "framer-motion"
import {
  IconFlame,
  IconTrophy,
  IconStar,
  IconTarget,
  IconSparkles,
  IconMedal,
  IconBolt,
  IconBell,
  IconBellOff,
} from "@tabler/icons-react"
import { MotionCard, MotionBox, MotionBadge } from "@/shared/ui"
import { ACHIEVEMENT_RARITIES } from "@/shared/config"
import { AchievementPopup } from "@/features/achievement-popup"
import classes from "./gamification-widget.module.css"

const ACHIEVEMENTS = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first course",
    icon: "star",
    unlocked: true,
    progress: 100,
    rarity: "common" as const,
  },
  {
    id: "2",
    title: "Speed Demon",
    description: "Finish a course 2x faster",
    icon: "zap",
    unlocked: true,
    progress: 100,
    rarity: "rare" as const,
    isNew: true,
  },
  {
    id: "3",
    title: "Perfectionist",
    description: "Achieve 95% accuracy",
    icon: "trophy",
    unlocked: false,
    progress: 92,
    rarity: "epic" as const,
  },
  {
    id: "4",
    title: "Master",
    description: "Complete 10 courses",
    icon: "trophy",
    unlocked: false,
    progress: 20,
    rarity: "legendary" as const,
  },
]

const iconMap: Record<string, React.ReactNode> = {
  star: <IconStar size={24} />,
  zap: <IconBolt size={24} />,
  trophy: <IconTrophy size={24} />,
}

export function GamificationWidget() {
  const streakRef = useRef<HTMLDivElement>(null)
  const xpRef = useRef<HTMLDivElement>(null)
  const levelRef = useRef<HTMLDivElement>(null)

  const [selectedAchievement, setSelectedAchievement] = useState<(typeof ACHIEVEMENTS)[0] | null>(null)
  const [popupOpened, setPopupOpened] = useState(false)
  const [newBadgeVisible, setNewBadgeVisible] = useState(true)
  const [reminderEnabled, setReminderEnabled] = useState(false)

  const handleAchievementClick = (achievement: (typeof ACHIEVEMENTS)[0]) => {
    setSelectedAchievement(achievement)
    setPopupOpened(true)
    if (achievement.isNew) {
      setNewBadgeVisible(false)
    }
  }

  useEffect(() => {
    // Animate counters
    const animateCounter = (element: HTMLElement | null, target: number, suffix = "") => {
      if (!element) return
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          element.textContent = Math.round(target) + suffix
          clearInterval(timer)
        } else {
          element.textContent = Math.round(current) + suffix
        }
      }, 20)
    }

    animateCounter(streakRef.current, 12, " days")
    animateCounter(xpRef.current, 2450, " XP")
    animateCounter(levelRef.current, 8)
  }, [])

  return (
    <Stack gap="md">
      {/* Stats Row */}
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <MotionCard
            shadow="sm"
            padding="lg"
            radius="xl"
            withBorder
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={classes.streakCard}
          >
            <Stack align="center" gap="xs">
              <MotionBox
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ duration: 0.5 }}
                className={classes.streakIcon}
              >
                <IconFlame size={40} />
              </MotionBox>
              <Text size="xl" fw={700} ref={streakRef}>
                12 days
              </Text>
              <Text size="sm" c="dimmed">
                Current Streak
              </Text>
            </Stack>
          </MotionCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <MotionCard
            shadow="sm"
            padding="lg"
            radius="xl"
            withBorder
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={classes.xpCard}
          >
            <Stack align="center" gap="xs">
              <MotionBox
                whileHover={{
                  rotate: 360,
                  y: [-5, 5, -5],
                }}
                transition={{
                  rotate: { duration: 0.6 },
                  y: { duration: 0.3, repeat: Number.POSITIVE_INFINITY },
                }}
                className={classes.xpIcon}
              >
                <IconTrophy size={40} />
              </MotionBox>
              <Text size="xl" fw={700} ref={xpRef}>
                2450 XP
              </Text>
              <Text size="sm" c="dimmed">
                Total Experience
              </Text>
            </Stack>
          </MotionCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <MotionCard
            shadow="sm"
            padding="lg"
            radius="xl"
            withBorder
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={classes.levelCard}
          >
            <Stack align="center" gap="xs">
              <MotionBox
                whileHover={{ scale: 1.3 }}
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className={classes.levelIcon}
              >
                <IconSparkles size={40} />
              </MotionBox>
              <Group gap={4} align="baseline">
                <Text size="xl" fw={700} ref={levelRef}>
                  8
                </Text>
                <Text size="sm" c="dimmed">
                  Level
                </Text>
              </Group>
              <motion.div
                className={classes.progressBar}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Progress value={65} size="xs" radius="xl" color="violet.6" className={classes.progressBar} />
              </motion.div>
              <Text size="xs" c="dimmed">
                550 XP to Level 9
              </Text>
            </Stack>
          </MotionCard>
        </Grid.Col>
      </Grid>

      {/* Achievements */}
      <MotionCard
        shadow="md"
        padding="lg"
        radius="xl"
        withBorder
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="xs">
              <motion.div
                animate={{ rotate: [-15, 15, -15] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <IconMedal size={24} />
              </motion.div>
              <Text size="lg" fw={600}>
                Achievements
              </Text>
            </Group>
            <MotionBadge
              variant="light"
              size="lg"
              color="violet"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              2/4 Unlocked
            </MotionBadge>
          </Group>

          <Grid gutter="md">
            {ACHIEVEMENTS.map((achievement, index) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={achievement.id}>
                <Indicator
                  label="NEW"
                  size={16}
                  color="red"
                  disabled={!achievement.isNew || !newBadgeVisible}
                  position="top-end"
                  offset={7}
                  withBorder
                >
                  <MotionCard
                    shadow="sm"
                    padding="md"
                    radius="lg"
                    withBorder
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className={achievement.unlocked ? classes.achievementCardUnlocked : classes.achievementCardLocked}
                    whileHover={
                      achievement.unlocked
                        ? {
                            scale: 1.05,
                            y: -4,
                            boxShadow: "0 10px 30px rgba(114, 87, 255, 0.3)",
                          }
                        : { scale: 1.02 }
                    }
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAchievementClick(achievement)}
                  >
                    <Group align="flex-start" gap="md">
                      <motion.div
                        className={`${classes.achievementIconContainer} ${
                          achievement.unlocked ? classes.achievementIconUnlocked : classes.achievementIconLocked
                        }`}
                        animate={
                          achievement.unlocked
                            ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: achievement.unlocked ? Number.POSITIVE_INFINITY : 0,
                          repeatDelay: 3,
                        }}
                      >
                        {iconMap[achievement.icon]}
                      </motion.div>
                      <Stack gap="xs" className={classes.achievementContent}>
                        <Group justify="space-between">
                          <Text fw={600} size="sm">
                            {achievement.title}
                          </Text>
                          {achievement.unlocked && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            >
                              <Badge size="xs" color={ACHIEVEMENT_RARITIES[achievement.rarity].color} variant="light">
                                {ACHIEVEMENT_RARITIES[achievement.rarity].label}
                              </Badge>
                            </motion.div>
                          )}
                        </Group>
                        <Text size="xs" c="dimmed">
                          {achievement.description}
                        </Text>
                        {!achievement.unlocked && (
                          <motion.div
                            initial={{ scaleX: 0, originX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                          >
                            <Progress
                              value={achievement.progress}
                              size="xs"
                              radius="xl"
                              color={ACHIEVEMENT_RARITIES[achievement.rarity].color}
                            />
                          </motion.div>
                        )}
                      </Stack>
                    </Group>
                  </MotionCard>
                </Indicator>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </MotionCard>

      {/* Daily Goal */}
      <MotionCard
        shadow="md"
        padding="lg"
        radius="xl"
        withBorder
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.02, y: -3 }}
        whileTap={{ scale: 0.98 }}
        className={classes.nextMilestoneCard}
      >
        <Group justify="space-between" align="center">
          <Group gap="md">
            <motion.div
              className={classes.nextMilestoneIconContainer}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              }}
            >
              <IconTarget size={32} />
            </motion.div>
            <Stack gap={4}>
              <Text fw={600} size="lg">
                Daily Goal
              </Text>
              <Text size="sm" c="dimmed">
                35 / 45 minutes studied today
              </Text>
            </Stack>
          </Group>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Text size="xl" fw={700} className={classes.nextMilestoneProgress}>
              78%
            </Text>
          </motion.div>
        </Group>
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <Progress value={78} size="lg" radius="xl" color="cyan.6" mt="md" />
        </motion.div>
      </MotionCard>

      {/* Lesson Reminders Toggle */}
      <MotionCard
        shadow="md"
        padding="lg"
        radius="xl"
        withBorder
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        whileHover={{ scale: 1.02, y: -3 }}
      >
        <Group justify="space-between" align="center">
          <Group gap="md">
            <motion.div
              animate={
                reminderEnabled
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, -15, 15, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
              }}
            >
              {reminderEnabled ? <IconBell size={32} /> : <IconBellOff size={32} />}
            </motion.div>
            <Stack gap={4}>
              <Text fw={600} size="lg">
                Lesson Reminders
              </Text>
              <Text size="sm" c="dimmed">
                {reminderEnabled ? "You'll receive daily reminders" : "Enable to get daily study reminders"}
              </Text>
            </Stack>
          </Group>
          <Switch
            size="lg"
            checked={reminderEnabled}
            onChange={(event) => setReminderEnabled(event.currentTarget.checked)}
            color="violet"
            thumbIcon={reminderEnabled ? <IconBell size={12} /> : <IconBellOff size={12} />}
          />
        </Group>
      </MotionCard>

      {/* Achievement Popup */}
      <AchievementPopup achievement={selectedAchievement} opened={popupOpened} onClose={() => setPopupOpened(false)} />
    </Stack>
  )
}
