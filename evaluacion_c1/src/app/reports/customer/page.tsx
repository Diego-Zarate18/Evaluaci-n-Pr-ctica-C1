export const dynamic = "force-dynamic";

import { query } from "@/lib/db";

type Row = {
  customer_id: number;
  customer_name: string;
  total_orders: number;
  total_spent: number;
};

export default async function CustomerValuePage() {
  const sql = `
    SELECT
      customer_id,
      customer_name,
      total_orders,
      total_spent
    FROM vw_customer_value
    ORDER BY total_spent DESC
  `;

  const rawRows = (await query(sql)) as any[];

  const rows: Row[] = rawRows.map((r) => ({
    customer_id: Number(r.customer_id),
    customer_name: r.customer_name,
    total_orders: Number(r.total_orders),
    total_spent: Number(r.total_spent),
  }));

  return (
    <main className="p-6">
      <h1>Valor por cliente</h1>
      <p>Total de compras acumuladas por cliente</p>

      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Total órdenes</th>
            <th>Monto total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.customer_id}>
              <td>{r.customer_name}</td>
              <td>{r.total_orders}</td>
              <td>${r.total_spent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
