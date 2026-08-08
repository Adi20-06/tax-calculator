import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('taxledger_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function calculateTax(grossSalary) {
  const response = await axios.post(
    `${API_BASE_URL}/calculate-tax`,
    { grossSalary },
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getHistory() {
  const response = await axios.get(`${API_BASE_URL}/history`, { headers: authHeaders() });
  return response.data;
}

export async function compareRegimes(grossSalary, oldRegimeDeductions) {
  const response = await axios.post(
    `${API_BASE_URL}/compare-regimes`,
    { grossSalary, oldRegimeDeductions },
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getCalculationById(id) {
  const response = await axios.get(`${API_BASE_URL}/calculation/${id}`);
  return response.data;
}

export async function saveProfile(profile) {
  const response = await axios.post(`${API_BASE_URL}/profiles`, profile, { headers: authHeaders() });
  return response.data;
}

export async function getProfiles() {
  const response = await axios.get(`${API_BASE_URL}/profiles`, { headers: authHeaders() });
  return response.data;
}

export async function deleteProfile(id) {
  const response = await axios.delete(`${API_BASE_URL}/profiles/${id}`, { headers: authHeaders() });
  return response.data;
}