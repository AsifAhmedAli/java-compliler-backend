const conn = require("../conn/conn");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var request = require("request");
const verifyUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if user exists
    conn.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        // console.log(err);
        res.status(500).json({ message: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ message: `User ${id} not found` });
      } else if (results[0].status1 === 1) {
        res
          .status(400)
          .json({ message: `User ${id} has already been approved by admin` });
      } else {
        // Update User Status to 1 (approved)
        conn.query("UPDATE users SET status1 = 1 WHERE id = ?", [id], (err) => {
          if (err) {
            // console.log(err);
            res.status(500).json({ message: err.message });
          } else {
            res.status(200).json({
              message: `User ${results[0].name} has been approved by admin`,
            });
          }
        });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const get_all_doctors = (req, res) => {
  // Pagination variables
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  conn.query(
    "SELECT * FROM users LIMIT ? OFFSET ?",
    [limit, offset],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      } else if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No doctors found",
        });
      } else {
        const doctors = results;

        conn.query("SELECT COUNT(*) AS total FROM users", (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          } else {
            const total = result[0].total;
            const data = {
              doctors,
              totalDoctors: total,
              currentPage: page,
              totalPages: Math.ceil(total / limit),
            };
            res.json({
              success: true,
              message: "Successfully retrieved all doctors",
              data: data,
            });
          }
        });
      }
    }
  );
};

const block_doctor_account = (req, res) => {
  const id = req.params.id;

  conn.query(
    "UPDATE users SET status1 = 0 WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      } else if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "User has been successfully blocked",
        });
      }
    }
  );
};

//  Login Controler for Doctor

const admin_login = async (req, res) => {
  function HMAC(data) {
    key = process.env.secret_ID_withings;
    // console.log(key);
    return crypto.createHmac("sha256", key).update(data).digest();
  }
  // function encrypt(data) {
  //   // console.log(data);
  //   var signature = CryptoJS.HmacSHA256(
  //     "data",
  //     "process.env.secret_ID_withings"
  //   ).toString();
  //   console.log(signature);
  // }
  const { email, password } = req.body;
  try {
    const checkUserQuery = `SELECT * FROM admin_users WHERE email1 = '${email}'`;
    conn.query(checkUserQuery, (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        return res.status(401).json({ message: "You are not registered" });
      }
      const user = results[0];
      if (!user) {
        return res.status(401).json({ message: "You are not registered" });
      }
      if (user.pass1 !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const payload = {
        id: user.id,
        name: user.name1,
        email: user.email1,
      };
      const token = jwt.sign(
        payload,
        process.env.adminjwtSecret,
        { expiresIn: 10800 },
        (err, token) => {
          if (err) throw err;
          // Timestamp
          var timestamp = Date.now();
          // console.log(timestamp / 1000);
          timestamp = parseInt(timestamp / 1000);
          // console.log(timestamp);
          // Use the CryptoJS
          // console.log(timestamp);
          var data =
            "getnonce" + "," + process.env.client_ID_withings + "," + timestamp;
          // console.log(
          //   CryptoJS.HmacSHA256(data, process.env.secret_ID_withings)
          // );
          // console.log(data);
          signature = HMAC(data);
          // var signature = CryptoJS.HmacSHA256(
          //   data,
          //   process.env.secret_ID_withings
          // ).toString();
          // console.log(process.env.client_ID_withings);
          signature = signature.toString("hex");
          // console.log(signature);
          // Set the new environment variable
          // pm.environment.set('timestamp', timestamp);
          // pm.environment.set('signature', signature);

          var options = {
            method: "POST",
            url: "https://wbsapi.withings.net/v2/signature",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            form: {
              action: "getnonce",
              client_id: process.env.client_ID_withings,
              timestamp: timestamp,
              signature: signature,
            },
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            var resa = JSON.parse(response.body);
            nonce = resa.body.nonce;
            var state = "state";
            var url = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${process.env.client_ID_withings}&redirect_uri=${process.env.admin_redirecturl_withings}&state=${state}&scope=user.metrics,user.activity`;

            res.set("Access-Control-Allow-Origin", "*");
            res.set("Access-Control-Allow-Credentials", "true");

            res.cookie("token", token, { httpOnly: true });
            // res.cookie("id", user.id, { httpOnly: true });
            delete user.pass1;
            res.status(200).json({
              message: "User logged in successfully",
              user,
              token,
              url,
              nonce,
            });
          });
        }
      );
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const all_patients_of_one_doctor = async (req, res) => {
  // Get the doctor ID from the request

  const doctor_id = req.params.id;

  const query = `
  SELECT patients.*,patient_time.*, patients.id as pid,patient_details.date_of_birth
FROM patients
LEFT JOIN patient_details ON patients.id = patient_details.patient_id
LEFT JOIN patient_time ON patients.id = patient_time.patient_id
WHERE patients.doctor_id = ?;
`;
  const getTotalQuery = `
  SELECT COUNT(*) as total
  FROM patients
  WHERE doctor_id = ?
`;
  // const getTotalQuery = `
  // SELECT patient_time.*
  // FROM patient_time  patients.id = patient_time.patient_id
  // WHERE doctor_id = ?
  // `;

  conn.query(getTotalQuery, [doctor_id], (error, results, fields) => {
    const totalPatients = results[0].total;
    conn.query(query, [doctor_id, doctor_id], (error, results) => {
      // console.log(doctor_id);
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({
          totalPatients,
          patients: results,
        });
      }
    });
  });
};

//get previous device orders
const getallorders = (req, res) => {
  const query = `SELECT * FROM ordered_devices`;
  try {
    conn.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No Data" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const get_one_doctor1 = (req, res) => {
  const id = req.params.id;
  const query = `SELECT name FROM users where id = ${id}`;
  try {
    conn.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No User Found" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const update_order_status = (req, res) => {
  const id = req.params.id;
  const updated_status = req.body.status;
  // Check if old password is correct
  conn.query(
    "UPDATE ordered_devices SET statusoforder = ? WHERE id = ?",
    [updated_status, id],
    (error, results) => {
      if (error) {
        return res.status(500).send({ message: error.message });
      }

      res.status(200).send({ message: "Order Updated Successfully" });
    }
  );
};
module.exports = {
  verifyUser,
  getallorders,
  get_one_doctor1,
  get_all_doctors,
  block_doctor_account,
  admin_login,
  all_patients_of_one_doctor,
  update_order_status,
};
