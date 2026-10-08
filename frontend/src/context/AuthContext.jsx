import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_BASE_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('taxledger_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('taxledger_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    localStorage.setItem('taxledger_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(`${API_BASE_URL}/auth/signup`, { name, email, password });
    localStorage.setItem('taxledger_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('taxledger_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}