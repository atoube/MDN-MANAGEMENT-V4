-- Script d'initialisation de la base de données dbs14285488
-- Base de données MariaDB - MADON Management Suite

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS MDN_SUITE;
USE MDN_SUITE;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('admin', 'hr', 'delivery', 'stock_manager', 'seller', 'employee', 'marketing') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des employés
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    role VARCHAR(50),
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    salary DECIMAL(10,2),
    hire_date DATE,
    photo_url VARCHAR(500),
    address TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des absences
CREATE TABLE IF NOT EXISTS absences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type ENUM('vacation', 'sick_leave', 'personal_leave', 'maternity_leave', 'paternity_leave', 'other') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    total_days INT,
    reason TEXT,
    document_url VARCHAR(500),
    affects_salary BOOLEAN DEFAULT FALSE,
    affects_deliveries BOOLEAN DEFAULT FALSE,
    affects_sales BOOLEAN DEFAULT FALSE,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- Table des modules
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des projets
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('planning', 'active', 'completed', 'cancelled', 'on_hold') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    actual_cost DECIMAL(12,2) DEFAULT 0,
    progress INT DEFAULT 0,
    created_by INT NOT NULL,
    project_manager INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (project_manager) REFERENCES employees(id) ON DELETE SET NULL
);

-- Table des tâches
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'review', 'done', 'cancelled') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to INT,
    created_by INT NOT NULL,
    project_id INT,
    due_date DATE,
    start_date DATE,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    size BIGINT,
    url VARCHAR(500),
    uploaded_by INT NOT NULL,
    project_id INT,
    task_id INT,
    category ENUM('contract', 'invoice', 'report', 'presentation', 'manual', 'other') DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Table des transactions financières
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    category VARCHAR(100),
    employee_id INT,
    project_id INT,
    invoice_id INT,
    payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'check', 'other') DEFAULT 'bank_transfer',
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Table des factures
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    due_date DATE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    items JSON,
    notes TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE
);

-- Table des vendeurs
CREATE TABLE IF NOT EXISTS sellers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    hire_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des ventes
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    seller_id INT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    category VARCHAR(100),
    supplier VARCHAR(255),
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des livraisons
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(100) UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    delivery_address TEXT NOT NULL,
    status ENUM('pending', 'in_transit', 'delivered', 'failed', 'returned') DEFAULT 'pending',
    delivery_date DATE,
    estimated_delivery DATE,
    driver_id INT,
    vehicle_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Table des destinataires marketing
CREATE TABLE IF NOT EXISTS recipients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    status ENUM('active', 'inactive', 'unsubscribed', 'bounced') DEFAULT 'active',
    source VARCHAR(100),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des groupes de destinataires
CREATE TABLE IF NOT EXISTS recipient_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres des groupes
CREATE TABLE IF NOT EXISTS recipient_group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    group_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES recipient_groups(id) ON DELETE CASCADE
);

-- Table des campagnes marketing
CREATE TABLE IF NOT EXISTS email_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    status ENUM('draft', 'scheduled', 'sent', 'cancelled') DEFAULT 'draft',
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    recipient_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    clicked_count INT DEFAULT 0,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE
);

-- Table des statistiques des médias sociaux
CREATE TABLE IF NOT EXISTS social_media_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    followers INT DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    reach INT DEFAULT 0,
    impressions INT DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des posts des médias sociaux
CREATE TABLE IF NOT EXISTS social_media_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    comments INT DEFAULT 0,
    reach INT DEFAULT 0,
    posted_at TIMESTAMP,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE
);

-- Table des connexions des médias sociaux
CREATE TABLE IF NOT EXISTS social_media_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rapports de paie
CREATE TABLE IF NOT EXISTS payroll_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_rate DECIMAL(5,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) NOT NULL,
    status ENUM('draft', 'approved', 'paid') DEFAULT 'draft',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Table des congés payés
CREATE TABLE IF NOT EXISTS paid_leave_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    year INT NOT NULL,
    total_days INT DEFAULT 25,
    used_days INT DEFAULT 0,
    remaining_days INT DEFAULT 25,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- ========================================
