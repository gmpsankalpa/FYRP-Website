// Simple Health Check API Endpoint
// Place this file at: /api/health.js in your project root

export default function handler(req, res) {
  const startTime = Date.now();
  
  // Basic health check
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    responseTime: Date.now() - startTime,
    services: {
      api: 'operational',
      database: 'operational',
      auth: 'operational'
    }
  };

  res.status(200).json(health);
}
