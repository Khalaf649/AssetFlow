"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/auth/context/AuthContext";
import { fetchUsers } from "@/app/users/api/users-api";

interface SelectedUser {
  id: string;
  name: string;
  email?: string;
}

export function useUserSearch() {
  const { token } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Open dropdown when typing (and no user selected yet), close otherwise
  useEffect(() => {
    setIsOpen(search.trim().length > 0 && !selectedUser);
  }, [search, selectedUser]);

  const { data, isFetching } = useQuery({
    queryKey: ["users", "search", debouncedSearch],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token");
      return fetchUsers(token, { page: 1, size: 6, q: debouncedSearch });
    },
    enabled: !!token && debouncedSearch.length > 0,
  });

  // Stable reference — won't change between renders
  const handleSelect = useCallback(
    (user: SelectedUser, onValueChange: (id: string) => void) => {
      setSelectedUser(user);
      setSearch(`${user.name} (${user.email ?? user.id})`);
      setIsOpen(false);
      onValueChange(user.id);
    },
    [],
  );

  // Stable reference — won't change between renders
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (!value) setSelectedUser(null);
  }, []);

  // Stable reference — safe to list as a useEffect dependency in consumers
  const reset = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedUser(null);
    setIsOpen(false);
  }, []);

  return {
    search,
    isOpen,
    isFetching,
    selectedUser,
    users: data?.items ?? [],
    handleSelect,
    handleSearchChange,
    reset,
  };
}