-- INSERTION DES DONNÉES DE TEST LOGIQUES
-- ========================================

-- Insertion des modules
INSERT INTO modules (name, path, icon, enabled, order_index, description) VALUES
('Tableau de bord', '/', 'LayoutDashboard', true, 1, 'Vue d\'ensemble de l\'entreprise'),
('Employés', '/employees', 'Users', true, 2, 'Gestion des employés et RH'),
('Livraisons', '/deliveries', 'Truck', true, 3, 'Suivi des livraisons'),
('Stock', '/stocks', 'Package', true, 4, 'Gestion des stocks et produits'),
('Ventes', '/sales', 'Store', true, 5, 'Suivi des ventes et commissions'),
('Tâches', '/tasks', 'ClipboardList', true, 6, 'Gestion des projets et tâches'),
('Marketing', '/marketing', 'Share2', true, 7, 'Campagnes marketing et réseaux sociaux'),
('Finances', '/finance', 'DollarSign', true, 8, 'Comptabilité et rapports financiers');

-- Insertion des utilisateurs
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@madon.com', '$2b$10$rQZ8K9mN2pL1vX3yU7wE4t', 'Administrateur Principal', 'admin'),
('hr@madon.com', '$2b$10$rQZ8K9mN2pL1vX3yU7wE4t', 'Manager RH', 'hr'),
('delivery@madon.com', '$2b$10$rQZ8K9mN2pL1vX3yU7wE4t', 'Responsable Livraisons', 'delivery'),
('stock@madon.com', '$2b$10$rQZ8K9mN2pL1vX3yU7wE4t', 'Gestionnaire Stock', 'stock_manager'),
('sales@madon.com', '$2b$10$rQZ8K9mN2pL1vX3yU7wE4t', 'Directeur Commercial', 'seller'),
('marketing@madon.com', '$2b$10$rQZ8K9mN2pL1vX3yU7wE4t', 'Responsable Marketing', 'marketing');

-- Insertion des employés
INSERT INTO employees (first_name, last_name, email, phone, department, position, role, status, salary, hire_date, address, emergency_contact, emergency_phone) VALUES
('Jean', 'Dupont', 'jean.dupont@madon.com', '+33123456789', 'RH', 'Manager RH', 'hr', 'active', 4500.00, '2023-01-15', '123 Rue de la Paix, Paris', 'Marie Dupont', '+33123456790'),
('Marie', 'Martin', 'marie.martin@madon.com', '+33123456791', 'Livraison', 'Livreur Senior', 'delivery', 'active', 2800.00, '2023-02-20', '456 Avenue des Champs, Lyon', 'Pierre Martin', '+33123456792'),
('Pierre', 'Durand', 'pierre.durand@madon.com', '+33123456793', 'Ventes', 'Commercial Senior', 'seller', 'active', 3200.00, '2023-03-10', '789 Boulevard Central, Marseille', 'Sophie Durand', '+33123456794'),
('Sophie', 'Leroy', 'sophie.leroy@madon.com', '+33123456795', 'Marketing', 'Responsable Marketing', 'marketing', 'active', 3800.00, '2023-04-05', '321 Rue du Commerce, Toulouse', 'Thomas Leroy', '+33123456796'),
('Thomas', 'Moreau', 'thomas.moreau@madon.com', '+33123456797', 'Stock', 'Gestionnaire Stock', 'stock_manager', 'active', 2600.00, '2023-05-12', '654 Avenue de l\'Industrie, Nantes', 'Julie Moreau', '+33123456798'),
('Julie', 'Petit', 'julie.petit@madon.com', '+33123456799', 'Livraison', 'Livreur', 'delivery', 'active', 2400.00, '2023-06-18', '987 Rue des Fleurs, Bordeaux', 'Marc Petit', '+33123456800'),
('Marc', 'Roux', 'marc.roux@madon.com', '+33123456801', 'Ventes', 'Commercial', 'seller', 'active', 2900.00, '2023-07-22', '147 Boulevard de la République, Nice', 'Anne Roux', '+33123456802'),
('Anne', 'Simon', 'anne.simon@madon.com', '+33123456803', 'RH', 'Assistant RH', 'hr', 'active', 2200.00, '2023-08-30', '258 Rue de la Liberté, Strasbourg', 'Paul Simon', '+33123456804'),
('Paul', 'Michel', 'paul.michel@madon.com', '+33123456805', 'Marketing', 'Assistant Marketing', 'marketing', 'active', 2400.00, '2023-09-14', '369 Avenue Victor Hugo, Montpellier', 'Claire Michel', '+33123456806'),
('Claire', 'Garcia', 'claire.garcia@madon.com', '+33123456807', 'Stock', 'Assistant Stock', 'stock_manager', 'active', 2100.00, '2023-10-08', '741 Rue de la Gare, Lille', 'François Garcia', '+33123456808');

