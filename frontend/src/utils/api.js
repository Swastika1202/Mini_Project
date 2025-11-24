const API_BASE_URL = "http://localhost:5000/api"; // Assuming your backend runs on port 5000

const api = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to register");
    }
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }
    return data;
  },

  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }
    return { data };
  },

  updateProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }
    return { data };
  },

  getDashboardSummary: async (period) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/dashboard?period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch dashboard summary");
    }
    return { data };
  },

  getIncomeSummary: async (period) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/income/summary?period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch income summary");
    }
    return { data };
  },

  addIncome: async (incomeData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/income`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(incomeData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add income");
    }
    return { data };
  },

  getExpenseSummary: async (period) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/expenses/summary?period=${period}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch expense summary");
    }
    return { data };
  },

  addExpense: async (expenseData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(expenseData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add expense");
    }
    return { data };
  },

  getAnalyticsSummary: async (timeRange) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/analytics?timeRange=${timeRange}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch analytics summary");
    }
    return { data };
  },

  getFinancialGoals: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch financial goals");
    }
    return { data };
  },

  createFinancialGoal: async (goalData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create financial goal");
    }
    return { data };
  },
};

export default api;