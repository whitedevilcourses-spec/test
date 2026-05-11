USE student_permission_leave;

INSERT INTO users (id, name, email, password_hash, role, department, phone) VALUES
  (1, 'System Admin', 'admin@example.com', '$2b$10$ceMGAMLcVvfP3iCf2YucaeKZa4fne77jORX9CxJ9.iCI7fj0MScSG', 'admin', 'Administration', '9000000000'),
  (2, 'Priya Student', 'student@example.com', '$2b$10$7wbvqrD1vbqpDV9gI6BIVe8UR8g.yI/SsWXiuDSgluEgnusYhANRy', 'student', 'Computer Science', '9000000001'),
  (3, 'Dr. Meera Faculty', 'faculty@example.com', '$2b$10$9BsjwpNE0YyAbQmNCDF6ru8.4.ojkSVXDZYhSo.l0.nKSi6Toe2Ei', 'faculty', 'Computer Science', '9000000002'),
  (4, 'Prof. Arun Proctor', 'proctor@example.com', '$2b$10$OkReRit0fT8uDShdkgT9k.VAEfK2QsoyRf1fnDTsZJ9LhBMGGQj.2', 'proctor', 'Computer Science', '9000000003'),
  (5, 'Dr. Kavitha HOD', 'hod@example.com', '$2b$10$jtrAVD6ei3mwfLZYDJWrju57LuzkuZ8y3I8x9IdVtBn/0HkqvgHwq', 'hod', 'Computer Science', '9000000004')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role = VALUES(role),
  department = VALUES(department),
  phone = VALUES(phone);

INSERT INTO student_profiles (user_id, roll_number, course, year, faculty_id, proctor_id) VALUES
  (2, 'CS2026001', 'B.Tech Computer Science', 3, 3, 4)
ON DUPLICATE KEY UPDATE
  roll_number = VALUES(roll_number),
  course = VALUES(course),
  year = VALUES(year),
  faculty_id = VALUES(faculty_id),
  proctor_id = VALUES(proctor_id);
