"use client";
import React, { useState } from "react";
import {
  Hammer,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const ForeSiteLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    const response = await fetch("/api/auth/login-organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("organization_token", data.token);
      localStorage.setItem("organization", JSON.stringify(data.organization));
      window.location.href = "/dashboard";
    } else {
      toast.error(data.error);
    }
    setIsLoading(false);
  };

  const features = [
    {
      icon: BarChart3,
      title: "AI-Powered Insights",
      description:
        "Predict project delays and optimize cash flow with intelligent forecasting",
    },
    {
      icon: Users,
      title: "Resource Management",
      description:
        "Streamline subcontractor scheduling and equipment allocation",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Monitor project progress and budgets with live updates",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Industry-standard security with automated compliance reporting",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo and Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Hammer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">ForeSite</h1>
                <p className="text-blue-100 text-sm">
                  Construction Management Platform
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Build smarter with AI-powered project management
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Transform your construction business with predictive insights,
                automated workflows, and intelligent resource management.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <CheckCircle key={i} className="w-4 h-4 text-yellow-400" />
              ))}
            </div>
            <p className="text-white font-medium mb-2">
              "ForeSite helped us reduce project overruns by 35% and improved
              our cash flow predictability."
            </p>
            <p className="text-blue-100 text-sm">
              — Sarah Mitchell, Project Manager at Brisbane Builders
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Hammer className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ForeSite</h1>
              <p className="text-gray-300 text-sm">Construction Management</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">Sign in to your ForeSite account</p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to ForeSite?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Start your free trial →
              </a>
            </div>

            {/* Demo Account */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center mb-2">
                Demo Account
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <strong>Email:</strong> demo@foresite.com
                </p>
                <p>
                  <strong>Password:</strong> demo123
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>© 2025 ForeSite. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-gray-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-300">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForeSiteLogin;
