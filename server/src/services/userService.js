const bcrypt = require('bcryptjs');
const express = require("express");
const connection = require("../connection");
const { generateToken } = require("./jwtService");
const tableName = "users";

checkTableExistence();
const usersRouter = express.Router();

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

        // Inserted the new user
        connection.query(
          `INSERT INTO ${tableName} (first_name, last_name, email, password) VALUES (?, ?, ?, ?)`,
          [firstName, lastName, email, hashedPassword],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ status: 500, message: "Error creating user" });
            }

            // Generated token after user is created
            const userId = result.insertId;
            const token = generateToken(userId);

            // Update user with token
            connection.query(
              `UPDATE ${tableName} SET token = ? WHERE id = ?`,
              [token, userId],
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ status: 500, message: "Error saving token" });
                } else {
                  // give user details
                  connection.query(
                    `SELECT * FROM ${tableName} WHERE id = ?`,
                    [userId],
                    (err, result) => {
                      if (err) {
                        return res.status(400).json({
                          status: 400,
                          message: "Error checking user",
                        });
                      }
                      if (!result.length) {
                        return res.status(400).json({
                          status: 400,
                          message: "Failed to register",
                        });
                      }
                      
                      // Respond with success and token
                      res.status(200).json({
                        status: 200,
                        message: "User created successfully",
                        data: result[0],
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

      // Compared hashed password
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Incorrect password" });
        }
        if (!isMatch) {
          return res
            .status(400)
            .json({ status: 400, message: "Incorrect password" });
        }

        // Generated token for logged-in user
        const token = generateToken(user.id);
        res.status(200).json({
          status: 200,
          message: "Login successful",
          data: { ...user, token },
        });
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
  const { firstName, lastName, email, password, role, mobile } = req.body;
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

        // Inserted the new user
        connection.query(
          `INSERT INTO ${tableName} (first_name, last_name, email, password, role, mobile) VALUES (?, ?, ?, ?, ?, ?)`,
          [firstName, lastName, email, hashedPassword, role, mobile],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ status: 500, message: "Error while adding user" });
            }

            // Generated token after user is created
            const userId = result.insertId;
            const token = generateToken(userId);

            // Update user with token
            connection.query(
              `UPDATE ${tableName} SET token = ? WHERE id = ?`,
              [token, userId],
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ status: 500, message: "Error saving token" });
                } else {
                  // give user details
                  connection.query(
                    `SELECT * FROM ${tableName} WHERE id = ?`,
                    [userId],
                    (err, result) => {
                      if (err) {
                        return res.status(400).json({
                          status: 400,
                          message: "Error checking user",
                        });
                      }
                      if (!result.length) {
                        return res.status(400).json({
                          status: 400,
                          message: "Failed to add",
                        });
                      }
                      // Respond with success and token
                      res.status(200).json({
                        status: 200,
                        message: "User added successfully",
                        data: result[0],
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
});

/* Get user details by id */
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
          .json({ status: 400, message: "Error while getting users" });
      } else {
        if (!result?.length) {
          return res
            .status(400)
            .json({ status: 400, message: "User not found" });
        }
        return res.status(200).json({ status: 200, data: result[0] });
      }
    }
  );
});

/* Delete user */
usersRouter.delete("/user/delete", (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "User Id not found in request" });
  }
  connection.query(
    `DELETE FROM ${tableName} WHERE id = ?`,
    [parseInt(id)],
    (err) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while getting users" });
      }
      return res
        .status(200)
        .json({ status: 200, data: "User deleted successfully" });
    }
  );
});

/* Edit user details */
usersRouter.post("/user/edit", (req, res) => {
  const userId = req.query?.id;
  const { firstName, lastName, email, password, role, mobile } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "User Id not found in request" });
  }

  connection.query(
    `UPDATE ${tableName} SET first_name = ?, last_name = ?, email = ?, password = ?, role = ?, mobile = ? WHERE id = ?`,
    [firstName, lastName, email, password, role, mobile, userId],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error while updating user" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      // return the updated user details
      connection.query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [userId],
        (err, result) => {
          if (err) {
            return res.status(400).json({
              status: 400,
              message: "Error fetching updated user",
            });
          }
          return res.status(200).json({ status: 200, data: result[0] });
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
      const createQuery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255), email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255), token VARCHAR(255) UNIQUE, role VARCHAR(255) DEFAULT 'customer', mobile VARCHAR(10), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;

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
