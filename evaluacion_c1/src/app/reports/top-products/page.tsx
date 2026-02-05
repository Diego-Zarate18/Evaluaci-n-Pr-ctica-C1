export const dynamic = "force-dynamic";

import { query } from "@/lib/db";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function TopProductsPage(props: Props) {
  const searchParams = await props.searchParams;
  
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const searchTerm = searchParams.q || "";


  let sql = `
    SELECT *
    FROM vw_top_products_ranked
    WHERE product_name ILIKE $1
    ORDER BY rank_revenue ASC
    LIMIT $2 OFFSET $3
  `;

  
  const rawRows = (await query(sql, [`%${searchTerm}%`, limit, offset])) as any[];

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Top Productos</h1>
          <p className="text-gray-600">Ranking por ingresos generados</p>
        </div>
        
        {}
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchTerm}
            placeholder="Buscar producto..."
            className="border p-2 rounded w-64 dark:bg-zinc-900 dark:border-zinc-700"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Buscar
          </button>
        </form>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800 border-b">
            <tr>
              <th className="p-4 w-20">Rank</th>
              <th className="p-4">Producto</th>
              <th className="p-4 text-center">Unidades</th>
              <th className="p-4 text-right">Ingresos Totales</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rawRows.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No se encontraron productos</td></tr>
            ) : (
              rawRows.map((r: any) => (
                <tr key={r.product_id} className="hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                  <td className="p-4 font-bold text-gray-500 text-center">#{r.rank_revenue}</td>
                  <td className="p-4 font-medium">{r.product_name}</td>
                  <td className="p-4 text-center">{r.total_units}</td>
                  <td className="p-4 text-right font-bold text-green-600">
                    ${Number(r.total_revenue).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {}
      <div className="flex justify-center gap-4 mt-6">
        {page > 1 && (
          <Link
            href={`/reports/top-products?page=${page - 1}&q=${searchTerm}`}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            ← Anterior
          </Link>
        )}
        {rawRows.length === limit && (
          <Link
            href={`/reports/top-products?page=${page + 1}&q=${searchTerm}`}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Siguiente →
          </Link>
        )}
      </div>
    </main>
  );
}