export const dynamic = "force-dynamic";

import { query } from "@/lib/db";

type Row = {
  product_id: number;
  product_name: string;
  category_name: string;
  stock: number;
  nivel_riesgo: string;
  porcentaje_riesgo: number;
};

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const CATEGORY_WHITELIST = ["Bebidas", "Panadería", "Snacks"];

export default async function InventoryRiskPage({ searchParams }: Props) {
  const paramsResolved = await searchParams;
  const category = paramsResolved?.category;

  let sql = `
    SELECT product_id, product_name, category_name, stock, nivel_riesgo, porcentaje_riesgo
    FROM vw_inventory_risk
  `;
  const params: any[] = [];

  if (category && CATEGORY_WHITELIST.includes(category)) {
    sql += ` WHERE category_name = $1`;
    params.push(category);
  }

  const rawRows = await query(sql, params) as any[];

  const rows: Row[] = rawRows.map((r) => ({
    product_id: r.product_id,
    product_name: r.product_name,
    category_name: r.category_name,
    stock: Number(r.stock),
    nivel_riesgo: r.nivel_riesgo,
    porcentaje_riesgo: Number(r.porcentaje_riesgo),
  }));

  return (
    <main className="p-6">
      <h1>Inventario en riesgo</h1>
      <p>Productos con bajo stock por categoría</p>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Nivel riesgo</th>
            <th>% relativo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.product_id}>
              <td>{r.product_name}</td>
              <td>{r.category_name}</td>
              <td>{r.stock}</td>
              <td>{r.nivel_riesgo}</td>
              <td>{r.porcentaje_riesgo.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
