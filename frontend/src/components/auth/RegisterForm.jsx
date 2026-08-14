// src/components/auth/RegisterForm.jsx

import { useState } from "react";

import {
    Alert,
    Button,
    Link,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import { useNavigate, Link as RouterLink } from "react-router-dom";

import { useForm } from "react-hook-form";

import authApi from "../../api/authApi";

export default function RegisterForm() {
    console.log("[RegisterForm] Render");
    const Navigate = useNavigate()
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

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const password = watch("password");

    const onSubmit = async (formData) => {
        console.group("[Register]");
        console.log("Submitted Data:", formData);

        setLoading(true);

        try {
            /**
             * TODO
             * Replace with React Query mutation.
             */

            const response = await authApi.register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
            });

            console.log("Register Response:", response);

            setSnackbar({
                open: true,
                severity: "success",
                message: "Registration successful.",
            });

            /**
             * TODO
             * Navigate user to Login page.
             *
             * Example:
             * navigate("/login");
             */
            
            Navigate("/login");
        } catch (error) {
            console.error("[Register Error]", error);

            /**
             * TODO
             * Map backend validation errors properly.
             *
             * Example:
             *
             * if(error.response?.data?.username){
             *     setError(...)
             * }
             */

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
                message:
                    error.response?.data?.detail ??
                    "Registration failed.",
            });

        } finally {
            setLoading(false);
            console.groupEnd();
        }
    };

    return (
        <>
            <Paper
                elevation={5}
                sx={{
                    width: 450,
                    p: 4,
                }}
            >
                <Stack spacing={3}>

                    <Typography
                        variant="h4"
                        textAlign="center"
                        fontWeight="bold"
                    >
                        Register
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register("email", {
                            required: "Email is required.",
                            maxLength: {
                                value: 254, // Matches Django's EmailField max_length
                                message: "Email must not exceed 254 characters.",
                            },
                            pattern: {
                                // Django-compatible practical email validation
                                // Final validation is still performed by Djoser/Django backend.
                                value:
                                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address.",
                            },
                        })}
                    />

                    <TextField
                        label="Username"
                        fullWidth
                        error={!!errors.username}
                        helperText={errors.username?.message}
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
                                message:
                                    "Only lowercase letters, numbers and underscore are allowed.",
                            },
                        })}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters.",
                            },
                            validate: {
                                hasUppercase: value =>
                                    /[A-Z]/.test(value) ||
                                    "Must contain one uppercase letter.",
                                hasLowercase: value =>
                                    /[a-z]/.test(value) ||
                                    "Must contain one lowercase letter.",
                                hasNumber: value =>
                                    /\d/.test(value) ||
                                    "Must contain one number.",
                            },
                        })}
                    />

                    <TextField
                        label="Repeat Password"
                        type="password"
                        fullWidth
                        error={!!errors.repeatPassword}
                        helperText={errors.repeatPassword?.message}
                        {...register("repeatPassword", {
                            required: "Please repeat your password.",
                            validate: value =>
                                value === password ||
                                "Passwords do not match.",
                        })}
                    />

                    <LoadingButton
                        variant="contained"
                        fullWidth
                        loading={loading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Register
                    </LoadingButton>

                    <Typography
                        variant="body2"
                        textAlign="center"
                    >
                        Already have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/login"
                        >
                            Login
                        </Link>
                    </Typography>

                </Stack>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar(prev => ({
                        ...prev,
                        open: false,
                    }))
                }
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}