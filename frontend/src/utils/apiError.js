export function getApiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err.response?.status === 429) {
    return err.response.data?.error || 'Too many requests. Please slow down and try again shortly.';
  }
  if (err.response?.data?.error) {
    return err.response.data.error;
  }
  if (err.request && !err.response) {
    return 'Could not reach the server. Is the backend running?';
  }
  return fallback;
}