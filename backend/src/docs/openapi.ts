export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'DevPulse Engineer Assistant REST API',
    version: '1.0.0',
    description: 'Enterprise REST API documentation for DevPulse productivity assistant, authentication, integrations & telemetry.',
  },
  servers: [
    { url: 'http://localhost:5000/api/v1', description: 'Local Development Server' },
    { url: 'https://devpulse.enfast-tech.com/api/v1', description: 'AWS EC2 Production Server' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health Check Endpoint',
        responses: {
          '200': { description: 'Server is healthy' },
        },
      },
    },
    '/system/status': {
      get: {
        summary: 'System Telemetry & RAM/CPU Monitoring',
        responses: {
          '200': { description: 'Telemetry status OK' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'User Registration',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Bikas Engineer' },
                  email: { type: 'string', example: 'test@example.com' },
                  password: { type: 'string', example: 'TestPass123!' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User created & JWT token issued' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'User Login & Password Verification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'test@example.com' },
                  password: { type: 'string', example: 'TestPass123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
        },
      },
    },
    '/integrations/ai/reply': {
      post: {
        summary: 'AI Context-Aware Smart Reply Generator',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'AI Smart Reply generated' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
