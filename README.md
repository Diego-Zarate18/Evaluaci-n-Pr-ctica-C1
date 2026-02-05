# AWOS

**Evaluación Práctica Corte 1 - NextJS + BDA**

Aplicación para la visualización de reportes analíticos de una cafetería universitaria.

---
1. **Levantar el entorno:**
   ```bash
   docker-compose up --build
   ```

2. **Acceder a la aplicación:**
   - URL: [http://localhost:3000](http://localhost:3000)

---

## Vistas SQL (Reportes)

Se han implementado 5 vistas que encapsulan la lógica de negocio, cumpliendo con los requisitos de agregación y cálculo:

1. **`vw_sales_daily`**
   - **Insight:** Ventas diarias, conteo de tickets y ticket promedio.
   - **Técnicas:** CTE (`WITH`), Agregación por fecha, Calculated Field (`/ NULLIF`).

2. **`vw_customer_value`**
   - **Insight:** Valor del ciclo de vida del cliente (LTV).
   - **Técnicas:** `HAVING` (filtrar clientes sin gasto), `SUM`, `AVG`.

3. **`vw_payment_mix`**
   - **Insight:** Preferencias de métodos de pago.
   - **Técnicas:** Window Function Light (Porcentaje relativo), `HAVING`.

4. **`vw_top_products_ranked`**
   - **Insight:** Ranking de productos más vendidos.
   - **Técnicas:** **Window Function (`RANK() OVER...`)**, CTE, `COALESCE`.

5. **`vw_inventory_risk`**
   - **Insight:** Productos con niveles de stock críticos.
   - **Técnicas:** **CASE** (Clasificación de riesgo), Window Function (relativa al máximo), `GROUP BY`.

---

## Seguridad Implementada

La aplicación Next.js **NO** se conecta como superusuario (`postgres`). Se ha implementado un rol específico `app_user`

- **Permisos Otorgados:** `SELECT` únicamente sobre las VISTAS definidas en `db/03_reports_vw.sql`.
- **Permisos Denegados:** Acceso directo a tablas base (`INSERT`, `UPDATE`, `DELETE`, `SELECT` directo a tablas restringido).

### Cómo verificar la seguridad
Ejecuta los siguientes comandos en tu terminal mientras el contenedor está corriendo:

1. **Acceder a la terminal de la base de datos:**
   ```bash
   docker exec -it awos_db psql -U app_user -d awos
   ```

2. **Prueba de ÉXITO:**
   ```sql
   SELECT * FROM vw_sales_daily LIMIT 5;
   ```

3. **Prueba de FALLO:**
   ```sql
   SELECT * FROM customers;
   ```

---

### Evidencia `EXPLAIN`


**Caso 1: Filtro por fecha en ventas**

```sql
EXPLAIN
SELECT *
FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
```
**Resultado:**
```text
Index Scan using idx_orders_created_at on orders
```

**Caso 2: Búsqueda de Productos por nombre**
```sql
EXPLAIN
SELECT *
FROM order_items
WHERE product_id = 1;

```
**Resultado:**
```text
Index Scan using idx_order_items_product_id on order_items
```

