import React, { useState } from "react";
import { LockKeyhole, User, LogIn } from "lucide-react";

import "../App.css";
import { supabase } from "../supabase";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // ==========================================
    // USERNAME CHECK
    // ==========================================

    if (username.trim().toLowerCase() !== "admin") {
      setError("Invalid username or password.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // SUPABASE LOGIN
      // ==========================================

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email:
            import.meta.env.VITE_ADMIN_EMAIL,
          password: password,
        });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error(
          "Login session could not be created."
        );
      }

      // App ko login successful batana
      onLogin(data.session);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* ======================================
            SHOP LOGO / ICON
        ====================================== */}

        <div className="login-logo">
          B
        </div>

        <div className="login-heading">

          <h1>
            Baba Snacks & Bakery
          </h1>

          <p>
            Sign in to continue
          </p>

        </div>

        {/* ======================================
            LOGIN FORM
        ====================================== */}

        <form onSubmit={handleLogin}>

          {/* USERNAME */}

          <div className="login-field">

            <label>
              Username
            </label>

            <div className="login-input">

              <User size={19} />

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                autoComplete="username"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <label>
              Password
            </label>

            <div className="login-input">

              <LockKeyhole
                size={19}
              />

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="current-password"
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (

            <div className="login-error">
              {error}
            </div>

          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            <LogIn size={19} />

            {loading
              ? "Signing in..."
              : "Login"}

          </button>

        </form>

        <div className="login-footer">

          <span>
            Authorized access only
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;