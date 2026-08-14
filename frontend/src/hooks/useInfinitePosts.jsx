import { useInfiniteQuery } from "@tanstack/react-query";
import postApi from "../api/postApi";

/**
 * Generic infinite posts hook.
 *
 * Can be used for:
 * - Explore page
 * - User profile
 * - Search
 * - Hashtag pages
 */

export default function useInfinitePosts(params = {}) {
    const query =  useInfiniteQuery({
        //----------------------------------------
        // Cache Key
        //----------------------------------------

        queryKey: ["posts", params],

        //----------------------------------------
        // Query Function
        //----------------------------------------

        queryFn: async ({ pageParam = 1 }) => {
            console.log("========== FETCH POSTS ==========");
            console.log("Page:", pageParam);
            console.log("Filters:", params);

            const response = await postApi.getPosts({
                page: pageParam,
                ...params,
            });

            console.log("Posts Response:", response);

            return response;
        },

        //----------------------------------------
        // Pagination
        //----------------------------------------

        getNextPageParam: (lastPage) => {
            console.log("Checking next page...");

            if (!lastPage.next) {
                console.log("No more pages.");

                return undefined;
            }


            try {
                const nextUrl = new URL(lastPage.next);

                const page = nextUrl.searchParams.get("page");

                console.log("Next page:", page);

                return Number(page);
            } catch (error) {
                console.error(
                    "Failed parsing next page URL:",
                    error
                );

                return undefined;
            }
        },

        //----------------------------------------
        // Query Options
        //----------------------------------------

        initialPageParam: 1,

        staleTime: 1000 * 60 * 5,

        gcTime: 1000 * 60 * 30,

        retry: 1,

        refetchOnWindowFocus: false,

        refetchOnReconnect: true,
    });
            return {
            ...query,
            posts:
                query.data?.pages.flatMap(
                page => page.results
            ) ?? [],
        };
}