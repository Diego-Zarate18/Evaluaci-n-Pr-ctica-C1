export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function SalesReportPage(props: Props) {
  const searchParams = await props.searchParams;
  
  const defaultTo = new Date().toISOString().split('T')[0];
  const defaultFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const dateFrom = searchParams.from || defaultFrom;
  const dateTo = searchParams.to || defaultTo;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/reports/sales?from=${dateFrom}&to=${dateTo}`,
    { cache: "no-store" }
  );
  const { rows } = await res.json();

  const totalRevenue = rows.reduce((acc: number, r: any) => acc + Number(r.total_revenue), 0);
  const totalTickets = rows.reduce((acc: number, r: any) => acc + Number(r.ticket_count), 0);

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Ventas Diarias</h1>
          <p className="text-gray-600">Resumen histórico de operaciones</p>
        </div>

        <form className="flex items-end gap-2 bg-gray-50 p-3 rounded border dark:bg-zinc-900 dark:border-zinc-800">
          <div>
            <label className="block text-xs text-gray-500">Desde</label>
            <input type="date" name="from" defaultValue={dateFrom} className="border rounded p-1 text-sm bg-white dark:bg-zinc-800" />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Hasta</label>
            <input type="date" name="to" defaultValue={dateTo} className="border rounded p-1 text-sm bg-white dark:bg-zinc-800" />
          </div>
          <button type="submit" className="bg-black text-white px-3 py-1 rounded text-sm h-[30px]">
             Filtrar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border rounded-xl bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Ingresos Totales</div>
          <div className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="p-4 border rounded-xl bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Total Tickets</div>
          <div className="text-2xl font-bold mt-1">{totalTickets}</div>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800 border-b">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-right">Ingresos</th>
              <th className="p-4 text-right">Tickets</th>
              <th className="p-4 text-right">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r: any) => (
              <tr key={r.sale_date} className="hover:bg-gray-50 dark:hover:bg-zinc-900">
                <td className="p-4 font-medium">
                  {new Date(r.sale_date).toLocaleDateString()}
                </td>
                <td className="p-4 text-right font-medium">${Number(r.total_revenue).toFixed(2)}</td>
                <td className="p-4 text-right">{r.ticket_count}</td>
                <td className="p-4 text-right text-gray-500">${Number(r.avg_ticket).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}