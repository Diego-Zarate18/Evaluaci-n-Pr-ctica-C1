export const dynamic = "force-dynamic";

import { query } from "@/lib/db";

type Row = {
  payment_method: string;
  total_payments: number;
  total_amount: number;
};

export default async function PaymentMixPage() {
  const sql = `
    SELECT
      payment_method,
      total_payments,
      total_amount
    FROM vw_payment_mix
    ORDER BY total_amount DESC
  `;

  const rawRows = (await query(sql)) as any[];

  const rows: Row[] = rawRows.map((r) => ({
    payment_method: r.payment_method,
    total_payments: Number(r.total_payments),
    total_amount: Number(r.total_amount),
  }));

  return (
    <main className="p-6">
      <h1>Distribución de pagos</h1>
      <p>Métodos de pago y monto total procesado</p>

      <table>
        <thead>
          <tr>
            <th>Método de pago</th>
            <th>Total pagos</th>
            <th>Monto total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.payment_method}>
              <td>{r.payment_method}</td>
              <td>{r.total_payments}</td>
              <td>${r.total_amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
