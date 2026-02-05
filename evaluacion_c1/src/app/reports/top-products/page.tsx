export const dynamic = "force-dynamic";

import { query } from "@/lib/db";

type RawRow = {
  product_id: number;
  product_name: string;
  revenue: string;
  units: string;
  rank_revenue: number;
};

type Row = {
  product_id: number;
  product_name: string;
  revenue: number;
  units: number;
  rank_revenue: number;
};

type Props = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
};

export default async function TopProductsPage({ searchParams }: Props) {
  const paramsResolved = await searchParams;

  const search = paramsResolved?.search ?? "";
  const page = Math.max(Number(paramsResolved?.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(paramsResolved?.limit ?? 5), 1), 20);
  const offset = (page - 1) * limit;

  let sql = `
    SELECT product_id, product_name, revenue, units, rank_revenue
    FROM vw_top_products_ranked
  `;

  const params: any[] = [];

  if (search) {
    sql += ` WHERE product_name ILIKE $1`;
    params.push(`%${search}%`);
  }

  sql += `
    ORDER BY rank_revenue
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  params.push(limit, offset);

  const rawRows = await query(sql, params) as RawRow[];

  const rows: Row[] = rawRows.map((r) => ({
    product_id: r.product_id,
    product_name: r.product_name,
    revenue: Number(r.revenue),
    units: Number(r.units),
    rank_revenue: r.rank_revenue,
  }));

  return (
    <main className="p-6">
      <h1>Productos más vendidos</h1>
      <p>Ranking por ingresos totales</p>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Producto</th>
            <th>Ingresos</th>
            <th>Unidades</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.product_id}>
              <td>{r.rank_revenue}</td>
              <td>{r.product_name}</td>
              <td>${r.revenue.toFixed(2)}</td>
              <td>{r.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
