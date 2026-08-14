// src/components/auth/LoginForm.jsx

import { useState } from "react";

import {
    Alert,
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
import { useAuthStore } from "@/src/store/authStore";

export default function LoginForm() {
    const Navigate = useNavigate()
    console.log("[LoginForm] Render");

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

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const onSubmit = async (formData) => {

        console.group("[Login]");
        console.log("Submitted Data:", formData);

        setLoading(true);
    
        try {

            /**
             * TODO
             *
             * Replace this with React Query useMutation()
             * after we create authentication hooks.
             */

            const response = await authApi.login({
                email: formData.identifier,
                password: formData.password,
            });
            const username = useAuthStore.getState().username;
            console.log("Login Response:", response);

            setSnackbar({
                open: true,
                severity: "success",
                message: "Login successful.",
            });

            /**
             * TODO
             *
             * Save authenticated user
             * inside Zustand store.
             */

            /**
             * TODO
             *
             * Navigate to dashboard/feed/profile.
             */
            
            Navigate(`/profile/${username}`)
        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error.response?.data?.detail ??
                    "Login failed.",
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
                    width: 420,
                    p: 4,
                }}
            >

                <Stack spacing={3}>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        textAlign="center"
                    >
                        Login
                    </Typography>

                    <TextField
                        label="Email"
                        fullWidth
                        error={!!errors.identifier}
                        helperText={errors.identifier?.message}
                        {...register("identifier", {
                            required:
                                "Email is required.",
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
                                message:
                                    "Password must be at least 8 characters.",
                            },
                        })}
                    />

                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit(onSubmit)}
                    >
                        Login
                    </LoadingButton>

                    <Typography
                        variant="body2"
                        textAlign="center"
                    >
                        Don't have an account?{" "}
                        <Link
                            component={RouterLink}
                            to="/register"
                        >
                            Register
                        </Link>
                    </Typography>

                </Stack>

            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((prev) => ({
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