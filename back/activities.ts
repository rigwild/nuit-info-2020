import sql from './db';

export interface Activity {
  activity_id: number;
  name: string;
}

export async function activities(): Promise<Activity[]> {
  return sql<Activity>`SELECT * FROM activity;`;
}
