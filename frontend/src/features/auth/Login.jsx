// src/features/auth/Login.jsx
// Minimalistic login page design

import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import authApi from "../../api/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await authApi.login({
                email: formData.identifier,
                password: formData.password,
            });

            setSnackbar({
                open: true,
                severity: "success",
                message: "Login successful.",
            });

            setTimeout(() => {
                navigate("/explore");
            }, 1000);
        } catch (error) {
            setSnackbar({
                open: true,
                severity: "error",
                message: error.response?.data?.detail ?? "Login failed.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center space-x-2"
                    >
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            SocialNet
                        </span>
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Back to Home
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex min-h-screen items-center justify-center px-4 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg backdrop-blur-sm">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <svg
                                    className="h-8 w-8 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sign in to continue to your account
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`flex h-11 w-full rounded-lg border ${
                                        errors.identifier
                                            ? "border-destructive"
                                            : "border-input"
                                    } bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="Enter your email"
                                    {...register("identifier", {
                                        required: "Email is required.",
                                    })}
                                />
                                {errors.identifier && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.identifier.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className={`flex h-11 w-full rounded-lg border ${
                                        errors.password
                                            ? "border-destructive"
                                            : "border-input"
                                    } bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="Enter your password"
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters.",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                ) : (
                                    <>
                                        Sign In
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:translate-x-full" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-border" />
                            <span className="px-3 text-xs text-muted-foreground">or</span>
                            <div className="flex-1 border-t border-border" />
                        </div>

                        {/* Register Link */}
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <RouterLink
                                to="/register"
                                className="font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                Create account
                            </RouterLink>
                        </p>
                    </div>

                    {/* Snackbar */}
                    {snackbar.open && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-lg ${
                                snackbar.severity === "success"
                                    ? "bg-green-600"
                                    : "bg-destructive"
                            }`}
                            onAnimationComplete={() => {
                                setTimeout(() => {
                                    setSnackbar((prev) => ({ ...prev, open: false }));
                                }, 3000);
                            }}
                        >
                            {snackbar.message}
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}