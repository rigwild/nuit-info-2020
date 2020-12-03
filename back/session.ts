import { User } from './user';

export type Session = AuthenticatedSession | FreshSession;

export interface FreshSession {
  uid?: number;
  cachedUser?: User;
}

export interface AuthenticatedSession {
  uid: number;
  cachedUser: User;
}

class NotLoggedIn extends Error {
  status = 401;
  code = 'UNAUTHORIZED';

  constructor() {
    super('This route require authentification. Call the login route first.');
  }
}

export function isLoggedIn(session: Session): session is AuthenticatedSession {
  return 'uid' in session && typeof session.uid === 'number';
}

export function ensureLoggedIn(session: Session): asserts session is AuthenticatedSession {
  if (!isLoggedIn(session))
    throw new NotLoggedIn();
}

export function setLoggedInUser(session: Session, user: User) {
  user = { ...user };
  delete user.password;
  session.uid = user.uid;
  session.cachedUser = user;
}