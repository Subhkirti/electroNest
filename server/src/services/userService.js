const tableName = "users";
const bcrypt = require("bcryptjs");
const express = require("express");
const connection = require("../connection");
const { generateToken, getUserIdFromToken } = require("./jwtService");
const usersRouter = express.Router();

checkTableExistence();

// Register(signup) API for new users
usersRouter.post("/register", (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  connection.query(
    `SELECT * FROM ${tableName} WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error checking user" });
      }
      if (result.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "User already exists. So, Please choose login option.",
        });
      }

      // Hash password before saving
      bcrypt.hash(password, 8, (err, hashedPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Error hashing password" });
        }

        // Insert new user
        connection.query(
          `INSERT INTO ${tableName} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
          [firstName, lastName, email, hashedPassword],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ status: 500, message: "Error creating user" });
            }

            const userId = result.insertId;
            const { token, expirationDate } = generateToken(userId);

            // Update user with token and expiration date
            connection.query(
              `UPDATE ${tableName} SET token = ?, expires_at = ? WHERE id = ?`,
              [token, expirationDate, userId],
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ status: 500, message: "Error saving token" });
                }

                // Fetch and return user details
                connection.query(
                  `SELECT * FROM ${tableName} WHERE id = ?`,
                  [userId],
                  (err, result) => {
                    if (err) {
                      return res
                        .status(400)
                        .json({ status: 400, message: "Error fetching user" });
                    }

                    res.status(200).json({
                      status: 200,
                      message: "User created successfully",
                      data: { ...result[0], expires_at: expirationDate },
                    });
                  }
                );
              }
            );
          }
        );
      });
    }
  );
});

// Login API for existing users
usersRouter.post("/signin", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    `SELECT * FROM ${tableName} WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: `Error during login ${err}` });
      }
      if (result.length === 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Incorrect email-Id or password" });
      }

      // Compare hashed password
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res
            .status(400)
            .json({ status: 400, message: "Incorrect password" });
        }

        const tokenData = generateToken(user.id);

        // Update user with new token and expiration date
        connection.query(
          `UPDATE ${tableName} SET token = ?, expires_at = ? WHERE id = ?`,
          [tokenData.token, tokenData.expirationDate, user.id],
          (err) => {
            if (err) {
              return res.status(500).json({ status: 500, message: "Error updating token" });
            }

            res.status(200).json({
              status: 200,
              message: "Login successful",
              data: { ...user, token: tokenData.token, expires_at: tokenData.expirationDate },
            });
          }
        );
      });
    }
  );
});

// Fetch all users API
usersRouter.get("/users", (req, res) => {
  const { pageNumber, pageSize } = req.query;
  const limit = parseInt(pageSize);
  const offset = (parseInt(pageNumber) - 1) * limit;

  connection.query(
    `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting users" });
      }

      // Query to get the total count of users
      connection.query(
        `SELECT COUNT(*) AS totalCount FROM ${tableName}`,
        (countErr, countResult) => {
          if (countErr) {
            return res
              .status(400)
              .json({ status: 400, message: "Error while counting users" });
          }
          const totalCount = countResult[0].totalCount;

          return res.status(200).json({
            status: 200,
            data: result,
            totalCount: totalCount,
          });
        }
      );
    }
  );
});

// Add user API for admins
usersRouter.post("/user/add", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (!userId) return;

  const { firstName, lastName, email, password, role, mobile } = req.body;

  // Check if user has admin role
  connection.query(
    `SELECT role FROM ${tableName} WHERE id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error verifying user role" });
      }

      if (!result.length || result[0].role !== "admin") {
        return res.status(403).json({
          status: 403,
          message: "Access denied. Only admins can add users.",
        });
      }

      // Proceed to check if email already exists
      connection.query(
        `SELECT * FROM ${tableName} WHERE email = ?`,
        [email],
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ status: 400, message: "Error checking user" });
          }
          if (result.length > 0) {
            return res.status(400).json({
              status: 400,
              message: "This User already exists.",
            });
          }

          // Hash password before saving
          bcrypt.hash(password, 8, (err, hashedPassword) => {
            if (err) {
              return res
                .status(500)
                .json({ status: 500, message: "Error hashing password" });
            }

            // Insert the new user
            connection.query(
              `INSERT INTO ${tableName} (first_name, last_name, email, password, role, mobile) VALUES (?, ?, ?, ?, ?, ?)`,
              [firstName, lastName, email, hashedPassword, role, mobile],
              (err, result) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ status: 500, message: "Error while adding user" });
                }

                const userId = result.insertId;
                const tokenData = generateToken(userId);

                // Update user with token and expiration date
                connection.query(
                  `UPDATE ${tableName} SET token = ?, expires_at = ? WHERE id = ?`,
                  [tokenData.token, tokenData.expirationDate, userId],
                  (err) => {
                    if (err) {
                      return res
                        .status(500)
                        .json({ status: 500, message: "Error saving token" });
                    } else {
                      // Fetch and return user details
                      connection.query(
                        `SELECT * FROM ${tableName} WHERE id = ?`,
                        [userId],
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              status: 400,
                              message: "Error fetching user",
                            });
                          }
                          res.status(200).json({
                            status: 200,
                            message: "User added successfully",
                            data: { ...result[0], expires_at: tokenData.expirationDate },
                          });
                        }
                      );
                    }
                  }
                );
              }
            );
          });
        }
      );
    }
  );
});

// Get user details by id
usersRouter.get("/user-details", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "User Id not found in request" });
  }

  connection.query(
    `SELECT * FROM ${tableName} WHERE id = ?`,
    [id],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting user" });
      } else {
        if (!result?.length) {
          return res
            .status(400)
            .json({ status: 400, message: "User not found" });
        }
        return res.status(200).json({
          status: 200,
          data: { ...result[0], expires_at: result[0].expires_at },
        });
      }
    }
  );
});

// Delete user
usersRouter.delete("/user/delete", (req, res) => {
  const userId = getUserIdFromToken(req, res);
  if (!userId) return;
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "User Id not found in request" });
  }

  // Check if the logged-in user has an admin role
  connection.query(
    `SELECT role FROM ${tableName} WHERE id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error verifying user role" });
      }

      if (!result.length || result[0].role !== "admin") {
        return res.status(403).json({
          status: 403,
          message: "Access denied. Only admins can delete users.",
        });
      }

      // Proceed to delete the user
      connection.query(
        `DELETE FROM ${tableName} WHERE id = ?`,
        [parseInt(id)],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: "Error while deleting user",
            });
          }
          res.status(200).json({
            status: 200,
            message: "User deleted successfully",
          });
        }
      );
    }
  );
});



function checkTableExistence() {
  // Checked and created users table if it does not exist
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking table existence:", results?.[0]?.count);
      return;
    }

    // If the table does not exist, create it
    if (results && results?.length && results[0].count === 0) {
      // Table creation query
      const createQuery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      mobile VARCHAR(15),
      token TEXT,
      expires_at DATETIME)`;

      connection.query(createQuery, (err) => {
        if (err) {
          console.error(`Error creating ${tableName} table: ${err}`);
        } else {
          console.log(`${tableName} table created successfully.`);
        }
      });
    } else {
      console.log(`${tableName} table already exists.`);
    }
  });
}

module.exports = usersRouter;
