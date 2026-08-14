// features/landing/LandingPage.jsx
// Minimalistic landing page with top navbar

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { motion } from "framer-motion";

export default function LandingPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            SocialNet
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center space-x-6 md:flex">
                        {!isAuthenticated ? (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate("/explore")}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    Explore
                                </button>
                                <Link
                                    to={`/profile/${user?.username}`}
                                    className="flex items-center space-x-2 rounded-full bg-muted/50 px-3 py-1.5 transition-colors hover:bg-muted"
                                >
                                    <Avatar size="sm" className="h-7 w-7">
                                        {user?.avatar_url ? (
                                            <AvatarImage src={user.avatar_url} alt={user.username} />
                                        ) : (
                                            <AvatarFallback>
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="text-sm font-medium">{user?.username}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-t border-border/40 bg-background px-4 py-4 md:hidden"
                    >
                        {!isAuthenticated ? (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        navigate("/login");
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-sm font-medium text-muted-foreground"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        navigate("/register");
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full rounded-full bg-primary px-5 py-2.5 text-left text-sm font-medium text-primary-foreground"
                                >
                                    Get Started
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        navigate("/explore");
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-sm font-medium text-muted-foreground"
                                >
                                    Explore
                                </button>
                                <Link
                                    to={`/profile/${user?.username}`}
                                    className="flex items-center space-x-3 rounded-lg bg-muted/50 px-3 py-2"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Avatar size="sm" className="h-8 w-8">
                                        {user?.avatar_url ? (
                                            <AvatarImage src={user.avatar_url} alt={user.username} />
                                        ) : (
                                            <AvatarFallback>
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="text-sm font-medium">{user?.username}</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="block w-full text-left text-sm font-medium text-destructive"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <main className="pt-16">
                <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                            Connect. Share. Discover.
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                            A minimalistic social platform where you can share moments, explore content,
                            and connect with people who matter.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {!isAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="group relative overflow-hidden rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                                    >
                                        Start Exploring
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
                                    </button>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="rounded-full border border-border bg-background px-8 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        Sign In
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate("/explore")}
                                    className="group relative overflow-hidden rounded-full bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                                >
                                    Go to Explore
                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <FeatureCard
                            icon={
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            }
                            title="Share Moments"
                            description="Post photos, thoughts, and experiences with your network."
                        />
                        <FeatureCard
                            icon={
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                            title="Explore Content"
                            description="Discover trending posts and new creators to follow."
                        />
                        <FeatureCard
                            icon={
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                            title="Connect"
                            description="Build your community and engage with like-minded people."
                        />
                    </motion.div>
                </section>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-border/50 bg-card p-6 transition-colors hover:border-border hover:shadow-lg"
        >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </motion.div>
    );
}
