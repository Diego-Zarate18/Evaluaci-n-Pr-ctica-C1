CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INT NOT NULL,
  active BOOLEAN DEFAULT true,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  created_at DATE NOT NULL,
  status TEXT NOT NULL,
  channel TEXT NOT NULL,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  CONSTRAINT fk_items_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id),
  CONSTRAINT fk_items_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  method TEXT NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL,
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
);
