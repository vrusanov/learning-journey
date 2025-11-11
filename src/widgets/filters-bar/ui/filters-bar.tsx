import { MultiSelect, Group, Box } from "@mantine/core"
import { IconCalendar } from "@tabler/icons-react"
import { DatePickerInput } from "@mantine/dates"
import { motion } from "framer-motion"
import { MotionPaper } from "@/shared/ui"
import { CATEGORIES, COURSE_STATUSES } from "@/shared/config"
import classes from "./filters-bar.module.css"

interface FiltersBarProps {
  selectedCategories: string[]
  onCategoriesChange: (value: string[]) => void
  selectedStatuses: string[]
  onStatusesChange: (value: string[]) => void
  dateRange: [Date | null, Date | null]
  onDateRangeChange: (value: [Date | null, Date | null]) => void
}

export function FiltersBar({
  selectedCategories,
  onCategoriesChange,
  selectedStatuses,
  onStatusesChange,
  dateRange,
  onDateRangeChange,
}: FiltersBarProps) {
  return (
    <MotionPaper
      p="lg"
      radius="lg"
      className={classes.container}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Group gap="md" grow>
        <MultiSelect
          placeholder="Categories"
          data={[...CATEGORIES]}
          value={selectedCategories}
          onChange={onCategoriesChange}
          clearable
          styles={{
            input: {
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
        <MultiSelect
          placeholder="Status"
          data={COURSE_STATUSES.map((status) => ({
            value: status,
            label: status.charAt(0).toUpperCase() + status.slice(1),
          }))}
          value={selectedStatuses}
          onChange={onStatusesChange}
          styles={{
            input: {
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
        <DatePickerInput
          type="range"
          placeholder="Date range"
          leftSection={<IconCalendar size={18} />}
          value={dateRange}
          onChange={onDateRangeChange}
          clearable
          styles={{
            input: {
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        />
      </Group>
      <Box mt="xs">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={classes.progressBarContainer}
        >
          <Box h={2} className={classes.progressBar} />
        </motion.div>
      </Box>
    </MotionPaper>
  )
}
