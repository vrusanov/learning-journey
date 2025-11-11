import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "../mock-api"

export const statsKeys = {
  all: ["stats"] as const,
  dashboard: () => [...statsKeys.all, "dashboard"] as const,
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: fetchDashboardStats,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
