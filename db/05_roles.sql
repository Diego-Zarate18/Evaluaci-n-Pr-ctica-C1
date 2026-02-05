CREATE ROLE app_user
LOGIN
PASSWORD 'app_pass';

GRANT CONNECT ON DATABASE awos TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT ON
  vw_customer_value,
  vw_inventory_risk,
  vw_payment_mix,
  vw_sales_daily,
  vw_top_products_ranked
TO app_user;
