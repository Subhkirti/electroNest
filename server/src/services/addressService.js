const connection = require("../connection");
const app = require("../app");
const tableName = "addresses";
const usersTableName = "users";

checkAddressTableExistence();

// Add a new address for a user
app.post("/address/add", (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    street,
    city,
    state,
    zipCode,
    landmark,
    phoneNumber,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "User ID is required" });
  }

  const addAddressQuery = `INSERT INTO ${tableName} (user_id, first_name, last_name, street, city, state, zip_code, landmark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const addPhoneNoInUsersQuery = `UPDATE ${usersTableName} SET mobile = ? WHERE id = ?`;
  const findAddressQuery = `SELECT * FROM ${tableName} WHERE id = ?`;

  connection.query(
    addPhoneNoInUsersQuery,
    [phoneNumber, userId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error adding phone number" });
      }
      connection.query(
        addAddressQuery,
        [userId, firstName, lastName, street, city, state, zipCode, landmark],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ status: 500, message: "Error adding address" });
          }

          connection.query(findAddressQuery, [result.insertId], (err, results) => {
            if (err) {
              return res.status(500).json({
                status: 500,
                message: "Error while finding address details",
              });
            }

            res.status(200).json({
              status: 200,
              message: "Address added successfully",
              data: results?.[0],
            });
          });
        }
      );
    }
  );
});

// Fetch all addresses for a specific user
app.get("/addresses", (req, res) => {
  const userId = req.query?.id;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "User ID is required" });
  }

  const getAddressesQuery = `SELECT * FROM ${tableName} WHERE user_id = ?`;

  connection.query(getAddressesQuery, [userId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error fetching addresses" });
    }

    res.status(200).json({
      status: 200,
      data: result,
    });
  });
});

// Update an existing address
app.put("/address/edit", (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    street,
    city,
    state,
    zipCode,
    landmark,
    phoneNumber,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "Address ID is required" });
  }

  const updateAddressQuery = `UPDATE ${tableName} SET first_name = ?, last_name = ?, street = ?, city = ?, state = ?, zip_code = ?, landmark = ? WHERE id = ?`;
  const addPhoneNoInUsersQuery = `UPDATE ${usersTableName} SET mobile = ? WHERE id = ?`;

  connection.query(
    addPhoneNoInUsersQuery,
    [phoneNumber, userId],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error adding phone number" });
      }
      connection.query(
        updateAddressQuery,
        [firstName, lastName, street, city, state, zipCode, landmark, id],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ status: 500, message: "Error updating address" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              status: 404,
              message: "Address not found",
            });
          }

          res.status(200).json({
            status: 200,
            message: "Address updated successfully",
          });
        }
      );
    }
  );
});

// Delete an address
app.delete("/address/delete", (req, res) => {
  const addressId = req.query.id;

  if (!addressId) {
    return res
      .status(400)
      .json({ status: 400, message: "Address ID is required" });
  }

  const deleteAddressQuery = `DELETE FROM ${tableName} WHERE id = ?`;

  connection.query(deleteAddressQuery, [addressId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Error deleting address" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 404,
        message: "Address not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Address deleted successfully",
      data: addressId,
    });
  });
});

function checkAddressTableExistence() {
  const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}' AND table_name = ?`;

  connection.query(checkTableQuery, [tableName], (err, results) => {
    if (err) {
      console.error("Error checking addresses table existence:", err);
      return;
    }

    if (results && results[0].count === 0) {
      const createAddressQuery = `
        CREATE TABLE ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255),
          street VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(255),
          zip_code INT,
          landmark VARCHAR(255),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;

      connection.query(createAddressQuery, (err) => {
        if (err) {
          console.error("Error creating addresses table:", err);
        } else {
          console.log("Addresses table created successfully.");
        }
      });
    } else {
      console.log("Addresses table already exists.");
    }
  });
}
