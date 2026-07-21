import api from "./api";

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{message: string}>}
 */
export async function registerUser(name, email, password) {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
}

/**
 * Verify OTP to complete registration
 * @param {string} email - User's email
 * @param {string} otp - OTP code received via email
 * @returns {Promise<{message: string}>}
 */
export async function verifyOtp(email, otp) {
  const response = await api.post("/auth/verify-otp", { email, otp });
  return response.data;
}

/**
 * Login user and store JWT token + user info
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{message: string, token: string, user: {name: string, email: string}}>}
 */
export async function loginUser(email, password) {
  const response = await api.post("/auth/login", { email, password });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
}

/**
 * Get stored user profile
 * @returns {{name: string, email: string, profilePicture: string} | null}
 */
export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Logout user — clear stored token and user info
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * Request a password reset OTP
 * @param {string} email
 * @returns {Promise<{message: string}>}
 */
export async function forgotPassword(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

/**
 * Reset password with OTP
 * @param {string} email
 * @param {string} otp
 * @param {string} newPassword
 * @returns {Promise<{message: string}>}
 */
export async function resetPassword(email, otp, newPassword) {
  const response = await api.post("/auth/reset-password", { email, otp, newPassword });
  return response.data;
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}