-- Insertion des vendeurs
INSERT INTO sellers (name, email, phone, address, commission_rate, status, hire_date) VALUES
('Pierre Durand', 'pierre.durand@madon.com', '+33123456793', '789 Boulevard Central, Marseille', 5.00, 'active', '2023-03-10'),
('Marc Roux', 'marc.roux@madon.com', '+33123456801', '147 Boulevard de la République, Nice', 4.50, 'active', '2023-07-22'),
('Sophie Leroy', 'sophie.leroy@madon.com', '+33123456795', '321 Rue du Commerce, Toulouse', 6.00, 'active', '2023-04-05');

-- Insertion des produits
INSERT INTO products (name, description, sku, price, cost, category, supplier, stock_quantity, min_stock_level) VALUES
('Ordinateur Portable Pro', 'Ordinateur portable professionnel 15"', 'LAPTOP-001', 899.99, 650.00, 'Informatique', 'TechSupplier', 25, 5),
('Smartphone Business', 'Smartphone pour professionnels', 'PHONE-001', 599.99, 450.00, 'Téléphonie', 'MobileCorp', 40, 10),
('Tablette Tactile', 'Tablette 10" pour présentations', 'TABLET-001', 299.99, 220.00, 'Informatique', 'TechSupplier', 30, 8),
('Imprimante Laser', 'Imprimante laser monochrome', 'PRINTER-001', 199.99, 150.00, 'Bureautique', 'OfficeSupply', 15, 3),
('Écran 24"', 'Écran LED 24 pouces', 'MONITOR-001', 149.99, 110.00, 'Informatique', 'TechSupplier', 20, 5);

-- Insertion des projets
INSERT INTO projects (name, description, status, priority, start_date, end_date, budget, actual_cost, progress, created_by, project_manager) VALUES
('Refonte Site Web', 'Modernisation du site web corporate', 'active', 'high', '2024-01-15', '2024-06-30', 50000.00, 25000.00, 50, 1, 1),
('Lancement Produit X', 'Lancement du nouveau produit phare', 'planning', 'urgent', '2024-03-01', '2024-08-31', 75000.00, 0.00, 0, 1, 4),
('Optimisation Logistique', 'Amélioration des processus de livraison', 'active', 'medium', '2024-02-01', '2024-05-31', 30000.00, 15000.00, 60, 1, 2),
('Campagne Marketing Q2', 'Campagne marketing pour le 2ème trimestre', 'active', 'high', '2024-04-01', '2024-06-30', 25000.00, 8000.00, 30, 1, 4);

