"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

const syncToken = (token) => {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem("learnnext-token", token);
    document.cookie = `auth_token=${token}; Path=/; Max-Age=604800; SameSite=Lax`;
    return;
  }

  window.localStorage.removeItem("learnnext-token");
  document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
};

const getErrorMessage = (error) =>
  error?.message ||
  error?.errors?.[0]?.msg ||
  "Something went wrong. Please try again.";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      isHydrated: false,
      authError: null,

      markHydrated: () => set({ isHydrated: true }),

      login: async (values) => {
        set({ loading: true, authError: null });

        try {
          const { data } = await api.post("/auth/login", values);
          syncToken(data.token);
          set({
            user: data.user,
            token: data.token,
            loading: false,
          });
          return data;
        } catch (error) {
          const message = getErrorMessage(error);
          set({ loading: false, authError: message });
          throw new Error(message);
        }
      },

      register: async (values) => {
        set({ loading: true, authError: null });

        try {
          const { data } = await api.post("/auth/register", values);
          syncToken(data.token);
          set({
            user: data.user,
            token: data.token,
            loading: false,
          });
          return data;
        } catch (error) {
          const message = getErrorMessage(error);
          set({ loading: false, authError: message });
          throw new Error(message);
        }
      },

      forgotPassword: async (values) => {
        set({ loading: true, authError: null });

        try {
          const { data } = await api.post("/auth/forgot-password", values);
          set({ loading: false });
          return data;
        } catch (error) {
          const message = getErrorMessage(error);
          set({ loading: false, authError: message });
          throw new Error(message);
        }
      },

      resetPassword: async (resetToken, values) => {
        set({ loading: true, authError: null });

        try {
          const { data } = await api.post(`/auth/reset-password/${resetToken}`, values);
          syncToken(data.token);
          set({
            user: data.user,
            token: data.token,
            loading: false,
          });
          return data;
        } catch (error) {
          const message = getErrorMessage(error);
          set({ loading: false, authError: message });
          throw new Error(message);
        }
      },

      fetchProfile: async () => {
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data.user });
          return data.user;
        } catch (error) {
          syncToken(null);
          set({ user: null, token: null });
          return null;
        }
      },

      logout: () => {
        syncToken(null);
        set({
          user: null,
          token: null,
          authError: null,
        });
      },
    }),
    {
      name: "learnnext-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          syncToken(state.token);
        }

        state?.markHydrated?.();
      },
    }
  )
);
