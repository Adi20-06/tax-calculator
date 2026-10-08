export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found.' });
}

export function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);

  // Never leak stack traces or internal details to the client
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(err.status || 500).json({
    error: 'Something went wrong. Please try again.',
    ...(isDev && { detail: err.message }),
  });
}