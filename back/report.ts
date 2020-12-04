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

interface ReportStatistics {
  reports_count: bigint;
  users_count: bigint;
  report_avg_duration: string;
}

interface ReportProductStatistics {
  product_id: number;
  count: bigint;
  name: string;
  is_consumable: number;
}

export interface Statistics extends ReportStatistics {
  products: ReportProductStatistics[];
}

export async function statistics(): Promise<Statistics> {

  const [[report], products] = await sql.begin(sql => [
    sql<ReportStatistics>`SELECT
      COUNT(report_id)::integer AS reports_count,
      COUNT(DISTINCT device_uuid)::integer AS users_count,
      EXTRACT(epoch FROM AVG(activity_ended_at - activity_started_at)) * 1000 AS report_avg_duration
    FROM report`,
    sql<ReportProductStatistics>`
    SELECT
      RP.product_id AS id,
      P.name,
      P.is_consumable,
      COUNT(*)::integer AS count
    FROM report_product RP
    INNER JOIN product P ON P.product_id = RP.product_id
    GROUP BY RP.product_id, P.name, P.is_consumable
    ORDER BY count DESC`
  ]);
  return { ...report, products };
}
