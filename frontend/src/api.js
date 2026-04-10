const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.110.154.143:8000";

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
    const response = await fetchWithTimeout(`${API_URL}/habits/`);
    if (!response.ok) throw new Error('Failed to fetch habits');
    return await response.json();
  } catch (error) {
    console.error('API Error (getHabits):', error);
    return [];
  }
};

export const createHabit = async (habitData) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/habits/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habitData),
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Server error details:', errData);
      throw new Error('Failed to create habit');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error (createHabit):', error);
    throw error;
  }
};

export const getHeatmapData = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/habits/stats/heatmap`);
    if (!response.ok) throw new Error('Failed to fetch heatmap data');
    return await response.json();
  } catch (error) {
    console.error('API Error (getHeatmapData):', error);
    return [];
  }
};

export const getDetailedStats = async () => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/habits/stats/detailed`);
    if (!response.ok) throw new Error('Failed to fetch detailed stats');
    return await response.json();
  } catch (error) {
    console.error('API Error (getDetailedStats):', error);
    return [];
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const response = await fetch(`${API_URL}/habits/${habitId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete habit');
    return await response.json();
  } catch (error) {
    console.error('API Error (deleteHabit):', error);
    throw error;
  }
};
