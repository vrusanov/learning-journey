import { TextInput, Group, Title, ActionIcon } from "@mantine/core"
import { IconSearch, IconX } from "@tabler/icons-react"
import { motion } from "framer-motion"
import classes from "./header.module.css"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

const MotionGroup = motion.create(Group)

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <motion.header
      className={classes.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MotionGroup
        justify="space-between"
        align="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Title order={1} size="h2" fw={900}>
          Learning Journey
        </Title>

        <TextInput
          placeholder="Search courses..."
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchQuery ? (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <IconX size={16} />
              </ActionIcon>
            ) : null
          }
          value={searchQuery}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          className={classes.searchInput}
          styles={{
            input: {
              width: "300px",
            },
          }}
        />
      </MotionGroup>
    </motion.header>
  )
}

