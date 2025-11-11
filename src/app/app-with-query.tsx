/**
 * App component with React Query integration
 * Demonstrates API-driven data fetching
 */

import { Container, Stack, Title, Text, Tabs, Badge, Group } from "@mantine/core"
import { MantineProvider } from "@mantine/core"
import { IconChartBar, IconBook, IconTrophy } from "@tabler/icons-react"
import { theme } from "@/shared/config"
import { DashboardStatsQuery } from "@/widgets/dashboard"
import { CoursesGridQuery } from "@/widgets/courses-grid"
import { MotionStack } from "@/shared/ui"
import classes from "./app.module.css"

export function AppWithQuery() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Container size="xl" className={classes.container}>
        <MotionStack
          gap="xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={classes.mainStack}
        >
          {/* Header */}
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Title order={1} className={classes.title}>
                🎓 Learning Journey
              </Title>
              <Badge size="lg" variant="gradient" gradient={{ from: "teal", to: "blue" }}>
                React Query Demo
              </Badge>
            </Group>
            <Text size="lg" c="dimmed" className={classes.subtitle}>
              Track your progress, explore courses, and level up your skills with API-driven data
            </Text>
          </Stack>

          {/* Dashboard Stats with React Query */}
          <DashboardStatsQuery />

          {/* Tabs with different course filters */}
          <Tabs defaultValue="all" variant="pills">
            <Tabs.List>
              <Tabs.Tab value="all" leftSection={<IconBook size={16} />}>
                All Courses
              </Tabs.Tab>
              <Tabs.Tab value="ongoing" leftSection={<IconChartBar size={16} />}>
                Ongoing
              </Tabs.Tab>
              <Tabs.Tab value="completed" leftSection={<IconTrophy size={16} />}>
                Completed
              </Tabs.Tab>
              <Tabs.Tab value="recommended" leftSection={<IconTrophy size={16} />}>
                Recommended
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="all" pt="xl">
              <CoursesGridQuery title="All Courses" />
            </Tabs.Panel>

            <Tabs.Panel value="ongoing" pt="xl">
              <CoursesGridQuery filters={{ status: "ongoing" }} title="Ongoing Courses" />
            </Tabs.Panel>

            <Tabs.Panel value="completed" pt="xl">
              <CoursesGridQuery filters={{ status: "completed" }} title="Completed Courses" />
            </Tabs.Panel>

            <Tabs.Panel value="recommended" pt="xl">
              <CoursesGridQuery
                filters={{ status: "recommended" }}
                title="Recommended Courses"
                showRecommendationScore
              />
            </Tabs.Panel>
          </Tabs>

          {/* Footer */}
          <Text size="sm" c="dimmed" ta="center" mt="xl">
            Built with React Query • Mock API with 500ms delay • Optimistic updates
          </Text>
        </MotionStack>
      </Container>
    </MantineProvider>
  )
}
