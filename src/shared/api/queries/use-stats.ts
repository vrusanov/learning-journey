/**
 * React Query hooks for stats API
 */

import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "../mock-api"

// Query keys
export const statsKeys = {
  all: ["stats"] as const,
  dashboard: () => [...statsKeys.all, "dashboard"] as const,
}

/**
 * Hook to fetch dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: fetchDashboardStats,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

