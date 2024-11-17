const connection = require("../connection");
const app = require("../app");
const tableName = "payments";
const razorpaySecretKey = process.env.REACT_APP_RAZORPAY_API_KEY;
const razorpayMerchantId = process.env.REACT_APP_RAZORPAY_API_MERCHANT_ID;

const createQuery =
  "CREATE TABLE payment_info (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id))";


  function createPaymentLink(orderId){

  }
