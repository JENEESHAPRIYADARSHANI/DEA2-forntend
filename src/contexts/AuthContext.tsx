import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@starbags.com",
    password: "admin123",
    user: { id: "1", email: "admin@starbags.com", name: "Admin User", role: "admin" },
  },
  {
    email: "user@example.com",
    password: "user123",
    user: { id: "2", email: "user@example.com", name: "John Customer", role: "user" },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("starbags_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.user);
      localStorage.setItem("starbags_user", JSON.stringify(foundUser.user));
      return { success: true };
    }

    // Check registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("starbags_registered_users") || "[]");
    const registeredUser = registeredUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (registeredUser) {
      const userObj: User = {
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.name,
        role: "user",
      };
      setUser(userObj);
      localStorage.setItem("starbags_user", JSON.stringify(userObj));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password" };
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    const existingMockUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingMockUser) {
      return { success: false, error: "Email already exists" };
    }

    const registeredUsers = JSON.parse(localStorage.getItem("starbags_registered_users") || "[]");
    const existingUser = registeredUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    // Register new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };
    registeredUsers.push(newUser);
    localStorage.setItem("starbags_registered_users", JSON.stringify(registeredUsers));

    // Auto-login after registration
    const userObj: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: "user",
    };
    setUser(userObj);
    localStorage.setItem("starbags_user", JSON.stringify(userObj));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("starbags_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
