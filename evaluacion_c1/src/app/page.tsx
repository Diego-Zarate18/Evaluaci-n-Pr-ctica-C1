import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ padding: 32 }}>
      <h1>AWOS Reports Dashboard</h1>
      <p>Panel de acceso a reportes generados desde vistas SQL</p>

      <section style={{ marginTop: 32 }}>
        <h2>Reportes disponibles</h2>

        <ul style={{ marginTop: 16, lineHeight: 2 }}>
          <li>
            <Link href="/reports/top-products">
              Top productos vendidos
            </Link>
          </li>

          <li>
            <Link href="/reports/sales">
              Ventas diarias
            </Link>
          </li>

          <li>
            <Link href="/reports/invent">
              Inventario en riesgo
            </Link>
          </li>

          <li>
            <Link href="/reports/customer">
              Valor del cliente
            </Link>
          </li>

          <li>
            <Link href="/reports/payment">
              Distribución de métodos de pago
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
