import { motion } from "framer-motion";
import { useEffect } from "react";
import useInfinitePosts from "../../hooks/useInfinitePosts";
import PostDisplay from "../../features/post/postDisplay";

export default function ProfilePosts({ username }) {
    const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfinitePosts({ author: username });

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 1000 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
            >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <svg
                        className="h-8 w-8 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                    </svg>
                </div>
                <p className="text-lg font-medium text-foreground">No posts yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    When {username} shares something, it'll appear here
                </p>
            </motion.div>
        );
    }

    return (
        <div className="mt-8 space-y-6">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Posts</h2>
                <span className="text-sm text-muted-foreground">{posts.length} posts</span>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <PostDisplay post={post} />
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            {hasNextPage && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={fetchNextPage}
                    disabled={isFetchingNextPage}
                    className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:opacity-50"
                >
                    {isFetchingNextPage ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            Load More
                        </>
                    )}
                </motion.button>
            )}
        </div>
    );
}