import sql from './db';
import { compare, hash } from 'bcrypt';
import { ensureLoggedIn, isLoggedIn, Session, setLoggedInUser } from './session';
import { User } from './user';

class UserNotFound extends Error {
  status = 404;
  code = 'USER_NOT_FOUND';
  uid?: number;
  username?: string;

  constructor(uidOrUsername: number | string) {
    super(`User ${typeof uidOrUsername === 'string' ? `"${uidOrUsername}"` : `uid ${uidOrUsername}`} not found`);
    if (typeof uidOrUsername === 'string')
      this.username = uidOrUsername;
    else
      this.uid = uidOrUsername;
  }
}

async function getUserByUid(uid: number) {
  const [user] = await sql<User>`SELECT * FROM account WHERE uid = ${uid}`;
  if (!user)
    throw new UserNotFound(uid);
  delete user.password;
  return user;
}

export async function getUserInfo(this: any) {
  return isLoggedIn(this) ? this.cachedUser : null;
}

class InvalidCredentials extends Error {
  status = 403;
  code = 'INVALID_CREDENTIALS';
  username: string;

  constructor(username: string) {
    super(`Invalid credentials`);
    this.username = username;
  }
}

export async function login(this: any, username: string, password: string) {
  if (isLoggedIn(this))
    return getUserInfo.call(this);
  const [user] = await sql<User>`SELECT * FROM account WHERE username = ${username}`;
  if (user && compare(password, user.password!)) {
    delete user.password;
    setLoggedInUser(this, user);
    return user;
  }
  throw new InvalidCredentials(username);
}

export async function register(this: any, { username, password, linkedinId, accountType, name }: Record<string, string>) {
  if (isLoggedIn(this))
    return getUserInfo.call(this);
  password = await hash(password, 10);
  const [user] = await sql<User>`INSERT INTO account ${sql({ username, password })} RETURNING *`;
  if (user) {
    delete user.password;
    return user;
  }
  throw new InvalidCredentials(username);
}
