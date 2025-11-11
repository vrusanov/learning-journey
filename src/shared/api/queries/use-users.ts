/**
 * React Query hooks for users API
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import {
  fetchLeaderboard,
  fetchCurrentUser,
  updateUserProfile,
  FetchLeaderboardParams,
} from "../mock-api"
import { User } from "../../types/user"

// Query keys
export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "current"] as const,
  leaderboard: () => [...userKeys.all, "leaderboard"] as const,
  leaderboardList: (params?: FetchLeaderboardParams) => [...userKeys.leaderboard(), params] as const,
}

/**
 * Hook to fetch current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: fetchCurrentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to fetch leaderboard with pagination
 */
export const useLeaderboard = (params?: FetchLeaderboardParams) => {
  return useQuery({
    queryKey: userKeys.leaderboardList(params),
    queryFn: () => fetchLeaderboard(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Hook to fetch leaderboard with infinite scroll
 */
export const useInfiniteLeaderboard = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...userKeys.leaderboard(), "infinite", limit],
    queryFn: ({ pageParam = 0 }) =>
      fetchLeaderboard({
        limit,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined
      return allPages.length * limit
    },
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Hook to update user profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<Pick<User, "name" | "avatar">> }) =>
      updateUserProfile(userId, updates),

    // Optimistic update
    onMutate: async ({ updates }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.current() })

      const previousUser = queryClient.getQueryData(userKeys.current())

      queryClient.setQueryData(userKeys.current(), (old: User | undefined) => {
        if (!old) return old
        return { ...old, ...updates }
      })

      return { previousUser }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.current(), context.previousUser)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.current() })
      queryClient.invalidateQueries({ queryKey: userKeys.leaderboard() })
    },
  })
}

