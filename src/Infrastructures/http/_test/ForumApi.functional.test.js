import request from 'supertest';
import DatabaseTestHelper from '../../../../tests/DatabaseTestHelper.js';

describe('Forum API Functional Test', () => {
  let app;

  beforeAll(async () => {
    await DatabaseTestHelper.connect();
    DatabaseTestHelper.migrateSchema();

    const { default: container } = await import('../../container.js');
    const { default: createServer } = await import('../createServer.js');
    app = await createServer(container);
  });

  beforeEach(async () => {
    await DatabaseTestHelper.truncateAllTables();
  });

  afterAll(async () => {
    await DatabaseTestHelper.truncateAllTables();
    await DatabaseTestHelper.closeConnection();
  });

  it('should run full flow via HTTP: register -> login -> create thread -> create comment -> get thread detail', async () => {
    const registerResponse = await request(app)
      .post('/users')
      .send({
        username: 'functional_user',
        password: 'secret_password',
        fullname: 'Functional User',
      });

    expect(registerResponse.status).toEqual(201);
    expect(registerResponse.body.status).toEqual('success');
    expect(registerResponse.body.data.addedUser.id).toBeDefined();

    const loginResponse = await request(app)
      .post('/authentications')
      .send({
        username: 'functional_user',
        password: 'secret_password',
      });

    expect(loginResponse.status).toEqual(201);
    expect(loginResponse.body.status).toEqual('success');
    expect(loginResponse.body.data.accessToken).toBeDefined();

    const accessToken = loginResponse.body.data.accessToken;

    const createThreadResponse = await request(app)
      .post('/threads')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Thread Functional',
        body: 'Thread body functional test',
      });

    expect(createThreadResponse.status).toEqual(201);
    expect(createThreadResponse.body.status).toEqual('success');
    expect(createThreadResponse.body.data.addedThread.id).toBeDefined();

    const threadId = createThreadResponse.body.data.addedThread.id;

    const createCommentResponse = await request(app)
      .post(`/threads/${threadId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Komentar functional test',
      });

    expect(createCommentResponse.status).toEqual(201);
    expect(createCommentResponse.body.status).toEqual('success');
    expect(createCommentResponse.body.data.addedComment.id).toBeDefined();

    const getThreadResponse = await request(app).get(`/threads/${threadId}`);

    expect(getThreadResponse.status).toEqual(200);
    expect(getThreadResponse.body.status).toEqual('success');
    expect(getThreadResponse.body.data.thread.id).toEqual(threadId);
    expect(getThreadResponse.body.data.thread.comments).toHaveLength(1);
    expect(getThreadResponse.body.data.thread.comments[0].content).toEqual('Komentar functional test');
  });
});