-- Insertion des tâches
INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, project_id, due_date, estimated_hours, actual_hours) VALUES
('Design Interface', 'Créer les maquettes de l\'interface', 'in_progress', 'high', 4, 1, 1, '2024-04-15', 40.00, 25.00),
('Développement Frontend', 'Développer l\'interface utilisateur', 'todo', 'high', 4, 1, 1, '2024-05-15', 80.00, 0.00),
('Tests Utilisateurs', 'Conduire les tests utilisateurs', 'todo', 'medium', 8, 1, 1, '2024-06-15', 20.00, 0.00),
('Étude de Marché', 'Analyser la concurrence', 'done', 'high', 4, 1, 2, '2024-03-15', 30.00, 28.00),
('Plan Marketing', 'Élaborer le plan marketing', 'in_progress', 'high', 4, 1, 2, '2024-04-30', 25.00, 15.00),
('Optimisation Routes', 'Optimiser les routes de livraison', 'in_progress', 'medium', 2, 1, 3, '2024-04-30', 35.00, 20.00),
('Formation Équipe', 'Former l\'équipe aux nouveaux processus', 'todo', 'medium', 2, 1, 3, '2024-05-15', 16.00, 0.00),
('Création Contenu', 'Créer le contenu de la campagne', 'in_progress', 'high', 4, 1, 4, '2024-05-15', 40.00, 20.00);

-- Insertion des absences
INSERT INTO absences (employee_id, start_date, end_date, type, status, total_days, reason, affects_salary, approved_by) VALUES
(2, '2024-04-15', '2024-04-19', 'vacation', 'approved', 5, 'Congés de printemps', false, 1),
(3, '2024-05-20', '2024-05-22', 'personal_leave', 'pending', 3, 'Rendez-vous personnel', false, NULL),
(5, '2024-06-10', '2024-06-14', 'vacation', 'approved', 5, 'Vacances d\'été', false, 1),
(7, '2024-04-25', '2024-04-26', 'sick_leave', 'approved', 2, 'Maladie', true, 1);

-- Insertion des ventes
INSERT INTO sales (date, seller_id, client_name, client_email, amount, commission, status) VALUES
('2024-01-15', 1, 'Entreprise ABC', 'contact@abc.com', 2500.00, 125.00, 'completed'),
('2024-01-20', 2, 'Société XYZ', 'info@xyz.com', 1800.00, 81.00, 'completed'),
('2024-02-05', 1, 'Startup Innov', 'hello@innov.com', 3200.00, 160.00, 'completed'),
('2024-02-12', 3, 'Corporation DEF', 'sales@def.com', 4500.00, 270.00, 'completed'),
('2024-03-01', 2, 'Groupe GHI', 'contact@ghi.com', 2800.00, 126.00, 'completed'),
('2024-03-15', 1, 'Entreprise JKL', 'info@jkl.com', 1900.00, 95.00, 'completed');

-- Insertion des livraisons
INSERT INTO deliveries (tracking_number, customer_name, customer_email, customer_phone, delivery_address, status, delivery_date, estimated_delivery, driver_id, notes) VALUES
('TRK001', 'Jean Martin', 'jean.martin@email.com', '+33123456810', '123 Rue de la Paix, Paris', 'delivered', '2024-01-20', '2024-01-20', 2, 'Livraison réussie'),
('TRK002', 'Marie Dubois', 'marie.dubois@email.com', '+33123456811', '456 Avenue des Champs, Lyon', 'delivered', '2024-01-22', '2024-01-22', 2, 'Client satisfait'),
('TRK003', 'Pierre Leroy', 'pierre.leroy@email.com', '+33123456812', '789 Boulevard Central, Marseille', 'in_transit', NULL, '2024-01-25', 6, 'En cours de livraison'),
('TRK004', 'Sophie Moreau', 'sophie.moreau@email.com', '+33123456813', '321 Rue du Commerce, Toulouse', 'pending', NULL, '2024-01-26', 6, 'En attente de préparation'),
('TRK005', 'Thomas Petit', 'thomas.petit@email.com', '+33123456814', '654 Avenue de l\'Industrie, Nantes', 'delivered', '2024-01-23', '2024-01-23', 2, 'Livraison express');

