// src/features/posts/components/PostDisplay.jsx

import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Heart,
    MessageCircle,
    Clock,
    MoreHorizontal,
} from "lucide-react";
import CommentsDrawer from "../../components/comment/CommentsDrawer";
import { formatDistanceToNow } from "date-fns";
import PostDescription from "../../components/post/PostDescription";
import PostMediaCarousel from "../../components/post/PostMediaCarousel";
import likeApi from "../../api/likeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default memo(function PostDisplay({ post }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [commentsOpen, setCommentsOpen] = useState(false);

    if (!post) return null;

    // Like mutation
    const likeMutation = useMutation({
        mutationFn: () => likeApi.togglePostLike(post.id, post.is_liked),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            const previousPosts = queryClient.getQueryData(["posts"]);

            queryClient.setQueryData(["posts"], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        results: page.results.map((p) => {
                            if (p.id !== post.id) return p;
                            return {
                                ...p,
                                is_liked: !p.is_liked,
                                likes_count: p.is_liked
                                    ? p.likes_count - 1
                                    : p.likes_count + 1,
                            };
                        }),
                    })),
                };
            });

            return { previousPosts };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });

    // Data
    const createdAt = post.created_at || post.createdAt;
    const timeAgo = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        : "";

    // Event handlers
    const handleAuthorClick = () => {
        if (!post.author?.username) return;
        navigate(`/profile/${post.author.username}`);
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        likeMutation.mutate();
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        setCommentsOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
                {/* Header */}
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAuthorClick}
                            className="flex-shrink-0"
                        >
                            <img
                                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username}&background=8b5cf6&color=fff`}
                                alt={post.author?.username}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800"
                            />
                        </motion.button>

                        <div className="flex-1 min-w-0">
                            <motion.button
                                whileHover={{ x: 2 }}
                                onClick={handleAuthorClick}
                                className="text-left"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                                    {post.author?.username}
                                </h3>
                            </motion.button>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {timeAgo}
                                </span>
                            </div>
                        </div>

                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Media */}
                <PostMediaCarousel media={post.media} />

                {/* Actions & Description */}
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLikeClick}
                            className={`flex items-center gap-1.5 transition-colors ${
                                post.is_liked
                                    ? 'text-red-500'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                            }`}
                        >
                            <motion.div
                                animate={post.is_liked ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                {post.is_liked ? (
                                    <Heart className="w-6 h-6 fill-current" />
                                ) : (
                                    <Heart className="w-6 h-6" />
                                )}
                            </motion.div>
                            <span className="text-sm font-medium">
                                {post.likes_count ?? 0}
                            </span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCommentClick}
                            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-sm font-medium">
                                {post.comments_count ?? 0}
                            </span>
                        </motion.button>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                        <PostDescription content={post.content} />
                    </div>
                </div>
            </motion.div>

            <CommentsDrawer
                open={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                postId={post.id}
                commentsCount={post.comments_count ?? 0}
            />
        </>
    );
});
