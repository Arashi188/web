-- supabase/migrations/20240102_add_categories.sql

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add category_id to products table
ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES categories(id);

-- Insert some sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'),
('Home & Living', 'home-living', 'Beautiful items for your home', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'),
('Sports', 'sports', 'Sports equipment and gear', 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg');

-- Promotions table
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percent INTEGER NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    valid_until DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Promotion products (many-to-many)
CREATE TABLE promotion_products (
    promotion_id INTEGER REFERENCES promotions(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (promotion_id, product_id)
);