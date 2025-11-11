# React Query Integration Feature

> **Branch:** `feature/react-query-api`  
> **Status:** ✅ Complete and Production-Ready

## 🎯 Overview

This feature branch demonstrates professional implementation of **TanStack Query (React Query)** for API-driven data fetching, caching, and state management. It showcases best practices for building scalable, performant React applications with server state management.

## ✨ What's New

### 1. **Mock API Layer** (`src/shared/api/mock-api.ts`)

A realistic mock API that simulates backend behavior:

- ✅ **Network delays** (300-600ms) to simulate real API calls
- ✅ **Random failures** (5% chance) for error handling testing
- ✅ **Custom ApiError** class with HTTP status codes
- ✅ **Full CRUD operations** for courses and users
- ✅ **Filtering and pagination** support
- ✅ **TypeScript-first** with complete type safety

**API Endpoints:**
```typescript
// Courses
fetchCourses(params?: FetchCoursesParams)
fetchCourseById(id: string)
updateCourseStatus(id: string, status: Course["status"])

// Users
fetchLeaderboard(params?: FetchLeaderboardParams)
fetchCurrentUser()
updateUserProfile(userId: string, updates: Partial<User>)

// Stats
fetchDashboardStats()
```

### 2. **React Query Hooks** (`src/shared/api/queries/`)

Professional query hooks with advanced features:

#### **Courses Hooks** (`use-courses.ts`)
```typescript
useCourses(params?: FetchCoursesParams)        // Fetch with filters
useCourse(id: string)                          // Fetch single course
useUpdateCourseStatus()                        // Mutation with optimistic updates
usePrefetchCourse()                            // Prefetch for hover states
```

#### **Users Hooks** (`use-users.ts`)
```typescript
useCurrentUser()                               // Fetch current user
useLeaderboard(params?)                        // Fetch leaderboard
useInfiniteLeaderboard(limit)                  // Infinite scroll support
useUpdateUserProfile()                         // Update profile mutation
```

#### **Stats Hooks** (`use-stats.ts`)
```typescript
useDashboardStats()                            // Fetch dashboard statistics
```

### 3. **Query-Powered Components**

#### **DashboardStatsQuery** (`src/widgets/dashboard/ui/dashboard-stats-query.tsx`)
- Fetches stats from API instead of props
- Loading skeletons
- Error handling with retry
- Animated counters

#### **CoursesGridQuery** (`src/widgets/courses-grid/ui/courses-grid-query.tsx`)
- Fetches courses with filters
- Loading states
- Error boundaries
- Reuses existing CoursesGrid component

#### **AppWithQuery** (`src/app/app-with-query.tsx`)
- Demo app showcasing React Query features
- Tabbed interface with different filters
- React Query DevTools integration

### 4. **QueryClient Configuration** (`src/main.tsx`)

Optimized global configuration:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,                      // Retry failed requests once
      refetchOnWindowFocus: false,   // Don't refetch on window focus
      staleTime: 60 * 1000,          // 1 minute default stale time
    },
    mutations: {
      retry: 0,                      // Don't retry mutations
    },
  },
})
```

## 🏗️ Architecture

### Query Key Factories

Structured query keys for efficient cache management:

```typescript
// Courses
courseKeys = {
  all: ["courses"],
  lists: () => ["courses", "list"],
  list: (filters) => ["courses", "list", filters],
  details: () => ["courses", "detail"],
  detail: (id) => ["courses", "detail", id],
}

// Users
userKeys = {
  all: ["users"],
  current: () => ["users", "current"],
  leaderboard: () => ["users", "leaderboard"],
  leaderboardList: (params) => ["users", "leaderboard", params],
}

