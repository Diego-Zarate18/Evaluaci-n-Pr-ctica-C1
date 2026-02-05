import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1>Dashboard</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-6">Reportes disponibles</h2>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li>
            <Link href="/reports/top-products" className="block p-6 border rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <span className="block text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Top productos vendidos</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Ranking de productos más vendidos por ingresos totales.</span>
            </Link>
          </li>

          <li>
            <Link href="/reports/sales" className="block p-6 border rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <span className="block text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Ventas diarias</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Resumen de ingresos, tickets y ticket promedio por día.</span>
            </Link>
          </li>

          <li>
            <Link href="/reports/invent" className="block p-6 border rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <span className="block text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Inventario en riesgo</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Monitor de productos con bajo stock o alto riesgo.</span>
            </Link>
          </li>

          <li>
            <Link href="/reports/customer" className="block p-6 border rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <span className="block text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Valor del cliente</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Análisis de clientes por total de compras acumuladas.</span>
            </Link>
          </li>

          <li>
            <Link href="/reports/payment" className="block p-6 border rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <span className="block text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Distribución de pagos</span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Desglose de métodos de pago y montos procesados.</span>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
