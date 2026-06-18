import api from "./api";

/**
 * Get the current user's profile
 * @returns {Promise<{firstName: string, lastName: string, organizerName: string, email: string, createdAt: string, profilePicture: string}>}
 */
export async function getProfile() {
  const response = await api.get("/profile");
  return response.data;
}

/**
 * Update the current user's profile
 * @param {Object} data - Profile fields to update
 * @param {string} [data.firstName] - First name
 * @param {string} [data.lastName] - Last name
 * @param {string} [data.organizerName] - Organizer/company name
 * @returns {Promise<{message: string, user: {firstName: string, lastName: string, organizerName: string, email: string, profilePicture: string}}>}
 */
export async function updateProfile(data) {
  const response = await api.put("/profile", data);
  return response.data;
}

/**
 * Change the current user's password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<{message: string}>}
 */
export async function changePassword(currentPassword, newPassword) {
  const response = await api.put("/profile/password", { currentPassword, newPassword });
  return response.data;
}

/**
 * Upload a profile picture
 * @param {File} file - Image file (JPEG, PNG, GIF, WebP, max 5MB)
 * @returns {Promise<{message: string, profilePicture: string}>}
 */
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("profilePicture", file);
  const response = await api.post("/profile/picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

/**
 * Remove the profile picture
 * @returns {Promise<{message: string}>}
 */
export async function removeProfilePicture() {
  const response = await api.delete("/profile/picture");
  return response.data;
}
