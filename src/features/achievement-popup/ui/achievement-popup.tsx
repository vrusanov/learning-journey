import { Modal, Stack, Text, Badge, Button } from "@mantine/core"
import { motion } from "framer-motion"
import { IconTrophy, IconFlame, IconTarget, IconBolt } from "@tabler/icons-react"
import type { Icon } from "@tabler/icons-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  progress: number
  unlocked: boolean
  isNew?: boolean
}

interface AchievementPopupProps {
  achievement: Achievement | null
  opened: boolean
  onClose: () => void
}

const iconMap: Record<
  string,
  React.ForwardRefExoticComponent<React.PropsWithoutRef<React.ComponentProps<Icon>> & React.RefAttributes<Icon>>
> = {
  trophy: IconTrophy,
  flame: IconFlame,
  target: IconTarget,
  zap: IconBolt,
}

const rarityColors: Record<Achievement["rarity"], string> = {
  common: "#94a3b8",
  rare: "#3b82f6",
  epic: "#a855f7",
  legendary: "#f59e0b",
}

const rarityGradients: Record<Achievement["rarity"], string> = {
  common: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
  rare: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  epic: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
  legendary: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
}

export function AchievementPopup({ achievement, opened, onClose }: AchievementPopupProps) {
  if (!achievement) return null

  const IconComponent = iconMap[achievement.icon] || IconTrophy
  const rarityColor = rarityColors[achievement.rarity]
  const rarityGradient = rarityGradients[achievement.rarity]

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      withCloseButton={false}
      styles={{
        content: {
          background: rarityGradient,
          padding: "2rem",
        },
      }}
    >
      <Stack align="center" gap="lg">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <IconComponent size={80} stroke={1.5} style={{ color: "white" }} />
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Badge
            size="lg"
            variant="gradient"
            gradient={{ from: "white", to: "gray.2", deg: 135 }}
            style={{ color: rarityColor, fontWeight: 700, textTransform: "uppercase" }}
          >
            {achievement.rarity}
          </Badge>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Text size="xl" fw={700} c="white" ta="center">
            {achievement.title}
          </Text>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Text size="sm" c="white" ta="center" opacity={0.9}>
            {achievement.description}
          </Text>
        </motion.div>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: ["#fbbf24", "#f59e0b", "#a855f7", "#3b82f6"][i % 4],
            }}
            animate={{
              x: Math.cos((i / 20) * Math.PI * 2) * 150,
              y: Math.sin((i / 20) * Math.PI * 2) * 150,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            style={{ pointerEvents: "none" }}
          />
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Button variant="white" color="dark" onClick={onClose} size="md" fullWidth>
            Awesome!
          </Button>
        </motion.div>
      </Stack>
    </Modal>
  )
}
