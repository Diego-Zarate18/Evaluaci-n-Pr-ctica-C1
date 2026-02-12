export const dynamic = "force-dynamic";

type Row = {
  customer_id: number;
  customer_name: string;
  total_orders: number;
  total_spent: number;
};

export default async function CustomerValuePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/reports/customer`,
    { cache: "no-store" }
  );
  const { rows: rawRows } = await res.json();

  const rows: Row[] = rawRows.map((r: any) => ({
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
