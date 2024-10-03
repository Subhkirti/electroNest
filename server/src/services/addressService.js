const createQuery =
  "CREATE TABLE addresses (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255), street VARCHAR(255), city VARCHAR(255), state VARCHAR(255), zip_code INT, FOREIGN KEY (user_id) REFERENCES users(id))";

