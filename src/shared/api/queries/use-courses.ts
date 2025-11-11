/**
 * React Query hooks for courses API
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchCourses,
  fetchCourseById,
  updateCourseStatus,
  FetchCoursesParams,
} from "../mock-api"
import { Course } from "../../types/course"

// Query keys for cache management
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters?: FetchCoursesParams) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
}

/**
 * Hook to fetch courses with filters
 */
export const useCourses = (params?: FetchCoursesParams) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => fetchCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

/**
 * Hook to fetch single course by ID
 */
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchCourseById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id, // Only fetch if ID is provided
  })
}

/**
 * Hook to update course status
 */
export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Course["status"] }) =>
      updateCourseStatus(id, status),

    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: courseKeys.lists() })

      // Snapshot previous value
      const previousCourses = queryClient.getQueriesData({ queryKey: courseKeys.lists() })

      // Optimistically update all course lists
      queryClient.setQueriesData({ queryKey: courseKeys.lists() }, (old: any) => {
        if (!old?.courses) return old

        return {
          ...old,
          courses: old.courses.map((course: Course) =>
            course.id === id ? { ...course, status } : course,
          ),
        }
      })

      // Also update the detail cache if it exists
      queryClient.setQueryData(courseKeys.detail(id), (old: Course | undefined) => {
        if (!old) return old
        return { ...old, status }
      })

      return { previousCourses }
    },

    // On error, rollback
    onError: (_err, _variables, context) => {
      if (context?.previousCourses) {
        context.previousCourses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}

/**
 * Hook to prefetch course details
 * Useful for hover states or predictive loading
 */
export const usePrefetchCourse = () => {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: courseKeys.detail(id),
      queryFn: () => fetchCourseById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}