-- Insertion des factures
INSERT INTO invoices (number, date, due_date, client_name, client_email, client_address, amount, tax_amount, total_amount, status, created_by) VALUES
('INV-2024-001', '2024-01-15', '2024-02-15', 'Entreprise ABC', 'contact@abc.com', '123 Rue de la Paix, Paris', 2500.00, 500.00, 3000.00, 'paid', 3),
('INV-2024-002', '2024-01-20', '2024-02-20', 'Société XYZ', 'info@xyz.com', '456 Avenue des Champs, Lyon', 1800.00, 360.00, 2160.00, 'paid', 3),
('INV-2024-003', '2024-02-05', '2024-03-05', 'Startup Innov', 'hello@innov.com', '789 Boulevard Central, Marseille', 3200.00, 640.00, 3840.00, 'sent', 7),
('INV-2024-004', '2024-02-12', '2024-03-12', 'Corporation DEF', 'sales@def.com', '321 Rue du Commerce, Toulouse', 4500.00, 900.00, 5400.00, 'sent', 7);

-- Insertion des transactions
INSERT INTO transactions (date, type, amount, description, category, employee_id, project_id, payment_method, status) VALUES
('2024-01-15', 'income', 3000.00, 'Paiement facture INV-2024-001', 'Ventes', 3, NULL, 'bank_transfer', 'completed'),
('2024-01-20', 'income', 2160.00, 'Paiement facture INV-2024-002', 'Ventes', 3, NULL, 'bank_transfer', 'completed'),
('2024-01-25', 'expense', 500.00, 'Achat fournitures bureau', 'Fournitures', NULL, 1, 'credit_card', 'completed'),
('2024-02-01', 'expense', 1200.00, 'Formation équipe', 'Formation', NULL, 3, 'bank_transfer', 'completed'),
('2024-02-05', 'income', 3840.00, 'Paiement facture INV-2024-003', 'Ventes', 7, NULL, 'bank_transfer', 'completed'),
('2024-02-10', 'expense', 800.00, 'Publicité en ligne', 'Marketing', NULL, 4, 'credit_card', 'completed');

-- Insertion des destinataires marketing
INSERT INTO recipients (email, name, phone, company, status, source) VALUES
('client1@email.com', 'Jean Dupont', '+33123456820', 'Entreprise A', 'active', 'Site web'),
('client2@email.com', 'Marie Martin', '+33123456821', 'Société B', 'active', 'Salon'),
('client3@email.com', 'Pierre Durand', '+33123456822', 'Startup C', 'active', 'Réseaux sociaux'),
('client4@email.com', 'Sophie Leroy', '+33123456823', 'Corporation D', 'active', 'Site web'),
('client5@email.com', 'Thomas Moreau', '+33123456824', 'Groupe E', 'active', 'Partenariat'),
('client6@email.com', 'Julie Petit', '+33123456825', 'Entreprise F', 'inactive', 'Site web'),
('client7@email.com', 'Marc Roux', '+33123456826', 'Société G', 'active', 'Salon'),
('client8@email.com', 'Anne Simon', '+33123456827', 'Startup H', 'active', 'Réseaux sociaux');

-- Insertion des groupes de destinataires
INSERT INTO recipient_groups (name, description) VALUES
('Clients Premium', 'Clients avec un chiffre d\'affaires élevé'),
('Prospects Chauds', 'Prospects très intéressés'),
('Anciens Clients', 'Clients qui n\'ont pas commandé récemment'),
('Nouveaux Clients', 'Clients récemment acquis');

-- Insertion des membres des groupes
INSERT INTO recipient_group_members (recipient_id, group_id) VALUES
(1, 1), (2, 1), (3, 2), (4, 2), (5, 3), (6, 3), (7, 4), (8, 4);

-- Insertion des campagnes marketing
INSERT INTO email_campaigns (name, subject, content, status, scheduled_at, recipient_count, created_by) VALUES
('Campagne Printemps 2024', 'Découvrez nos nouveautés de printemps !', 'Contenu de la campagne printemps...', 'sent', '2024-03-01 10:00:00', 500, 4),
('Promotion Été', 'Profitez de -20% sur toute la collection été', 'Contenu de la promotion été...', 'scheduled', '2024-06-01 10:00:00', 800, 4),
('Newsletter Mensuelle', 'Votre newsletter mensuelle', 'Contenu de la newsletter...', 'draft', NULL, 1200, 4);

