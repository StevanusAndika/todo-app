import request from 'supertest';
import app from '../app';

describe('Health Check API', () => {
  let server: any;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => {
      server.on('listening', resolve);
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  it('should return health check status', async () => {
    const response = await request(server)
      .get('/api/health')
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      message: '🚀 Server is running!',
      timestamp: expect.any(String),
      version: '1.0.0'
    });
  });

  it('should redirect root to API docs', async () => {
    const response = await request(server)
      .get('/')
      .expect(302);

    expect(response.header.location).toBe('/api-docs');
  });

  it('should return API info', async () => {
    const response = await request(server)
      .get('/api')
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'Todo App API - Industrix Coding Challenge',
      version: '1.0.0',
      documentation: '/api-docs'
    });
  });
});