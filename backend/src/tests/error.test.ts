import request from 'supertest';
import app from '../app';

describe('Error Handling', () => {
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

  it('should return 404 for unknown endpoints', async () => {
    const response = await request(server)
      .get('/api/unknown-endpoint')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Endpoint not found');
  });

  it('should handle malformed JSON', async () => {
    const response = await request(server)
      .post('/api/todos')
      .set('Content-Type', 'application/json')
      .send('{"malformed": json}')
      .expect(500);

    expect(response.body.success).toBe(false);
  });
});