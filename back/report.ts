import sql, { isError } from './db';

interface Report {
  activityId: number;
  deviceId: string;
  position: [number, number];
  products: number[];
  activityStartedAt: number;
  activityEndedAt: number;
}

export async function report({
  activityId: activity_id,
  deviceId: device_uuid,
  position,
  products,
  activityStartedAt: activity_started_at,
  activityEndedAt: activity_ended_at
}: Report) {
  await sql.begin(async sql => {
    const [{ report_id } = { report_id: null }] = await sql<{ report_id: number }>`INSERT INTO report ${sql({
      activity_id,
      device_uuid,
      position: [position],
      activity_started_at,
      activity_ended_at
    })} RETURNING report_id`;
    await sql`INSERT INTO report_product ${sql(products.map((productId) => ({
      product_id: productId,
      report_id
    })))}`;
  });
}
