// src/features/auth/Register.jsx
// Minimalistic register page design

import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import authApi from "../../api/authApi";

export default function Register() {
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
        watch,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            username: "",
            password: "",
            repeatPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await authApi.register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
            });

            setSnackbar({
                open: true,
                severity: "success",
                message: "Registration successful. Redirecting to login...",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            if (error.response?.data?.username) {
                setError("username", {
                    type: "server",
                    message: error.response.data.username[0],
                });
            }
            if (error.response?.data?.email) {
                setError("email", {
                    type: "server",
                    message: error.response.data.email[0],
                });
            }

            setSnackbar({
                open: true,
                severity: "error",
                message: error.response?.data?.detail ?? "Registration failed.",
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
            <main className="flex min-h-screen items-center justify-center px-4 pt-16 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
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
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Join our community today
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className={`flex h-11 w-full rounded-lg border ${
                                        errors.email
                                            ? "border-destructive"
                                            : "border-input"
                                    } bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="Enter your email"
                                    {...register("email", {
                                        required: "Email is required.",
                                        maxLength: {
                                            value: 254,
                                            message: "Email must not exceed 254 characters.",
                                        },
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Enter a valid email address.",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    className={`flex h-11 w-full rounded-lg border ${
                                        errors.username
                                            ? "border-destructive"
                                            : "border-input"
                                    } bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="Choose a username"
                                    {...register("username", {
                                        required: "Username is required.",
                                        minLength: {
                                            value: 3,
                                            message: "Minimum length is 3.",
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: "Maximum length is 30.",
                                        },
                                        pattern: {
                                            value: /^[a-z0-9_]+$/,
                                            message: "Only lowercase letters, numbers and underscore are allowed.",
                                        },
                                    })}
                                />
                                {errors.username && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.username.message}
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
                                    placeholder="Create a password"
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters.",
                                        },
                                        validate: {
                                            hasUppercase: (value) =>
                                                /[A-Z]/.test(value) || "Must contain one uppercase letter.",
                                            hasLowercase: (value) =>
                                                /[a-z]/.test(value) || "Must contain one lowercase letter.",
                                            hasNumber: (value) =>
                                                /\d/.test(value) || "Must contain one number.",
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className={`flex h-11 w-full rounded-lg border ${
                                        errors.repeatPassword
                                            ? "border-destructive"
                                            : "border-input"
                                    } bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
                                    placeholder="Confirm your password"
                                    {...register("repeatPassword", {
                                        required: "Please repeat your password.",
                                        validate: (value) =>
                                            value === password || "Passwords do not match.",
                                    })}
                                />
                                {errors.repeatPassword && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.repeatPassword.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative mt-6 flex w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        Create Account
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

                        {/* Login Link */}
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <RouterLink
                                to="/login"
                                className="font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                Sign in
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