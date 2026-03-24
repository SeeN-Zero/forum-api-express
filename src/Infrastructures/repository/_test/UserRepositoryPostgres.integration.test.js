import { nanoid } from 'nanoid';
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js';
import UserRepositoryPostgres from '../UserRepositoryPostgres.js';
import InvariantError from '../../../Commons/exceptions/InvariantError.js';
import DatabaseTestHelper from '../../../../tests/DatabaseTestHelper.js';

describe('UserRepositoryPostgres Integration Test', () => {
  let pool;

  beforeAll(async () => {
    await DatabaseTestHelper.connect();
    DatabaseTestHelper.migrateSchema();
    pool = await DatabaseTestHelper.getPool();
  });

  beforeEach(async () => {
    await DatabaseTestHelper.truncateAllTables();
  });

  afterAll(async () => {
    await DatabaseTestHelper.truncateAllTables();
    await DatabaseTestHelper.closeConnection();
  });

  it('should insert and query user in real PostgreSQL database', async () => {
    const userRepository = new UserRepositoryPostgres(pool, nanoid);
    const registerUser = new RegisterUser({
      username: 'integration_user',
      password: 'secret_password',
      fullname: 'Integration User',
    });

    const addedUser = await userRepository.addUser(registerUser);

    const queryResult = await pool.query({
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [addedUser.id],
    });

    expect(queryResult.rowCount).toEqual(1);
    expect(queryResult.rows[0].id).toEqual(addedUser.id);
    expect(queryResult.rows[0].username).toEqual('integration_user');
    expect(queryResult.rows[0].fullname).toEqual('Integration User');
  });

  it('should throw InvariantError when username is not available', async () => {
    const userRepository = new UserRepositoryPostgres(pool, nanoid);
    await userRepository.addUser(new RegisterUser({
      username: 'taken_username',
      password: 'secret_password',
      fullname: 'First User',
    }));

    await expect(userRepository.verifyAvailableUsername('taken_username'))
      .rejects
      .toThrowError(InvariantError);
  });
});
