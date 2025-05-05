
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContextType, LoginCredentials, User } from "@/types/auth";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Super Admin",
    email: "admin@brightspark.com",
    role: "super_admin",
    avatar: "/assets/avatars/super-admin.png"
  },
  {
    id: "2",
    name: "School Admin",
    email: "school@brightspark.com",
    role: "school_admin",
    schoolId: "1",
    avatar: "/assets/avatars/school-admin.png"
  },
  {
    id: "3",
    name: "Teacher",
    email: "teacher@brightspark.com",
    role: "teacher",
    schoolId: "1",
    avatar: "/assets/avatars/teacher.png"
  },
  {
    id: "4",
    name: "Student",
    email: "student@brightspark.com",
    role: "student",
    schoolId: "1",
    avatar: "/assets/avatars/student.png"
  },
  {
    id: "5",
    name: "Parent",
    email: "parent@brightspark.com",
    role: "parent",
    schoolId: "1",
    avatar: "/assets/avatars/parent.png"
  }
] as User[];

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email (mock authentication)
      const foundUser = mockUsers.find(u => u.email === email);

      if (foundUser && password === "password") {  // Simplified for demo
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        
        // Navigate based on role
        let redirectPath = "/dashboard";
        navigate(redirectPath);
        
        toast.success("Logged in successfully!");
      } else {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
