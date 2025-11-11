import { motion, type HTMLMotionProps } from "framer-motion"
import {
  Card,
  Paper,
  Badge,
  Box,
  Stack,
  type CardProps,
  type PaperProps,
  type BadgeProps,
  type BoxProps,
  type StackProps,
} from "@mantine/core"
import { forwardRef, type ReactNode } from "react"
import classes from "./motion-components.module.scss"

type MotionCardProps = CardProps &
  Omit<HTMLMotionProps<"div">, keyof CardProps> & {
    children?: ReactNode
  }

type MotionPaperProps = PaperProps &
  Omit<HTMLMotionProps<"div">, keyof PaperProps> & {
    children?: ReactNode
  }

type MotionBadgeProps = BadgeProps &
  Omit<HTMLMotionProps<"div">, keyof BadgeProps> & {
    children?: ReactNode
  }

type MotionBoxProps = BoxProps &
  Omit<HTMLMotionProps<"div">, keyof BoxProps> & {
    children?: ReactNode
  }

type MotionStackProps = StackProps &
  Omit<HTMLMotionProps<"div">, keyof StackProps> & {
    children?: ReactNode
  }

const MotionCardBase = motion(Card as React.ComponentType<CardProps>)
const MotionPaperBase = motion(Paper as React.ComponentType<PaperProps>)

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>((props, ref) => {
  return <MotionCardBase ref={ref} {...(props as CardProps & HTMLMotionProps<"div">)} className={classes.clickable} />
})

MotionCard.displayName = "MotionCard"

export const MotionPaper = forwardRef<HTMLDivElement, MotionPaperProps>((props, ref) => {
  return <MotionPaperBase ref={ref} {...(props as PaperProps & HTMLMotionProps<"div">)} className={classes.clickable} />
})

MotionPaper.displayName = "MotionPaper"

export const MotionBadge = motion(Badge as React.ComponentType<BadgeProps>) as React.ComponentType<MotionBadgeProps>

export const MotionBox = motion(Box as React.ComponentType<BoxProps>) as React.ComponentType<MotionBoxProps>

export const MotionStack = motion(Stack as React.ComponentType<StackProps>) as React.ComponentType<MotionStackProps>
