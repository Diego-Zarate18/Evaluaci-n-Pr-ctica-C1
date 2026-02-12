export const dynamic = "force-dynamic";

import Link from "next/link";
import SearchProductsForm from "./SearchForm";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function TopProductsPage(props: Props) {
  const searchParams = await props.searchParams;
  
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const searchTerm = searchParams.q || "";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/reports/top-products?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`,
    { cache: "no-store" }
  );
  const { rows: rawRows } = await res.json();

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Top Productos</h1>
          <p className="text-gray-600">Ranking por ingresos generados</p>
        </div>
        
        <SearchProductsForm />
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