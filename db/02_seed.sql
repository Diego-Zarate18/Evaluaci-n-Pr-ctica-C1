INSERT INTO categories (name) VALUES
('Bebidas'),
('Panadería'),
('Comida');

INSERT INTO products (name, category_id, price, stock, active) VALUES
('Café Americano', 1, 30.00, 5, true),
('Capuccino', 1, 45.00, 40, true),
('Latte', 1, 50.00, 8, true),
('Croissant', 2, 25.00, 3, true),
('Muffin', 2, 20.00, 15, true),
('Sandwich', 3, 60.00, 6, true);

INSERT INTO customers (name, email) VALUES
('Ana López', 'ana@correo.com'),
('Luis Pérez', 'luis@correo.com'),
('María Gómez', 'maria@correo.com'),
('Carlos Ruiz', 'carlos@correo.com');

INSERT INTO orders (customer_id, created_at, status, channel) VALUES
(1, '2024-01-10', 'paid', 'counter'),
(2, '2024-01-10', 'paid', 'app'),
(1, '2024-01-11', 'paid', 'counter'),
(3, '2024-01-12', 'paid', 'app'),
(4, '2024-01-13', 'paid', 'counter'),
(2, '2024-01-14', 'paid', 'app');

INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES
(1, 1, 2, 30.00),
(1, 4, 1, 25.00),
(2, 2, 1, 45.00),
(2, 5, 2, 20.00),
(3, 1, 1, 30.00),
(3, 6, 1, 60.00),
(4, 3, 2, 50.00),
(5, 4, 3, 25.00),
(6, 2, 2, 45.00);

INSERT INTO payments (order_id, method, paid_amount) VALUES
(1, 'cash', 85.00),
(2, 'card', 85.00),
(3, 'card', 90.00),
(4, 'card', 100.00),
(5, 'cash', 75.00),
(6, 'card', 90.00);