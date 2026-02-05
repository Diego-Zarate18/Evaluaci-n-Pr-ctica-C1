CREATE INDEX idx_orders_created_at
ON orders (created_at);

CREATE INDEX idx_order_items_product_id
ON order_items (product_id);

CREATE INDEX idx_products_category_id
ON products (category_id);

