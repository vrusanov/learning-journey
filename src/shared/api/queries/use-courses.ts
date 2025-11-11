import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchCourses,
  fetchCourseById,
  updateCourseStatus,
  FetchCoursesParams,
  FetchCoursesResponse,
} from "../mock-api"
import { Course } from "../../types/course"

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters?: FetchCoursesParams) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
}

export const useCourses = (params?: FetchCoursesParams) => {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => fetchCourses(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => fetchCourseById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}

export const useUpdateCourseStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Course["status"] }) => updateCourseStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: courseKeys.lists() })

      const previousCourses = queryClient.getQueriesData({ queryKey: courseKeys.lists() })

      queryClient.setQueriesData({ queryKey: courseKeys.lists() }, (old: FetchCoursesResponse | undefined) => {
        if (!old?.courses) return old

        return {
          ...old,
          courses: old.courses.map((course: Course) => (course.id === id ? { ...course, status } : course)),
        }
      })

      queryClient.setQueryData(courseKeys.detail(id), (old: Course | undefined) => {
        if (!old) return old
        return { ...old, status }
      })

      return { previousCourses }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCourses) {
        context.previousCourses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}

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
