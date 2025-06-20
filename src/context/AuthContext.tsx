import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

// --- TYPE DEFINITIONS ---
// This defines the structure of the User object we'll use throughout the app.
interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  avatarUrl?: string;
}

// This defines the shape of the data and functions our AuthContext will provide.
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

// --- CONTEXT CREATION ---
// We create the context with a default value of `undefined`.
// This helps catch errors where a component tries to use the context without being wrapped in the provider.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- AUTH PROVIDER COMPONENT ---
// This component will wrap our entire application, providing the auth context to all children.
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true to check session

  // On initial load, check for an existing session.
  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
          }),
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        toast.error("Session check failed:" + error);
      } finally {
        setIsLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Login failed:" + error);
      throw error; // Re-throw to be caught by the UI
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Registration failed: " + error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User logged out.");
  };

  // The value provided to consuming components.
  const value = {
    user,
    isAuthenticated: !!user, // Double-bang converts the user object to a boolean
    isLoading,
    token,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- CUSTOM HOOK ---
// This is the preferred way to consume the context.
// It provides a clean interface and an error check.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/*
--- HOW TO USE THIS AUTH CONTEXT ---

1. Wrap your root component (e.g., `_app.tsx` in Next.js) with the `<AuthProvider>`:
   
   // pages/_app.tsx
   import { AuthProvider } from '../contexts/AuthContext'; // Adjust path
   
   function MyApp({ Component, pageProps }) {
     return (
       <AuthProvider>
         <Component {...pageProps} />
       </AuthProvider>
     );
   }
   
   export default MyApp;

2. Use the `useAuth` hook in any component that needs auth data or functions:

   import { useAuth } from '../contexts/AuthContext';
   
   const MyComponent = () => {
     const { isAuthenticated, user, login, logout, isLoading } = useAuth();
     
     if (isLoading) {
       return <div>Loading...</div>;
     }
     
     if (isAuthenticated) {
       return (
         <div>
           <p>Welcome, {user?.name}!</p>
           <button onClick={logout}>Log Out</button>
         </div>
       );
     }
     
     return <button onClick={() => login('manager@foresite.com', 'password123')}>Log In</button>;
   };

*/
