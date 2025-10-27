import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

/**
 * Fetches the current user's data from the backend.
 * This function communicates with the GET /auth/user endpoint.
 */
const fetchAuthenticatedUser = async (): Promise<User> => {
  const response = await fetch("/auth/user");

  // If the server returns an error (like 401 Unauthorized), it means
  // the user is not logged in. We throw an error to signal to
  // React Query that the request failed.
  if (!response.ok) {
    throw new Error("User not authenticated");
  }

  // If the request was successful, parse the JSON and return the user data.
  return response.json();
};

/**
 * A custom hook to manage the user's authentication state.
 * It provides the user object, a loading state, and an isAuthenticated flag.
 */
export function useAuth() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    // This is the unique identifier for this query in React Query's cache.
    queryKey: ["authenticatedUser"],

    // This is the function that React Query will call to fetch the data.
    queryFn: fetchAuthenticatedUser,

    // It's important to disable retries for auth checks. If it fails once,
    // the user is simply not logged in, and we don't need to try again.
    retry: false,
    
    // This prevents the query from refetching on every window focus,
    // which is good practice for a stable user session check.
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    // The user is authenticated only if the query was successful (no error)
    // and the user object exists.
    isAuthenticated: !!user && !isError,
  };
}
