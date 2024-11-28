const connection = require("../connection");
const tableName = "addresses";
const usersTableName = "users";
const express = require("express");
const addressRouter = express.Router();
checkAddressTableExistence();

// Add a new address for a user
addressRouter.post("/address/add", (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    street,
    city,
    state,
    zipCode,
    landmark,
    mobile,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "User ID is required" });
  }

  const addAddressQuery = `INSERT INTO ${tableName} (user_id, first_name, last_name, street, city, state, zip_code, landmark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const addPhoneNoInUsersQuery = `UPDATE ${usersTableName} SET mobile = ? WHERE id = ?`;
  const findAddressQuery = `SELECT * FROM ${tableName} WHERE id = ?`;

  connection.query(addPhoneNoInUsersQuery, [mobile, userId], (err, result) => {
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

        connection.query(
          findAddressQuery,
          [result.insertId],
          (err, results) => {
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
          }
        );
      }
    );
  });
});

// Activate an address, to set the current delivery address from multiple addresses
addressRouter.post("/address/set-active", (req, res) => {
  const { addressId } = req.body;

  if (!addressId) {
    return res
      .status(400)
      .json({ status: 400, message: "Address ID is required" });
  }

  // Step 1: Find the user_id for the given address ID
  const getUserQuery = `SELECT user_id FROM ${tableName} WHERE id = ?`;

  connection.query(getUserQuery, [addressId], (err, userResult) => {
    if (err || userResult.length === 0) {
      return res
        .status(500)
        .json({ status: 500, message: "Error fetching address details" });
    }

    const userId = userResult[0].user_id;

    // Step 2: Deactivate all other addresses for this user
    const deactivateOtherAddressesQuery = `UPDATE ${tableName} SET active = false WHERE user_id = ?`;

    connection.query(deactivateOtherAddressesQuery, [userId], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Error deactivating other addresses" });
      }

      // Step 3: Activate the specified address
      const activateAddressQuery = `UPDATE ${tableName} SET active = true WHERE id = ?`;

      connection.query(activateAddressQuery, [addressId], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Error activating address" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: 404,
            message: "Address not found",
          });
        }

        res.status(200).json({
          status: 200,
          message: "Address activated successfully",
        });
      });
    });
  });
});

// Fetch all addresses for a specific user
// Fetch all active addresses for a specific user
addressRouter.get("/addresses", (req, res) => {
  const userId = req.query?.id;
  const addressId = req.query?.addressId;
  const onlyActive = req.query?.active === "true";

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "User ID is required" });
  }

  const getAddressesQuery = onlyActive
    ? `SELECT * FROM ${tableName} WHERE user_id = ? AND active = true`
    : addressId && userId
    ? `SELECT * FROM ${tableName} WHERE user_id = ? AND id = ?`
    : `SELECT * FROM ${tableName} WHERE user_id = ?`;

  connection.query(
    getAddressesQuery,
    userId && addressId ? [userId, addressId] : [userId],
    (err, result) => {
      if (err) {
        console.log("err:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Error fetching addresses" });
      }

      res.status(200).json({
        status: 200,
        data: result,
      });
    }
  );
});

// Update an existing address
addressRouter.put("/address/edit", (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    street,
    city,
    state,
    zipCode,
    landmark,
    mobile,
  } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "Address ID is required" });
  }

  const updateAddressQuery = `UPDATE ${tableName} SET first_name = ?, last_name = ?, street = ?, city = ?, state = ?, zip_code = ?, landmark = ? WHERE id = ?`;
  const addPhoneNoInUsersQuery = `UPDATE ${usersTableName} SET mobile = ? WHERE id = ?`;

  connection.query(addPhoneNoInUsersQuery, [mobile, userId], (err, result) => {
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
  });
});

// Delete an address
addressRouter.delete("/address/delete", (req, res) => {
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
          active BOOLEAN DEFAULT false,
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
module.exports = addressRouter;
