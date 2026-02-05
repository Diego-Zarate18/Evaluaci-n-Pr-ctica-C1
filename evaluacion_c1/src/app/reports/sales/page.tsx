export const dynamic = "force-dynamic";

import { query } from "@/lib/db";

type SalesRow = {
  sale_date: string;
  total_ventas: number;
  tickets: number;
  ticket_promedio: number;
};

type Props = {
  searchParams?: {
    date_from?: string;
    date_to?: string;
  };
};

export default async function SalesReportPage({ searchParams }: Props) {
  const dateFrom = searchParams?.date_from;
  const dateTo = searchParams?.date_to;

  let sql = `
    SELECT sale_date, total_ventas, tickets, ticket_promedio
    FROM vw_sales_daily
  `;
  const params: unknown[] = [];

  if (dateFrom && dateTo) {
    sql += ` WHERE sale_date BETWEEN $1 AND $2`;
    params.push(dateFrom, dateTo);
  }

  sql += ` ORDER BY sale_date DESC`;

  const rawRows = await query(sql, params) as any[];

  const rows: SalesRow[] = rawRows.map((r) => ({
    sale_date: new Date(r.sale_date).toISOString(),
    total_ventas: Number(r.total_ventas),
    tickets: Number(r.tickets),
    ticket_promedio: Number(r.ticket_promedio),
  }));

  const totalVentas = rows.reduce((sum, r) => sum + r.total_ventas, 0);
  const totalTickets = rows.reduce((sum, r) => sum + r.tickets, 0);
  const ticketPromedio =
    totalTickets > 0 ? (totalVentas / totalTickets).toFixed(2) : "0.00";

  return (
    <main style={{ padding: 24 }}>
      <h1>Ventas diarias</h1>
      <p>Ingresos, número de tickets y ticket promedio por día</p>

      {}
      <section style={{ margin: "16px 0", padding: 12, border: "1px solid #ccc" }}>
        <strong>Total ventas:</strong> ${totalVentas.toFixed(2)} <br />
        <strong>Total tickets:</strong> {totalTickets} <br />
        <strong>Ticket promedio:</strong> ${ticketPromedio}
      </section>

      {}
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total ventas</th>
            <th>Tickets</th>
            <th>Ticket promedio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sale_date}>
              <td>{r.sale_date.split("T")[0]}</td>
              <td>${r.total_ventas.toFixed(2)}</td>
              <td>{r.tickets}</td>
              <td>${r.ticket_promedio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
