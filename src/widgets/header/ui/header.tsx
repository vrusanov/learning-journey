import { useState } from "react"
import {
  Group,
  Title,
  TextInput,
  ActionIcon,
  Avatar,
  Menu,
  Indicator,
  Badge,
  Burger,
  Drawer,
  Stack,
  Text,
  Divider,
  Button,
  Paper,
} from "@mantine/core"
import {
  IconSearch,
  IconBell,
  IconSettings,
  IconLogout,
  IconUser,
  IconChartBar,
  IconTrophy,
  IconBook,
  IconHome,
  IconX,
} from "@tabler/icons-react"
import { motion, AnimatePresence } from "framer-motion"
import { useDisclosure } from "@mantine/hooks"
import classes from "./header.module.css"

const MotionGroup = motion.create(Group)

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Achievement",
    message: "You've earned the 'Fast Learner' badge!",
    time: "5m ago",
    read: false,
  },
  {
    id: "2",
    title: "Course Completed",
    message: "Congratulations on finishing 'Advanced TypeScript'",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    title: "Daily Streak",
    message: "You're on a 7-day learning streak!",
    time: "3h ago",
    read: true,
  },
]

export function Header() {
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure()
  const [searchOpened, setSearchOpened] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <>
      <motion.header
        className={classes.header}
        style={{ padding: "var(--mantine-spacing-md) var(--mantine-spacing-xl)" }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Group justify="space-between" wrap="nowrap">
          {/* Logo & Brand */}
          <MotionGroup
            gap="sm"
            wrap="nowrap"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 5,
              }}
            >
              <IconBook size={32} stroke={2} style={{ color: "#7c3aed" }} />
            </motion.div>
            <div>
              <Title order={3} size="h4" className={classes.title}>
                LearnHub
              </Title>
              <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>
                Your Learning Journey
              </Text>
            </div>
          </MotionGroup>

          {/* Desktop Actions */}
          <Group gap="sm" visibleFrom="sm">
            {/* Search */}
            <AnimatePresence mode="wait">
              {searchOpened ? (
                <motion.div
                  key="search-input"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <TextInput
                    placeholder="Search courses..."
                    leftSection={<IconSearch size={16} />}
                    rightSection={
                      <ActionIcon variant="subtle" onClick={() => setSearchOpened(false)} aria-label="Close search">
                        <IconX size={16} />
                      </ActionIcon>
                    }
                    autoFocus
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="search-button"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <ActionIcon variant="light" size="lg" onClick={() => setSearchOpened(true)} aria-label="Open search">
                    <IconSearch size={20} />
                  </ActionIcon>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <Menu shadow="md" width={320} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="light" size="lg" aria-label="Notifications">
                  <Indicator inline disabled={unreadCount === 0} label={unreadCount} size={16} color="red">
                    <IconBell size={20} />
                  </Indicator>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Group justify="space-between" px="sm" pb="xs">
                  <Text fw={600} size="sm">
                    Notifications
                  </Text>
                  {unreadCount > 0 && (
                    <Button variant="subtle" size="xs" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                </Group>
                <Divider />
                <Stack gap={0}>
                  {notifications.map((notif) => (
                    <Menu.Item
                      key={notif.id}
                      style={{
                        padding: "12px",
                        backgroundColor: notif.read ? "transparent" : "rgba(124, 58, 237, 0.1)",
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <div style={{ flex: 1 }}>
                          <Text fw={500} size="sm">
                            {notif.title}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {notif.message}
                          </Text>
                        </div>
                        <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
                          {notif.time}
                        </Text>
                      </Group>
                    </Menu.Item>
                  ))}
                </Stack>
              </Menu.Dropdown>
            </Menu>

            {/* User Menu */}
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Avatar
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                    alt="Alex Johnson"
                    radius="xl"
                    style={{ cursor: "pointer", border: "2px solid rgba(124, 58, 237, 0.5)" }}
                  />
                </motion.div>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>
                  <Text size="sm" fw={600}>
                    Alex Johnson
                  </Text>
                  <Text size="xs" c="dimmed">
                    alex.johnson@email.com
                  </Text>
                </Menu.Label>
                <Divider />
                <Menu.Item leftSection={<IconHome size={16} />}>Dashboard</Menu.Item>
                <Menu.Item leftSection={<IconUser size={16} />}>Profile</Menu.Item>
                <Menu.Item leftSection={<IconChartBar size={16} />}>Progress</Menu.Item>
                <Menu.Item leftSection={<IconTrophy size={16} />}>Achievements</Menu.Item>
                <Divider />
                <Menu.Item leftSection={<IconSettings size={16} />}>Settings</Menu.Item>
                <Menu.Item leftSection={<IconLogout size={16} />} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* Mobile Burger */}
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" aria-label="Toggle menu" />
        </Group>
      </motion.header>

      {/* Mobile Drawer */}
      <Drawer
        opened={mobileOpened}
        onClose={closeMobile}
        size="full"
        padding="md"
        title="Menu"
        styles={{
          header: { backgroundColor: "rgba(26, 27, 30, 0.95)" },
          body: { backgroundColor: "rgba(26, 27, 30, 0.95)" },
        }}
      >
        <Stack gap="md">
          <TextInput placeholder="Search courses..." leftSection={<IconSearch size={16} />} />

          <Divider />

          <Group justify="space-between">
            <Text fw={600}>Notifications</Text>
            {unreadCount > 0 && <Badge color="red">{unreadCount}</Badge>}
          </Group>

          <Stack gap="xs">
            {notifications.map((notif) => (
              <Paper
                key={notif.id}
                p="sm"
                style={{ backgroundColor: notif.read ? "transparent" : "rgba(124, 58, 237, 0.1)" }}
              >
                <Text fw={500} size="sm">
                  {notif.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {notif.message}
                </Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {notif.time}
                </Text>
              </Paper>
            ))}
          </Stack>

          <Divider />

          <Group>
            <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex Johnson" radius="xl" />
            <div>
              <Text fw={600} size="sm">
                Alex Johnson
              </Text>
              <Text size="xs" c="dimmed">
                alex.johnson@email.com
              </Text>
            </div>
          </Group>

          <Stack gap="xs">
            <Button variant="light" leftSection={<IconHome size={16} />} fullWidth>
              Dashboard
            </Button>
            <Button variant="light" leftSection={<IconUser size={16} />} fullWidth>
              Profile
            </Button>
            <Button variant="light" leftSection={<IconChartBar size={16} />} fullWidth>
              Progress
            </Button>
            <Button variant="light" leftSection={<IconTrophy size={16} />} fullWidth>
              Achievements
            </Button>
            <Button variant="light" leftSection={<IconSettings size={16} />} fullWidth>
              Settings
            </Button>
            <Button variant="outline" color="red" leftSection={<IconLogout size={16} />} fullWidth>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  )
}

