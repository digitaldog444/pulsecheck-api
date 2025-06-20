"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  industry: string;
  organizationId: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  newsletter: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    organizationId: "",
    company: "",
    jobTitle: "",
    industry: "",
    password: "",
    confirmPassword: "",
    terms: false,
    newsletter: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const checkPasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const score = Math.min(strength, 4);
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

    return { score, label: labels[score] || "Very Weak" };
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      alert("Please accept the Terms of Service and Privacy Policy");
      return;
    }

    if (checkPasswordStrength(formData.password).score < 2) {
      alert("Please choose a stronger password");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Registration! successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        toast.error(data.error);
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        jobTitle: "",
        organizationId: "",
        industry: "",
        password: "",
        confirmPassword: "",
        terms: false,
        newsletter: false,
      });
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} login integration would be implemented here`);
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/10 w-20 h-20 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "6s" }}
        />
        <div
          className="absolute top-3/5 right-1/6 w-30 h-30 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/5 w-15 h-15 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "4s", animationDuration: "6s" }}
        />
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 w-full max-w-lg shadow-2xl border border-white/20 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            PulseCheck
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:-translate-y-0.5 hover:border-gray-300 text-black"
            />
          </div>

          {/* Organization ID */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Organization ID
            </label>
            <input
              type="text"
              id="organizationId"
              name="organizationId"
              value={formData.organizationId}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:-translate-y-0.5 hover:border-gray-300 text-black"
            />
          </div>
          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:-translate-y-0.5 hover:border-gray-300 text-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.score
                          ? "bg-indigo-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Password strength: {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:-translate-y-0.5 hover:border-gray-300 text-black"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                required
                className="w-5 h-5 mt-0.5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-5 h-5 mt-0.5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
              />
              <label
                htmlFor="newsletter"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                Send me product updates and marketing communications
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <span className="relative z-10">
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
