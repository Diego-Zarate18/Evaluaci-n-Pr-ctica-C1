CREATE VIEW vw_sales_daily AS
WITH daily_sales AS (
  SELECT
    o.created_at AS sale_date,
    SUM(p.paid_amount) AS total_ventas,
    COUNT(DISTINCT o.id) AS tickets
  FROM orders o
  JOIN payments p ON p.order_id = o.id
  GROUP BY o.created_at
)
SELECT
  sale_date,
  total_ventas,
  tickets,
  total_ventas / NULLIF(tickets, 0) AS ticket_promedio
FROM daily_sales;






CREATE OR REPLACE VIEW vw_customer_value AS
SELECT
  c.id AS customer_id,
  c.name AS customer_name,
  COUNT(o.id) AS total_orders,
  SUM(p.paid_amount) AS total_spent
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN payments p ON p.order_id = o.id
GROUP BY c.id, c.name;





CREATE OR REPLACE VIEW vw_payment_mix AS
SELECT
  method AS payment_method,
  COUNT(*) AS total_payments,
  SUM(paid_amount) AS total_amount
FROM payments
GROUP BY method;




CREATE OR REPLACE VIEW vw_top_products_ranked AS
WITH product_sales AS (
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    SUM(oi.qty * oi.unit_price) AS revenue,
    SUM(oi.qty) AS units
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  JOIN orders o ON o.id = oi.order_id
  WHERE o.status = 'paid'
  GROUP BY p.id, p.name
)
SELECT
  product_id,
  product_name,
  revenue,
  units,
  RANK() OVER (ORDER BY revenue DESC) AS rank_revenue
FROM product_sales
WHERE revenue > 0;





CREATE OR REPLACE VIEW vw_inventory_risk AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  c.name AS category_name,
  p.stock,
  CASE
    WHEN p.stock <= 5 THEN 'ALTO'
    WHEN p.stock BETWEEN 6 AND 10 THEN 'MEDIO'
    ELSE 'BAJO'
  END AS nivel_riesgo,
  ROUND(
    (p.stock::numeric / NULLIF(MAX(p.stock) OVER (), 0)) * 100,
    2
  ) AS porcentaje_riesgo
FROM products p
JOIN categories c ON c.id = p.category_id
WHERE p.active = true
  AND p.stock <= 10;


