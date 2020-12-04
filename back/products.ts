import sql from './db';

export interface Product {
  id: number;
  name: string;
}

export async function products() {
  const [{ products: reportables }, { products: consumables }] = await sql<{ products: Product[] }>`SELECT array_agg(json_build_object('id',product_id,'name',name)) AS products FROM product GROUP BY is_consumable ORDER BY is_consumable ASC;`;
  return ({
    consumables,
    reportables
  })
}
