-- Run these in your MySQL database
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    class_teacher_id INT,
    academic_year VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS class_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT,
    subject_id INT,
    teacher_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Sample classes
INSERT INTO classes (class_name, section) VALUES 
('JSS 1', 'A'),
('JSS 2', 'A'), 
('JSS 3', 'A'),
('SS 1', 'A'),
('SS 2', 'A'),
('SS 3', 'A');

-- Sample subjects  
INSERT INTO subjects (subject_name, subject_code) VALUES
('Mathematics', 'MATH'),
('English Language', 'ENG'),
('Basic Science', 'BSC'),
('Social Studies', 'SOC'),
('Physics', 'PHY'),
('Chemistry', 'CHEM'),
('Biology', 'BIO');

-- Sample class-subject assignments (replace 1 with an actual teacher user ID)
INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 4, 1),
(2, 1, 1), (2, 2, 1), (2, 3, 1), (2, 4, 1),
(3, 1, 1), (3, 2, 1), (3, 3, 1), (3, 4, 1);