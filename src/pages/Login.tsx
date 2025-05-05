
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Graduation } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-brand-purple/20 to-white/80">
      <div className="w-full max-w-md animate-fade-in space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple text-white">
            <Graduation className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">Welcome to Bright Spark Academy</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-brand-purple hover:text-brand-purple-dark"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-brand-purple hover:bg-brand-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            Demo accounts (all use password "password"):
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-gray-50 p-2">
                super_admin@brightspark.com
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                school@brightspark.com
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                teacher@brightspark.com
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                student@brightspark.com
              </div>
              <div className="rounded-md bg-gray-50 p-2">
                parent@brightspark.com
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
