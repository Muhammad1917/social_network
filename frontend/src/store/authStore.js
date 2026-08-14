// src/store/authStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * ============================================================
 * Authentication Store
 * ============================================================
 *
 * Responsibilities
 * ----------------
 * - Authentication state
 * - Current user
 * - JWT Tokens
 * - Persistence
 * - Login / Logout
 * - App initialization
 *
 * React components should NEVER access localStorage directly.
 *
 */

export const useAuthStore = create(
    persist(
        (set, get) => ({

            /**
             * ===================================================
             * State
             * ===================================================
             */

            user: null,

            accessToken: null,

            refreshToken: null,

            isAuthenticated: false,

            /**
             * Used while restoring persisted auth state.
             */
            isInitializing: true,

            /**
             * ===================================================
             * Actions
             * ===================================================
             */

            /**
             * Save logged-in user.
             */
            setUser: (user) => {

                console.log("[Auth Store] setUser");

                set({
                    user,
                });

            },

            /**
             * Save JWT tokens.
             */
            setTokens: ({ access, refresh }) => {

                console.log("[Auth Store] setTokens");

                set({

                    accessToken: access,

                    refreshToken: refresh ?? get().refreshToken,

                    isAuthenticated: !!access,

                });
                

            },

            /**
             * Login
             *
             * Expected response:
             *
             * {
             *      access,
             *      refresh,
             *      user
             * }
             */
            login: ({ user, accessToken, refreshToken }) => {

                console.group("[Auth Store] Login");


                set({

                    user,

                    accessToken,

                    refreshToken,

                    isAuthenticated: true,

                });

                console.groupEnd();

            },

            /**
             * Logout
             */
            logout: () => {

                console.group("[Auth Store] Logout");

                set({

                    user: null,

                    accessToken: null,

                    refreshToken: null,

                    isAuthenticated: false,

                });

                console.groupEnd();

                /**
                 * TODO
                 *
                 * Later:
                 *
                 * navigate("/login")
                 *
                 * or
                 *
                 * invalidate React Query cache
                 *
                 */

            },

            /**
             * Remove everything.
             */
            clear: () => {

                console.log("[Auth Store] Clear");

                set({

                    user: null,

                    accessToken: null,

                    refreshToken: null,

                    isAuthenticated: false,

                });

            },

            /**
             * Restore completed.
             */
            finishInitialization: () => {

                console.log("[Auth Store] Initialized");

                set({

                    isInitializing: false,

                });

            },

            /**
             * ===================================================
             * Helpers
             * ===================================================
             */

            getAccessToken: () => {

                return get().accessToken;

            },

            getRefreshToken: () => {

                return get().refreshToken;

            },

            hasRole: (role) => {

                /**
                 * TODO
                 *
                 * Depends on backend.
                 *
                 */

                return get().user?.role === role;

            },

        }),

        {
            name: "auth-storage",

            storage: createJSONStorage(() => localStorage),

            /**
             * Persist only what is needed.
             */
            partialize: (state) => ({

                user: state.user,

                accessToken: state.accessToken,

                refreshToken: state.refreshToken,

                isAuthenticated: state.isAuthenticated,

            }),

            /**
             * Called after Zustand restores persisted data.
             */
            onRehydrateStorage: () => (state) => {

                console.log("[Auth Store] Rehydrated");

                state?.finishInitialization();

            },

        }
    )
);