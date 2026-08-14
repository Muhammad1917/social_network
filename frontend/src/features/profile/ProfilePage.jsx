import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useProfile } from "../../hooks/useProfile";
import ProfileHeader from "../../components/profile/ProfileHeader";
import EditProfileDialog from "../../components/profile/EditProfileDialog";
import ProfilePosts from "../../components/profile/ProfilePosts";

export default function ProfilePage() {
    const { username } = useParams();
    const user = useAuthStore.getState().user;

    const { data: profile, isLoading } = useProfile(username);

    const [editOpen, setEditOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            </div>
        );
    }

    const isOwner = user?.username === username;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
        >
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <ProfileHeader
                    profile={profile}
                    isOwner={isOwner}
                    onEdit={() => setEditOpen(true)}
                />

                <ProfilePosts username={username} />

                {isOwner && (
                    <EditProfileDialog
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        profile={profile}
                    />
                )}
            </div>
        </motion.div>
    );
}