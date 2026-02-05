-- =============================================
-- 1. Ventas Diarias
-- Grano: Diario
-- Metricas: Revenue total, numero de tickets, ticket promedio
-- Verify: SELECT * FROM vw_sales_daily WHERE sale_date > '2023-01-01';
-- =============================================
DROP VIEW IF EXISTS vw_sales_daily CASCADE;
CREATE VIEW vw_sales_daily AS
WITH daily_sales AS (
  SELECT
    DATE(o.created_at) AS sale_date, 
    SUM(p.paid_amount) AS total_revenue, 
    COUNT(DISTINCT o.id) AS ticket_count 
  FROM orders o
  JOIN payments p ON p.order_id = o.id
  GROUP BY DATE(o.created_at)
)
SELECT
  sale_date,
  total_revenue,
  ticket_count,
  total_revenue / NULLIF(ticket_count, 0) AS avg_ticket 
FROM daily_sales;

-- =============================================
-- 2. Valor del Cliente (Customer Value)
-- Grano: Por Cliente
-- Metricas: Total gastado, total ordenes
-- Req: HAVING para filtrar clientes inactivos
-- Verify: SELECT * FROM vw_customer_value ORDER BY total_spent DESC LIMIT 5;
-- =============================================
DROP VIEW IF EXISTS vw_customer_value CASCADE;
CREATE VIEW vw_customer_value AS
SELECT
  c.id AS customer_id,
  c.name AS customer_name,
  COUNT(o.id) AS total_orders,
  SUM(p.paid_amount) AS total_spent,
  AVG(p.paid_amount) AS avg_ticket
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN payments p ON p.order_id = o.id
GROUP BY c.id, c.name
HAVING SUM(p.paid_amount) > 0; 

-- =============================================
-- 3. Payment Mix
-- Grano: Por método de pago
-- Metricas: Total monto, % del total
-- Verify: SELECT * FROM vw_payment_mix;
-- =============================================
DROP VIEW IF EXISTS vw_payment_mix CASCADE;
CREATE VIEW vw_payment_mix AS
SELECT
  method AS payment_method,
  COUNT(*) AS total_payments,
  SUM(paid_amount) AS total_amount,
  ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER ()), 2) as percentage_usage 
FROM payments
GROUP BY method
HAVING COUNT(*) > 0; 

-- =============================================
-- 4. Top Productos (Ranked)
-- Grano: Por producto
-- Metricas: Revenue, unidades, ranking
-- Req: Window Function, CTE
-- Verify: SELECT * FROM vw_top_products_ranked WHERE rank_revenue <= 3;
-- =============================================
DROP VIEW IF EXISTS vw_top_products_ranked CASCADE;
CREATE VIEW vw_top_products_ranked AS
WITH product_sales AS (
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(oi.qty * oi.unit_price) AS total_revenue, 
    SUM(oi.qty) AS total_units
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  JOIN orders o ON o.id = oi.order_id
  WHERE o.status = 'paid' 
  GROUP BY p.id, p.name
)
SELECT
  product_id,
  product_name,
  total_revenue,
  total_units,
  RANK() OVER (ORDER BY total_revenue DESC) AS rank_revenue 
FROM product_sales
WHERE total_revenue > 0;

-- =============================================
-- 5. Riesgo de Inventario
-- Grano: Por producto
-- Metricas: Stock, nivel de riesgo (CASE)
-- Req: CASE, Calculated Field
-- Verify: SELECT * FROM vw_inventory_risk WHERE nivel_riesgo = 'ALTO';
-- =============================================
DROP VIEW IF EXISTS vw_inventory_risk CASCADE;
CREATE VIEW vw_inventory_risk AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  c.name AS category_name,
  p.stock,
  CASE
    WHEN p.stock <= 5 THEN 'ALTO'
    WHEN p.stock BETWEEN 6 AND 10 THEN 'MEDIO'
    ELSE 'BAJO'
  END AS risk_level,
  ROUND(
    (p.stock::numeric / NULLIF(MAX(p.stock) OVER (), 0)) * 100,
    2
  ) AS stock_percentage_relative
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.active = true
  AND p.stock <= 20; 