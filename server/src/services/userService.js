const bcrypt = require("bcrypt");
const connection = require("../connection");
const { generateToken, getUserIdFromToken } = require("./jwtService");
const tableName = "users";
const app = require("../app");

// Checked and created users table if it does not exist
const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_name = ?`;

connection.query(checkTableQuery, [tableName], (err, results) => {
  if (err) {
    console.error("Error checking table existence:", err);
    return;
  }

  // If the table does not exist, create it
  if (results[0].count === 0) {
    // Table creation query
    const createQuery = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255), email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255), token VARCHAR(255) UNIQUE, role VARCHAR(255) DEFAULT 'customer', mobile VARCHAR(10), createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;

    connection.query(createQuery, (err) => {
      if (err) {
        console.error(`Error creating ${tableName} table: ${err}`);
      } else {
        console.log("Table created successfully.");
      }
    });
  } else {
    console.log("Table already exists.");
  }
});

// Register(signup) API for new users
app.post("/register", (req, res) => {
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
        return res
          .status(400)
          .json({ status: 400, message: "User already exists" });
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
            const userId = result.insertId; // Get the newly created user ID
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
                }

                // Respond with success and token
                res.status(200).json({
                  status: 200,
                  message: "User created successfully",
                  data: { token },
                });
              }
            );
          }
        );
      });
    }
  );
});

// Login API for existing users
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    `SELECT * FROM ${tableName} WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error during login" });
      }
      if (result.length === 0) {
        return res.status(400).json({ status: 400, message: "User not found" });
      }

      // Compared hashed password
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Error comparing passwords" });
        }
        if (!isMatch) {
          return res
            .status(400)
            .json({ status: 400, message: "Incorrect password" });
        }

        // Generated token for logged-in user
        const token = generateToken(user.id);
        res
          .status(200)
          .json({
            status: 200,
            message: "Login successful",
            data: { ...user, token },
          });
      });
    }
  );
});

// User profile API to get user details
app.get("/user/profile", (req, res) => {
  const userToken = req.headers.authorization?.split(" ")[1]; //[Bearer, Token]
  if (!userToken) {
    return res.status(400).json({ status: 400, message: "Token not found." });
  }
  const userId = getUserIdFromToken(userToken);
  connection.query(
    `SELECT * FROM ${tableName} WHERE id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: 400, message: "Error checking user" });
      }
      if (!result.length) {
        return res
          .status(400)
          .json({ status: 400, message: "User profile not found." });
      }
      return res.status(200).json({ status: 200, data: result });
    }
  );
});

// All users API
app.get("/users", (req, res) => {
  connection.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Error while getting users" });
    }
    return res.status(200).json({ status: 200, data: result });
  });
});
