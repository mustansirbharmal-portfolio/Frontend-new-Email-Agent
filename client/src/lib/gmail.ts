import { getGmailAuthUrl, getGmailStatus } from "./api";

// Function to initiate the Gmail OAuth flow
export async function initiateGmailAuth() {
  try {
    const response = await fetch('https://email-backend-lhx2.onrender.com/api/gmail/auth', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const { authUrl } = await response.json();
    if (!authUrl) {
      throw new Error('No authentication URL received');
    }
    
    console.log('Gmail Auth Initiated:', { authUrl });
    window.location.href = authUrl;
    return true;
  } catch (error) {
    console.error('Error during Gmail authentication:', error.message);
    throw new Error(`Failed to authenticate Gmail: ${error.message}`);
  }
}

// Function to check Gmail connection status
export async function checkGmailConnection() {
  try {
    const response = await getGmailStatus();
    console.log('Gmail Connection Status:', response);
    
    if (!response) {
      console.warn('No response received from Gmail status check');
      return { connected: false, email: null };
    }
    
    return {
      connected: Boolean(response.connected),
      email: response.email || null
    };
  } catch (error) {
    console.error('Error fetching Gmail connection status:', error.message);
    return { connected: false, email: null };
  }
}
