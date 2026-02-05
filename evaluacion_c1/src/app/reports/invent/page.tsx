export const dynamic = "force-dynamic";

import { query } from "@/lib/db";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function InventoryRiskPage(props: Props) {
  const searchParams = await props.searchParams;
  const riskFilter = searchParams.risk || "ALL";

  let sql = `
    SELECT 
      product_id, 
      product_name, 
      category_name, 
      stock, 
      risk_level, 
      stock_percentage_relative
    FROM vw_inventory_risk
  `;

  const params: any[] = [];

  if (riskFilter !== "ALL") {
    sql += ` WHERE risk_level = $1`;
    params.push(riskFilter);
  }

  sql += ` ORDER BY stock ASC`;

  const rows = (await query(sql, params)) as any[];

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Alerta de Inventario</h1>
          <p className="text-gray-600">Productos con stock crítico</p>
        </div>

        <div className="flex gap-2">
            <a href="?risk=ALL" className={`px-3 py-1 rounded border text-sm ${riskFilter === 'ALL' ? 'bg-black text-white' : ''}`}>Todos</a>
            <a href="?risk=ALTO" className={`px-3 py-1 rounded border text-sm ${riskFilter === 'ALTO' ? 'bg-red-600 text-white border-red-600' : ''}`}>Alto Riesgo</a>
            <a href="?risk=MEDIO" className={`px-3 py-1 rounded border text-sm ${riskFilter === 'MEDIO' ? 'bg-yellow-500 text-white border-yellow-500' : ''}`}>Medio</a>
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