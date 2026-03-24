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

describe('HTTP server - comments', () => {
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

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
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

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.id).toBeDefined();
      expect(response.body.data.addedComment.content).toEqual(commentPayload.content);
      expect(response.body.data.addedComment.owner).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const commentPayload = {
        content: 'isi komentar',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const response = await request(app)
        .post('/threads/thread-404/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when payload not contain needed property', async () => {
      const threadPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const commentPayload = {};
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      const addThreadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(threadPayload);
      const threadId = addThreadResponse.body.data.addedThread.id;

      const response = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and soft delete comment', async () => {
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
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);
      const commentId = addCommentResponse.body.data.addedComment.id;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('should response 403 when user not comment owner', async () => {
      const threadPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const commentPayload = {
        content: 'isi komentar',
      };
      const app = await createServer(container);
      const ownerAccessToken = await getAccessToken(app, {
        username: 'owner',
        password: 'secret',
        fullname: 'Owner',
      });
      const anotherUserAccessToken = await getAccessToken(app, {
        username: 'anotheruser',
        password: 'secret',
        fullname: 'Another User',
      });
      const addThreadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${ownerAccessToken}`)
        .send(threadPayload);
      const threadId = addThreadResponse.body.data.addedThread.id;
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${ownerAccessToken}`)
        .send(commentPayload);
      const commentId = addCommentResponse.body.data.addedComment.id;

      const response = await request(app)
        .delete(`/threads/${threadId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${anotherUserAccessToken}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('anda tidak berhak mengakses resource ini');
    });
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and toggle like comment', async () => {
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
      const addCommentResponse = await request(app)
        .post(`/threads/${threadId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentPayload);
      const commentId = addCommentResponse.body.data.addedComment.id;

      const firstResponse = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);
      const secondResponse = await request(app)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(firstResponse.status).toEqual(200);
      expect(firstResponse.body.status).toEqual('success');
      expect(secondResponse.status).toEqual(200);
      expect(secondResponse.body.status).toEqual('success');
    });

    it('should response 401 when request without authentication', async () => {
      const app = await createServer(container);

      const response = await request(app).put('/threads/thread-123/comments/comment-123/likes');

      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);

      const response = await request(app)
        .put('/threads/thread-404/comments/comment-123/likes')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
      const threadPayload = {
        title: 'judul thread',
        body: 'isi thread',
      };
      const app = await createServer(container);
      const accessToken = await getAccessToken(app);
      const addThreadResponse = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(threadPayload);
      const threadId = addThreadResponse.body.data.addedThread.id;

      const response = await request(app)
        .put(`/threads/${threadId}/comments/comment-404/likes`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('komentar tidak ditemukan');
    });
  });
});
