CREATE DATABASE IF NOT EXISTS student_permission_leave;
USE student_permission_leave;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'proctor', 'hod', 'admin') NOT NULL,
  department VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
  user_id INT PRIMARY KEY,
  roll_number VARCHAR(50) UNIQUE,
  course VARCHAR(120),
  year INT,
  faculty_id INT,
  proctor_id INT,
  CONSTRAINT fk_student_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_student_faculty FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_student_proctor FOREIGN KEY (proctor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  request_type ENUM('leave', 'permission') NOT NULL,
  subject VARCHAR(180) NOT NULL,
  reason TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  from_time TIME,
  to_time TIME,
  status ENUM('pending_faculty', 'pending_proctor', 'pending_hod', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending_faculty',
  current_approver_role ENUM('faculty', 'proctor', 'hod', 'admin'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_request_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS approvals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  approver_id INT NOT NULL,
  approver_role ENUM('faculty', 'proctor', 'hod', 'admin') NOT NULL,
  action ENUM('approve', 'reject') NOT NULL,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_approval_request FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_approval_user FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_requests_student ON requests(student_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
