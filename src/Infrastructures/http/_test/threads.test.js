import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import UserCommentLikesTableTestHelper from '../../../../tests/UserCommentLikesTableTestHelper.js';
import container from '../../container.js';
import createServer from '../createServer.js';

describe('HTTP server - threads', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserCommentLikesTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const getAccessToken = async (app, {
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  } = {}) => {
    await request(app).post('/users').send({
      username,
      password,
      fullname,
    });
    const loginResponse = await request(app).post('/authentications').send({
      username,
      password,
    });

    return loginResponse.body.data.accessToken;
  };

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.id).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual(requestPayload.title);
      expect(response.body.data.addedThread.owner).toBeDefined();
    });

    it('should response 401 when request without authentication', async () => {
      const requestPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const app = await createServer(container);

      const response = await request(app).post('/threads').send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should response 401 when access token invalid', async () => {
      const requestPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const app = await createServer(container);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', 'Bearer invalid_access_token')
        .send(requestPayload);

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('access token tidak valid');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        body: 'isi thread',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(requestPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and thread detail', async () => {
      const threadPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const commentPayload = {
        content: 'isi komentar',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      const addThreadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(threadPayload);
      const threadId = addThreadResponse.body.data.addedThread.id;
      await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.id).toEqual(threadId);
      expect(response.body.data.thread.comments).toHaveLength(1);
      expect(response.body.data.thread.comments[0].likeCount).toEqual(0);
      expect(response.body.data.thread.comments[0].replies).toEqual([]);
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);

      const response = await request(app).get('/threads/thread-404');

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('thread tidak ditemukan');
    });

    it('should show deleted reply message correctly', async () => {
      const threadPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const commentPayload = {
        content: 'isi komentar',
      };
      const replyPayload = {
        content: 'isi balasan',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      const addThreadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(threadPayload);
      const threadId = addThreadResponse.body.data.addedThread.id;
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);
      const commentId = addCommentResponse.body.data.addedComment.id;
      const addReplyResponse = await request(app)
        .post(`/threads/${threadId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(replyPayload);
      const replyId = addReplyResponse.body.data.addedReply.id;
      await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}/replies/${replyId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    });

    it('should show like count correctly', async () => {
      const threadPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const commentPayload = {
        content: 'isi komentar',
      };
      const app = await createServer(container);
      const firstUserAccessToken = await getAccessToken(app, {
        username: 'userone',
        password: 'secret',
        fullname: 'User One',
      });
      const secondUserAccessToken = await getAccessToken(app, {
        username: 'usertwo',
        password: 'secret',
        fullname: 'User Two',
      });
      const addThreadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${firstUserAccessToken}`)
        .send(threadPayload);
      const threadId = addThreadResponse.body.data.addedThread.id;
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${firstUserAccessToken}`)
        .send(commentPayload);
      const commentId = addCommentResponse.body.data.addedComment.id;

      await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${firstUserAccessToken}`);
      await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`);

      const response = await request(app).get(`/threads/${threadId}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread.comments[0].likeCount).toEqual(2);
    });
  });
});
