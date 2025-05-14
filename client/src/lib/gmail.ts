import { getGmailAuthUrl, getGmailStatus } from "./api";

// Function to initiate the Gmail OAuth flow
export async function initiateGmailAuth() {
  try {
    const { authUrl } = await getGmailAuthUrl();
    window.location.href = authUrl;
    return true;
  } catch (error) {
    console.error("Failed to get Gmail auth URL:", error);
    throw error;
  }
}

// Function to check Gmail connection status
export async function checkGmailConnection() {
  try {
    const response = await getGmailStatus();
    
    // Log the response for debugging
    console.log("Gmail connection status response:", response);
    
    // Even if the API call succeeds, make sure we have a proper response
    if (!response) {
      return { connected: false, email: null };
    }
    
    return response;
  } catch (error) {
    console.error("Failed to check Gmail connection:", error);
    // Return a default response instead of throwing to prevent UI errors
    return { connected: false, email: null };
  }
}
