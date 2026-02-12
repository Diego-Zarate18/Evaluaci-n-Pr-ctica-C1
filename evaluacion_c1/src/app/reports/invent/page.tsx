export const dynamic = "force-dynamic";

import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function InventoryRiskPage(props: Props) {
  const searchParams = await props.searchParams;
  const riskFilter = searchParams.risk || "ALL";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/reports/invent?risk=${riskFilter}`,
    { cache: "no-store" }
  );
  const { rows } = await res.json();

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Alerta de Inventario</h1>
          <p className="text-gray-600">Productos con stock crítico</p>
        </div>

        <div className="flex gap-2">
            <Link href="?risk=ALL" className={`px-3 py-1 rounded border text-sm transition-colors ${riskFilter === 'ALL' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>Todos</Link>
            <Link href="?risk=ALTO" className={`px-3 py-1 rounded border text-sm transition-colors ${riskFilter === 'ALTO' ? 'bg-red-600 text-white border-red-600' : 'hover:bg-gray-100'}`}>Alto Riesgo</Link>
            <Link href="?risk=MEDIO" className={`px-3 py-1 rounded border text-sm transition-colors ${riskFilter === 'MEDIO' ? 'bg-yellow-500 text-white border-yellow-500' : 'hover:bg-gray-100'}`}>Medio</Link>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800 border-b">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Categoría</th>
              <th className="p-4 text-center">Stock Actual</th>
              <th className="p-4">Nivel de Riesgo</th>
              <th className="p-4 text-right">% Relativo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r: any) => (
              <tr key={r.product_id} className="hover:bg-gray-50 dark:hover:bg-zinc-900">
                <td className="p-4 font-medium">{r.product_name}</td>
                <td className="p-4 text-gray-500">{r.category_name}</td>
                <td className="p-4 text-center font-mono font-bold">{r.stock}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold 
                    ${r.risk_level === 'ALTO' ? 'bg-red-100 text-red-700' : 
                      r.risk_level === 'MEDIO' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {r.risk_level}
                  </span>
                </td>
                <td className="p-4 text-right text-gray-500">{r.stock_percentage_relative}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}