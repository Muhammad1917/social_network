import { motion } from "framer-motion";
import { Button } from "../ui/button";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHeader({ profile, isOwner, onEdit }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8 overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm backdrop-blur-sm sm:p-8"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/20" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                {/* Avatar */}
                <ProfileAvatar
                    src={profile.profile_picture_url}
                    username={profile.username}
                    size="xl"
                />

                {/* Info Section */}
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {profile.name || profile.username}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>

                    {profile.bio && (
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats Row */}
                    <div className="mt-6 flex items-center justify-center gap-6 sm:justify-start">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                                {profile.posts_count ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                                {profile.followers_count ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div className="text-center">
                            <p className="text-lg font-semibold text-foreground">
                                {profile.following_count ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Following</p>
                        </div>
                    </div>

                    {/* Edit Button */}
                    {isOwner && (
                        <div className="mt-6">
                            <Button
                                variant="outline"
                                onClick={onEdit}
                                className="rounded-full px-6 transition-all hover:shadow-md"
                            >
                                <svg
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit Profile
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}