// Stats
statsKeys = {
  all: ["stats"],
  dashboard: () => ["stats", "dashboard"],
}
```

### Optimistic Updates

Mutations implement optimistic updates with rollback:

```typescript
useUpdateCourseStatus = useMutation({
  mutationFn: updateCourseStatus,
  
  // Optimistically update cache
  onMutate: async ({ id, status }) => {
    await queryClient.cancelQueries({ queryKey: courseKeys.lists() })
    const previousCourses = queryClient.getQueriesData(...)
    queryClient.setQueriesData(...) // Update cache
    return { previousCourses }
  },
  
  // Rollback on error
  onError: (err, variables, context) => {
    queryClient.setQueriesData(context.previousCourses)
  },
  
  // Refetch after success/error
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
  },
})
```

## 📊 Benefits

### Performance
- ✅ **Automatic caching** - Reduces unnecessary API calls
- ✅ **Background refetching** - Keeps data fresh
- ✅ **Request deduplication** - Multiple components, single request
- ✅ **Prefetching** - Predictive data loading

### Developer Experience
- ✅ **DevTools** - Visual query inspector
- ✅ **TypeScript** - Full type safety
- ✅ **Loading states** - Built-in loading/error states
- ✅ **Optimistic updates** - Instant UI feedback

### User Experience
- ✅ **Instant feedback** - Optimistic updates
- ✅ **Smooth loading** - Skeleton states
- ✅ **Error recovery** - Automatic retries
- ✅ **Fresh data** - Background refetching

## 🚀 Usage Examples

### Basic Query

```typescript
function CoursesList() {
  const { data, isLoading, isError, error } = useCourses()
  
  if (isLoading) return <Loader />
  if (isError) return <Alert>{error.message}</Alert>
  
  return <CoursesGrid courses={data.courses} />
}
```

### Query with Filters

```typescript
function OngoingCourses() {
  const { data } = useCourses({ status: "ongoing" })
  return <CoursesGrid courses={data?.courses || []} />
}
```

### Mutation with Optimistic Update

```typescript
function CourseCard({ course }) {
  const updateStatus = useUpdateCourseStatus()
  
  const handleComplete = () => {
    updateStatus.mutate({ 
      id: course.id, 
      status: "completed" 
    })
  }
  
  return <Button onClick={handleComplete}>Complete</Button>
}
```

### Infinite Scroll

```typescript
function InfiniteLeaderboard() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLeaderboard(10)
  
  return (
    <>
      {data.pages.map(page => 
        page.users.map(user => <UserCard key={user.id} user={user} />)
      )}
      {hasNextPage && (
        <Button onClick={fetchNextPage} loading={isFetchingNextPage}>
          Load More
        </Button>
      )}
    </>
  )
}
```

## 🧪 Testing the Feature

### Run Development Server

```bash
npm run dev
```

### Test Different Scenarios

1. **Loading States** - Refresh page to see skeleton loaders
2. **Error Handling** - Mock API has 5% failure rate
3. **Caching** - Switch tabs and see instant data from cache
4. **Optimistic Updates** - Update course status (instant UI feedback)
5. **DevTools** - Open React Query DevTools (bottom-left icon)

### React Query DevTools

The DevTools show:
- All active queries
- Query status (fresh, stale, fetching)
- Cache data
- Query timeline
- Mutations

## 📝 Best Practices Implemented

### 1. **Query Key Management**
- Hierarchical query keys
- Factory functions for consistency
- Easy cache invalidation

### 2. **Error Handling**
- Custom ApiError class
- Proper error boundaries
- User-friendly error messages

### 3. **Loading States**
- Skeleton loaders
- Loading indicators
- Optimistic updates

### 4. **Type Safety**
- Full TypeScript coverage
- Strict mode enabled
- No `any` types

### 5. **Performance**
- Stale time configuration
- Cache time optimization
- Request deduplication
- Prefetching strategies

## 🔄 Migration Path

To migrate existing components to React Query:

1. **Replace prop drilling** with `useCourses()` hook
2. **Remove local state** for server data
3. **Add loading/error states** using query status
4. **Implement mutations** for data updates
5. **Add optimistic updates** for better UX

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [Query Key Factories](https://tkdodo.eu/blog/effective-react-query-keys)

## 🎓 Learning Outcomes

This implementation demonstrates:

- ✅ Professional React Query setup
- ✅ Mock API design patterns
- ✅ Optimistic updates implementation
- ✅ Cache management strategies
- ✅ TypeScript best practices
- ✅ Error handling patterns
- ✅ Loading state management
- ✅ Performance optimization

---

**Ready for production!** This feature can be merged to main and deployed immediately.

