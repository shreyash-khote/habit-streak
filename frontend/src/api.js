import { auth } from './firebaseConfig';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  // Use deployed Cloud Run backend for all platforms (web + APK)
  return 'https://habit-streak-backend-ogesdpi3qq-uc.a.run.app';
};

const API_URL = getBaseUrl();

// Gets a fresh Firebase ID token for the current user
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const getHabits = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_URL}/habits/`, { headers });
    if (!response.ok) throw new Error('Failed to fetch habits');
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('API Error (getHabits):', error);
    }
    return [];
  }
};

export const createHabit = async (habitData) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_URL}/habits/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(habitData),
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Server error details:', errData);
      throw new Error('Failed to create habit');
    }
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('API Error (createHabit):', error);
    }
    throw error;
  }
};

export const getHeatmapData = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_URL}/habits/stats/heatmap`, { headers });
    if (!response.ok) throw new Error('Failed to fetch heatmap data');
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('API Error (getHeatmapData):', error);
    }
    return [];
  }
};

export const getDetailedStats = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(`${API_URL}/habits/stats/detailed`, { headers });
    if (!response.ok) throw new Error('Failed to fetch detailed stats');
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('API Error (getDetailedStats):', error);
    }
    return [];
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/habits/${habitId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete habit');
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('API Error (deleteHabit):', error);
    }
    throw error;
  }
};

export const getCoachBreakdown = async (goal) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetchWithTimeout(
      `${API_URL}/coach/breakdown`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ goal }),
      },
      15000 // 15s — AI can be slow
    );
    if (!response.ok) throw new Error('Coach API error');
    return await response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('API Error (getCoachBreakdown):', error);
    }
    throw error;
  }
};