-- Insertion des statistiques des médias sociaux
INSERT INTO social_media_stats (platform, followers, engagement_rate, reach, impressions, date) VALUES
('Facebook', 5000, 3.2, 15000, 25000, '2024-01-31'),
('Instagram', 3200, 4.1, 12000, 18000, '2024-01-31'),
('LinkedIn', 1800, 2.8, 8000, 12000, '2024-01-31'),
('Twitter', 2500, 3.5, 10000, 15000, '2024-01-31'),
('Facebook', 5200, 3.4, 16000, 27000, '2024-02-29'),
('Instagram', 3400, 4.3, 13000, 19000, '2024-02-29'),
('LinkedIn', 1900, 3.0, 8500, 13000, '2024-02-29'),
('Twitter', 2600, 3.7, 11000, 16000, '2024-02-29');

-- Insertion des posts des médias sociaux
INSERT INTO social_media_posts (platform, content, image_url, likes, shares, comments, reach, posted_at, created_by) VALUES
('Facebook', 'Découvrez notre nouveau produit révolutionnaire ! 🚀', '/images/product-launch.jpg', 150, 25, 12, 2000, '2024-01-15 10:00:00', 4),
('Instagram', 'Notre équipe au travail 💪 #TeamWork #Innovation', '/images/team-working.jpg', 89, 15, 8, 1200, '2024-01-20 14:30:00', 4),
('LinkedIn', 'Article : Les tendances du marché en 2024', '/images/market-trends.jpg', 45, 30, 5, 800, '2024-02-01 09:00:00', 4),
('Twitter', 'Nouvelle collaboration annoncée ! 🎉', '/images/collaboration.jpg', 67, 18, 10, 1500, '2024-02-10 16:00:00', 4);

-- Insertion des rapports de paie
INSERT INTO payroll_reports (employee_id, month, year, base_salary, overtime_hours, overtime_rate, overtime_pay, deductions, net_salary, status) VALUES
(1, 1, 2024, 4500.00, 5.00, 15.00, 75.00, 900.00, 3675.00, 'paid'),
(2, 1, 2024, 2800.00, 8.00, 12.00, 96.00, 560.00, 2336.00, 'paid'),
(3, 1, 2024, 3200.00, 3.00, 14.00, 42.00, 640.00, 2602.00, 'paid'),
(4, 1, 2024, 3800.00, 0.00, 0.00, 0.00, 760.00, 3040.00, 'paid'),
(5, 1, 2024, 2600.00, 10.00, 10.00, 100.00, 520.00, 2180.00, 'paid');

-- Insertion des congés payés
INSERT INTO paid_leave_balances (employee_id, year, total_days, used_days, remaining_days) VALUES
(1, 2024, 25, 5, 20),
(2, 2024, 25, 8, 17),
(3, 2024, 25, 3, 22),
(4, 2024, 25, 7, 18),
(5, 2024, 25, 4, 21),
(6, 2024, 25, 6, 19),
(7, 2024, 25, 2, 23),
(8, 2024, 25, 9, 16),
(9, 2024, 25, 5, 20),
(10, 2024, 25, 3, 22);

-- Index pour améliorer les performances
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_absences_employee_id ON absences(employee_id);
CREATE INDEX idx_absences_status ON absences(status);
CREATE INDEX idx_absences_date_range ON absences(start_date, end_date);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_manager ON projects(project_manager);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_sales_seller_id ON sales(seller_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_invoices_number ON invoices(number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_recipients_email ON recipients(email);
CREATE INDEX idx_recipients_status ON recipients(status);
CREATE INDEX idx_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_social_stats_platform_date ON social_media_stats(platform, date);
CREATE INDEX idx_payroll_employee_month_year ON payroll_reports(employee_id, month, year);
CREATE INDEX idx_leave_balances_employee_year ON paid_leave_balances(employee_id, year);
