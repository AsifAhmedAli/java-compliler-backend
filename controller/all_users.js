const conn = require("../conn/conn");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
var request = require("request");
const crypto = require("crypto");
const { json } = require("express");

// const { response } = require("express");
// const { json } = require("express");
// const stripe = require("stripe")(
//   "sk_test_51Nrjg7CgXt0dXLeDr3UMnGYpg03Dh3tMQ24PR1f8WIo84no3JCVB45rtpUmVZyuV9vN3rvwA8E0stGXPTJ254mso006ZezGd6X"
// );
// // const { time } = require("console");
// //new registration doctor-controller
// function HMAC(data) {
//   key = process.env.secret_ID_withings;
//   return crypto.createHmac("sha256", key).update(data).digest();
// }
const new_student = async (req, res) => {
  // console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // console.log(email);
  // console.log(password);
  try {
    // Check if the email is already registered
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        if (results.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }
        const insertQuery = `INSERT INTO users (sname, email, pass, status1) VALUES (?, ?, ?, 1)`;
        await conn.query(insertQuery, [name, email, password]);

        // const token = crypto.randomBytes(20).toString("hex");
        // const updateQuery = `UPDATE users SET token = ? WHERE email = ?`;
        // await conn.query(updateQuery, [token, email]);

        // const transporter = nodemailer.createTransport({
        //   service: "Gmail",
        //   port: 465,
        //   secure: true,
        //   auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.PASSWORD,
        //   },
        // });
        // const mailOptions = {
        //   from: process.env.EMAIL,
        //   to: email,
        //   subject: "Student Registration",
        //   // text: `Hello ${name}, Thank you for registering as a doctor. Please click on the link below to verify your email address.`,
        //   html: `<p>Hello ${name},</p> <p>You are registered as a student.
        //   <br>Name: ${name}<br>
        //   Email: ${email} <br>
        //   Password: ${password}</p>`,
        //   // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
        // };
        // await transporter.sendMail(mailOptions);

        res.status(201).json({
          message: "Student registered successfully.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const new_course = async (req, res) => {
  // console.log(req.body);
  const name = req.body.cname;

  // console.log(email);
  // console.log(password);
  try {
    // Check if the email is already registered
    conn.query(
      "SELECT * FROM courses WHERE cname = ?",
      [name],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        if (results.length > 0) {
          return res.status(400).json({ message: "Course already registered" });
        }
        const insertQuery = `INSERT INTO courses (cname) VALUES (?)`;
        await conn.query(insertQuery, [name]);

        // const token = crypto.randomBytes(20).toString("hex");
        // const updateQuery = `UPDATE users SET token = ? WHERE email = ?`;
        // await conn.query(updateQuery, [token, email]);

        // const transporter = nodemailer.createTransport({
        //   service: "Gmail",
        //   port: 465,
        //   secure: true,
        //   auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.PASSWORD,
        //   },
        // });
        // const mailOptions = {
        //   from: process.env.EMAIL,
        //   to: email,
        //   subject: "Student Registration",
        //   // text: `Hello ${name}, Thank you for registering as a doctor. Please click on the link below to verify your email address.`,
        //   html: `<p>Hello ${name},</p> <p>You are registered as a student.
        //   <br>Name: ${name}<br>
        //   Email: ${email} <br>
        //   Password: ${password}</p>`,
        //   // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
        // };
        // await transporter.sendMail(mailOptions);

        res.status(201).json({
          message: "Course registered successfully.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const get_all_courses = (req, res) => {
  const query = `SELECT * FROM courses`;
  try {
    conn.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const get_all_students = (req, res) => {
  const query = `SELECT * FROM users`;
  try {
    conn.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const get_courses_of_one_student = (req, res) => {
  const sid = req.params.id;
  console.log(sid);
  var courses_list = [];
  const query = `SELECT * FROM student_enrollment where sid = ?`;
  try {
    conn.query(query, [sid], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (results.length > 0) {
        results.forEach((element) => {
          conn.query(
            `SELECT * FROM courses where id = ?`,
            [element.cid],
            (err, results) => {
              if (err) {
                throw err;
              }
              if (results.length > 0) {
                courses_list.push(results);
              }
              console.log(results);
              return res.status(200).json(results);
            }
          );
        });
      }
      // return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const unenrol_student = (req, res) => {
  const { sid, cid } = req.body;
  // console.log(sid);
  // console.log(cid);
  const query = `Delete FROM student_enrollment where cid = ? and sid = ?`;
  try {
    conn.query(query, [cid, sid], (err, results) => {
      if (err) {
        throw err;
      }
      return res.status(200).json({ msg: "Course Unenrolled Successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const add_assignment = async (req, res) => {
  // console.log(req.body);
  const aname = req.body.aname;
  const question = req.body.question;
  const answer = req.body.answer;
  const cid = req.body.cid;

  // console.log(email);
  // console.log(password);
  try {
    // Check if the email is already registered
    conn.query(
      "SELECT * FROM `assignment` WHERE aname = ? and cid = ?",
      [aname, cid],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        if (results.length > 0) {
          return res.status(400).json({
            message:
              "An assignment for this class with this name already exists",
          });
        }
        const insertQuery = `INSERT INTO assignment(cid, question, answer, aname) VALUES (?, ?, ?, ?)`;
        await conn.query(insertQuery, [cid, question, answer, aname]);
        res.status(201).json({
          message: "Assignment added successfully.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const get_assignment_of_one_course = (req, res) => {
  const cid = req.params.id;
  // console.log(cid);
  var courses_list = [];
  const query = `SELECT * FROM assignment where cid = ?`;
  try {
    conn.query(query, [cid], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Course not found" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
        // results.forEach((element) => {
        //   conn.query(
        //     `SELECT * FROM courses where id = ?`,
        //     [element.cid],
        //     (err, results) => {
        //       if (err) {
        //         throw err;
        //       }
        //       if (results.length > 0) {
        //         courses_list.push(results);
        //       }
        //       console.log(results);
        //       return res.status(200).json(results);
        //     }
        //   );
        // });
      }
      // return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const get_one_assignment = (req, res) => {
  const aid = req.params.aid;
  // console.log(cid);
  var courses_list = [];
  const query = `SELECT * FROM assignment where id = ?`;
  try {
    conn.query(query, [aid], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      if (results.length > 0) {
        return res.status(200).json(results);
        // results.forEach((element) => {
        //   conn.query(
        //     `SELECT * FROM courses where id = ?`,
        //     [element.cid],
        //     (err, results) => {
        //       if (err) {
        //         throw err;
        //       }
        //       if (results.length > 0) {
        //         courses_list.push(results);
        //       }
        //       console.log(results);
        //       return res.status(200).json(results);
        //     }
        //   );
        // });
      }
      // return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const get_submissions_of_all_students = (req, res) => {
  const sid = req.params.aid;
  console.log(sid);
  var courses_list = [];
  const query = `SELECT s.*, s.id as subid, u.*, u.id as uid, a.*, a.id as aid, a.answer aanswer, s.answer as sanswer FROM submissions s join users u on u.id = s.sid join assignment a on a.id = s.aid where s.aid = ?`;
  try {
    conn.query(query, [sid], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Course not found" });
      }
      // if (results.length > 0) {

      // results.forEach((element) => {
      //   conn.query(
      //     `SELECT * FROM users where id = ?`,
      //     [element.sid],
      //     (err, results) => {
      //       if (err) {
      //         throw err;
      //       }
      //       if (results.length > 0) {
      //         courses_list.push(results);
      //       }
      //       console.log(results);
      //       return res.status(200).json(results);
      //     }
      //   );
      // });
      // }
      return res.status(200).json(results);
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const new_submission = async (req, res) => {
  // console.log(req.body);
  const sid = req.body.sid;
  const aid = req.body.aid;
  const code = req.body.code;
  const answer = req.body.output;
  // const name = req.body.sid;
  // const name = req.body.sid;

  // console.log(email);
  // console.log(password);
  try {
    // Check if the email is already registered
    conn.query(
      "SELECT * FROM submissions WHERE sid = ? and aid = ?",
      [sid, aid],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: "Assignment already submitted" });
        }
        const insertQuery = `INSERT INTO submissions (sid, aid, code, answer) VALUES (?, ?, ?, ?)`;
        await conn.query(insertQuery, [sid, aid, code, answer]);

        // const token = crypto.randomBytes(20).toString("hex");
        // const updateQuery = `UPDATE users SET token = ? WHERE email = ?`;
        // await conn.query(updateQuery, [token, email]);

        // const transporter = nodemailer.createTransport({
        //   service: "Gmail",
        //   port: 465,
        //   secure: true,
        //   auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.PASSWORD,
        //   },
        // });
        // const mailOptions = {
        //   from: process.env.EMAIL,
        //   to: email,
        //   subject: "Student Registration",
        //   // text: `Hello ${name}, Thank you for registering as a doctor. Please click on the link below to verify your email address.`,
        //   html: `<p>Hello ${name},</p> <p>You are registered as a student.
        //   <br>Name: ${name}<br>
        //   Email: ${email} <br>
        //   Password: ${password}</p>`,
        //   // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
        // };
        // await transporter.sendMail(mailOptions);

        res.status(201).json({
          message: "Assignment Submitted successfully.",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const execute_code = (req, res) => {
  const { code } = req.body;
  // console.log(code);
  // var request = require("request");
  var options = {
    method: "POST",
    url: "https://05c350ad.compilers.sphere-engine.com/api/v4/submissions?access_token=43c2c16d3e55bdcfee2d805097cebf0c",
    formData: {
      compilerId: "10",
      // input: 'System.out.println("Hello, World!");',
      source: code,
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    // console.log(response.body);
    const pasred = JSON.parse(response.body);
    // console.log(pasred);
    const subid = pasred.id;
    setTimeout(function () {
      // console.log(subid);
      var options4 = {
        method: "GET",
        url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
      };
      request(options4, function (error, response) {
        if (error) throw new Error(error);
        // console.log(response.body);
        const pasred_data = JSON.parse(response.body);
        console.log(pasred_data);
        if (pasred_data.result.status.code == 1) {
          setTimeout(function () {
            // console.log(subid);
            var options3 = {
              method: "GET",
              url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
            };
            request(options3, function (error, response) {
              if (error) throw new Error(error);
              // console.log(response.body);
              const pasred_data = JSON.parse(response.body);
              if (pasred_data.result.status.code == 1) {
                setTimeout(function () {
                  // console.log(subid);
                  var options2 = {
                    method: "GET",
                    url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
                  };
                  request(options2, function (error, response) {
                    if (error) throw new Error(error);
                    // console.log(response.body);
                    const pasred_data = JSON.parse(response.body);
                    if (pasred_data.result.status.code == 1) {
                      return res
                        .status(200)
                        .json({ output: "No response from the server" });
                    } else if (pasred_data.result.status.code == 11) {
                      return res
                        .status(200)
                        .json({ output: "Compilation Error" });
                    } else {
                      var options5 = {
                        method: "GET",
                        url: pasred_data.result.streams.output.uri,
                      };
                      request(options5, function (error, response) {
                        if (error) throw new Error(error);
                        // console.log(response.body);
                        return res.status(200).json({ output: response.body });
                      });
                    }
                  });
                }, 3000);
              } else if (pasred_data.result.status.code == 11) {
                return res.status(200).json({ output: "Compilation Error" });
              } else {
                var options6 = {
                  method: "GET",
                  url: pasred_data.result.streams.output.uri,
                };
                request(options6, function (error, response) {
                  if (error) throw new Error(error);
                  // console.log(response.body);
                  return res.status(200).json({ output: response.body });
                });
              }
            });
          }, 3000);
        } else if (pasred_data.result.status.code == 11) {
          return res.status(200).json({ output: "Compilation Error" });
        } else {
          var options7 = {
            method: "GET",
            url: pasred_data.result.streams.output.uri,
          };
          request(options7, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            return res.status(200).json({ output: response.body });
          });
        }
        // console.log(pasred_data.result.status.code);
      });
    }, 3000);

    // console.log(subid);
  });

  // console.log(code);
};
// // const new_doctor = async (req, res) => {
// //   const { name, email, password } = req.body;
// //   try {
// //     // Check if the email is already registered
// //     conn.query(
// //       "SELECT * FROM users WHERE email = ?",
// //       [email],
// //       (error, results) => {
// //         if (error) {
// //           return res.status(500).json({ message:error.message });
// //         }
// //         if (results.length > 0) {
// //           return res.status(400).json({ message: "Email already registered" });
// //         }
// //       }
// //     );

// //     const status1 = 0;
// //     const verified1 = 0;
// //     const insertQuery = `INSERT INTO users (name, email, password, status1, verified1) VALUES (?, ?, ?, ?, ?)`;
// //     await conn.query(insertQuery, [name, email, password, status1, verified1]);

// //     const token = crypto.randomBytes(20).toString("hex");
// //     const updateQuery = `UPDATE users SET token = ? WHERE email = ?`;
// //     await conn.query(updateQuery, [token, email]);

// //     const transporter = nodemailer.createTransport({
// //       service: "Gmail",
// //       port: 465,
// //       secure: true,
// //       auth: {
// //         user: process.env.EMAIL,
// //         pass: process.env.PASSWORD,
// //       },
// //     });
// //     const mailOptions = {
// //       from: process.env.EMAIL,
// //       to: email,
// //       subject: "Email Verification",
// //       text: `Hello ${name}, Thank you for registering as a doctor. Please click on the link below to verify your email address.`,
// //       html: `<p>Hello ${name},</p> <p>Thank you for registering as a doctor.</p> <p>Please click on the link below to verify your email address:</p>
// //         <a href='${process.env.SITE_URL}/verify/${token}'>${process.env.SITE_URL}/verify/${token}</a>`,
// //       // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
// //     };
// //     await transporter.sendMail(mailOptions);

// //     await res.status(201).json({
// //       message:
// //         "User registered successfully. Please check your email for verification link.",
// //     });
// //   } catch (error) {
// //     // console.log(error);
// //    await res.status(500).json({ message: error.message });
// //   }

// // var name1 = req.body.name;
// // var email1 = req.body.email;
// // var pass1 = req.body.pass;
// // var dbname = process.env.dbname;
// // let sql = "CALL " + dbname + ".get_user_with_email(?)";

// // conn.query(sql, [email1], (error, results, fields) => {
// //   if (error) {
// //     return console.error(error.message);
// //   } else {
// //     console.log(results[0]);
// //   }
// // });

// //   let sql = "CALL " + dbname + ".set_doctor_registration(?, ?, ?)";

// //   conn.query(sql, [name1, email1, pass1], (error, results, fields) => {
// //     if (error) {
// //       return console.error(error.message);
// //     } else {
// //       return res.send({ msg: "success" });
// //     }
// //   //   });
// // };

// // verify Email
// const verify_email = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const selectQuery = `SELECT * FROM users WHERE token = ?`;
//     const results = await conn.query(selectQuery, [token]);

//     if (!results) {
//       res.status(400).json({ message: "Invalid verification link" });
//     } else {
//       const updateQuery = `UPDATE users SET verified1 = 1, token = NULL WHERE token = ?`;
//       await conn.query(updateQuery, [token]);
//       // Read the verified.html file and send it to the user
//       // if email verification is successful
//       const filePath = path.join(
//         __dirname,
//         "../../emails",
//         "verificationEmail.html"
//       );
//       const fileContent = await fs.promises.readFile(filePath, "utf-8");

//       res.send(fileContent);
//     }
//   } catch (error) {
//     // console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// //  Login Controler for Doctor

const student_login = async (req, res) => {
  const { email, pass } = req.body;
  // console.log(email);
  // console.log(pass);
  try {
    const checkUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
    conn.query(checkUserQuery, (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        return res.status(401).json({ message: "You are not registered." });
      }
      const user = results[0];
      if (!user) {
        return res.status(401).json({ message: "You are not registered." });
      }
      if (user.pass !== pass) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (user.status1 === 0) {
        return res.status(401).json({
          message: "You are blocked by admin. Contact with administration",
        });
      }
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      const token = jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 10800 },
        (err, token) => {
          if (err) throw err;

          res.set("Access-Control-Allow-Origin", "*");
          res.set("Access-Control-Allow-Credentials", "true");

          // res.cookie("token", token, { httpOnly: true });
          // res.cookie("id", user.id, { httpOnly: true });
          delete user.pass;
          res.status(200).json({
            message: "User logged in successfully",
            user,
            token,
            // url,
            // nonce,
          });
        }
      );
      // }
      // );
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// // Logout for Doctor

// const doctor_logout = (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get One user/Doctor
// const get_one_doctor = (req, res) => {
//   const userId = req.params.id;
//   const query = `SELECT * FROM users WHERE id = ${userId}`;
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       return res.status(200).json(results[0]);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// //get_one_patient_time
// const get_one_patient_time = (req, res) => {
//   const patientId = req.params.id;
//   const doctor_id = req.body.did;
//   const query = `SELECT * FROM patient_time WHERE patient_id = ${patientId} and doctor_id = ${doctor_id}`;
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       } else if (results.length === 0) {
//         conn.query(
//           `insert into patient_time (doctor_id, patient_id, time_spent) values (?, ? ,?)`,
//           [doctor_id, patientId, 0],
//           (error, results1) => {
//             if (error) {
//               return res.status(500).json({
//                 success: false,
//                 message: error.message,
//               });
//             } else {
//               conn.query(query, (err, results) => {
//                 if (err) {
//                   throw err;
//                 } else {
//                   return res.status(200).json({
//                     success: true,
//                     message: "Time fetched",
//                     results: results,
//                   });
//                 }
//               });
//               // return res.status(200).json({
//               //   success: true,
//               //   message: "New Time Added Successfully",
//               // });
//             }
//           }
//         );
//       } else {
//         return res.status(200).json({
//           success: true,
//           message: "Time fetched",
//           results: results,
//         });
//       }
//       // console.log(results);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// //new registration of patients controller

// const new_patient = (req, res) => {
//   const {
//     name,
//     date_of_birth,
//     email,
//     password,
//     medical_condition,
//     notes,
//     weight,
//     height,
//     gender,
//   } = req.body;

//   const doctorId = req.body.doctorId || req.user.id;
//   const doctorName = req.user.name;
//   const insertPatientQuery = `INSERT INTO patients (name, email, password,doctor_id,doctor_name, weight, height, gender) VALUES (?,?,?,?,?,?,?,?)`;
//   conn.query(
//     insertPatientQuery,
//     [name, email, password, doctorId, doctorName, weight, height, gender],
//     (error, results) => {
//       if (error) {
//         return res.status(500).json({
//           success: false,
//           message: error.message,
//           message1: "Email Already Registered",
//         });
//       }

//       const patientId = results.insertId;

//       // insert patient-doctor relationship into patient_doctor table

//       const doctorId = req.body.doctorId || req.user.id; // get doctorId from the request body
//       const doctorName = req.user.name; // get doctorName from the request body

//       conn.query(
//         "INSERT INTO patient_doctor (patient_id, doctor_id,doctor_name) VALUES (?,?,?)",
//         [patientId, doctorId, doctorName]
//       );

//       const insertPatientNotesQuery = `INSERT INTO patient_notes (patient_id, note) VALUES (?,?)`;
//       conn.query(
//         insertPatientNotesQuery,
//         [patientId, notes],
//         (error, results) => {
//           if (error) {
//             return res.status(500).json({
//               success: false,
//               message: error.message,
//             });
//           }
//         }
//       );

//       const insertPatientDetailsQuery = `INSERT INTO patient_details (patient_id, date_of_birth, medical_condition) VALUES (?,?,?)`;
//       conn.query(
//         insertPatientDetailsQuery,
//         [patientId, date_of_birth, medical_condition],
//         (error, results) => {
//           if (error) {
//             return res.status(500).json({
//               success: false,
//               message: error.message,
//             });
//           }
//         }
//       );
//       // const emailToken = crypto.randomBytes(20).toString("hex");
//       const transporter = nodemailer.createTransport({
//         service: "Gmail",
//         auth: {
//           user: process.env.P_EMAIL,
//           pass: process.env.P_PASSWORD,
//         },
//       });

//       const mailOptions = {
//         from: process.env.P_EMAIL,
//         to: email,
//         subject: "New Registration",
//         text: `Your login email: ${email} and password: ${password}`,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         return res.status(200).json({
//           success: true,
//           message: "Patient Registered Successfully",
//         });
//       });
//     }
//   );
// };

// //  Edit Patient

// const edit_patient = async (req, res) => {
//   // const patientId = req.params.id;
//   // const { name, date_of_birth, medical_condition, low_threshold, high_threshold } = req.body;

//   try {
//     const { name, email } = req.body;
//     const patientId = req.params.id;

//     conn.query("UPDATE patients SET name = ?, email = ? WHERE id = ?", [
//       name,
//       email,
//       patientId,
//     ]); // update patient_details table if data exists
//     if (req.body.date_of_birth || req.body.medical_condition) {
//       const date_of_birth = req.body.date_of_birth || null;
//       const medical_condition = req.body.medical_condition || null;

//       await conn.query(
//         "UPDATE patient_details SET date_of_birth = ? , medical_condition = ? WHERE patient_id = ?",
//         [date_of_birth, medical_condition, patientId]
//       );
//     }

//     // update patient_devices table if data exists
//     // if (req.body.device_barcode || req.body.device_id) {
//     //   const device_barcode = req.body.device_barcode || null;
//     //   // const device_id = req.body.device_id || null;

//     //   await conn.query(
//     //     "UPDATE patient_devices SET device_barcode = ? WHERE patient_id = ?",
//     //     [device_barcode, patientId]
//     //   );
//     // }

//     // // update patient_notes table if data exists
//     // if (req.body.notes) {
//     //   const notes = req.body.notes || null;

//     //   await conn.query(
//     //     "UPDATE patient_notes SET note = ? WHERE patient_id = ?",
//     //     [notes, patientId]
//     //   );
//     // }

//     return res.json({ message: "Patient data updated successfully" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// // delete patients

// const delete_patient = async (req, res) => {
//   // const patientId = req.params.id;
//   // const userId = req.user.id

//   const patientId = req.params.id;

//   // Check if the user is authorized to delete this patient
//   const userId = req.user.id;

//   const userRole = req.user.role;
//   if (!userId) {
//     return res.status(401).json({ error: "Unauthorized Access" });
//   }

//   // Delete the patient from the patients table
//   conn.query(
//     "Select * FROM patients WHERE id = ?",
//     [patientId],
//     (error, results) => {
//       if (error) {
//         throw error;
//       } else if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       } else {
//         conn.query(
//           "insert into patients_archive (idfrompatientstable, name, email, password, created_at, doctor_id, doctor_name) values (?, ?, ?, ?, ?, ?, ?)",
//           [
//             results[0].id,
//             results[0].name,
//             results[0].email,
//             results[0].password,
//             results[0].created_at,
//             results[0].doctor_id,
//             results[0].doctor_name,
//           ],
//           (error, results) => {
//             if (error) {
//               return res.status(500).json({ error });
//             } else {
//               conn.query(
//                 "DELETE FROM patients WHERE id = ?",
//                 [patientId],
//                 (error) => {
//                   if (error) {
//                     return res.status(500).json({ error });
//                   } else {
//                     res
//                       .status(200)
//                       .json({ message: "Patient Deleted Successfully" });
//                   }
//                 }
//               );
//             }
//           }
//         );
//         // console.log(results[0].id);
//         // return res.status(200).json(results[0]);
//       }
//     }
//   );

//   // conn.query("DELETE FROM patients WHERE id = ?", [patientId], (error) => {
//   //   if (error) {
//   //     return res.status(500).json({ error });
//   //   }

//   //   // Delete the patient's devices from the patient_devices table
//   //   conn.query(
//   //     "DELETE FROM patient_devices WHERE patient_id = ?",
//   //     [patientId],
//   //     (error) => {
//   //       if (error) {
//   //         return res.status(500).json({ error });
//   //       }

//   //       // Delete the patient's notes from the patient_notes table
//   //       conn.query(
//   //         "DELETE FROM patient_notes WHERE patient_id = ?",
//   //         [patientId],
//   //         (error) => {
//   //           if (error) {
//   //             return res.status(500).json({ error });
//   //           }

//   //           // Delete the patient's details from the patient_details table
//   //           conn.query(
//   //             "DELETE FROM patient_details WHERE patient_id = ?",
//   //             [patientId],
//   //             (error) => {
//   //               if (error) {
//   //                 return res.status(500).json({ error });
//   //               }

//   //               // Delete the patient from the patient_doctor table
//   //               conn.query(
//   //                 "DELETE FROM patient_doctor WHERE patient_id = ?",
//   //                 [patientId],
//   //                 (error) => {
//   //                   if (error) {
//   //                     return res.status(500).json({ error });
//   //                   }

//   //                   // Return success response
//   //                   res.json({ message: "Patient Deleted Successfully" });
//   //                   // console.log(patientId)
//   //                 }
//   //               );
//   //             }
//   //           );
//   //         }
//   //       );
//   //     }
//   //   );
//   // });
// };

// //  Get All The Patients of one Doctor

// const all_patients_of_one_doctor = async (req, res) => {
//   // Get the doctor ID from the request

//   const doctor_id = req.user.id;
//   //  console.log(doctor_id)
//   // const id = req.params.id;
//   // console.log(req.user);
//   // Pagination variables
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = (page - 1) * limit;

//   // const query = `

//   //   SELECT patients.*,doctor_name, patient_devices.*, patient_notes.*,patient_details.*
//   //   FROM patients
//   //   LEFT JOIN patient_devices ON patients.id = patient_devices.patient_id
//   //   LEFT JOIN patient_notes ON patients.id = patient_notes.patient_id
//   //   LEFT JOIN patient_details ON patients.id = patient_details.patient_id
//   //   WHERE patients.doctor_id = ?
//   // SELECT patients.name,patients.email, patient_details.date_of_birth, patients.id as pid
//   // FROM patients
//   // LEFT JOIN patient_details ON patients.id = patient_details.patient_id
//   // WHERE patients.doctor_id = ?
//   //   LIMIT ? OFFSET ?
//   // `;

//   const query = `
//   SELECT patients.*, patients.id as pid,patient_details.date_of_birth
// FROM patients
// LEFT JOIN patient_details ON patients.id = patient_details.patient_id
// WHERE patients.doctor_id = ?
// LIMIT ? OFFSET ?;
// `;
//   const getTotalQuery = `
//   SELECT COUNT(*) as total
//   FROM patients
//   WHERE doctor_id = ?
// `;

//   conn.query(getTotalQuery, [doctor_id], (error, results, fields) => {
//     const totalPatients = results[0].total;
//     conn.query(query, [doctor_id, limit, offset], (error, results) => {
//       // console.log(doctor_id);
//       if (error) {
//         res.status(500).json({ error: error.message });
//       } else {
//         results.forEach((key) => {
//           // console.log(key.password);
//           delete key.password;
//         });
//         // delete results.patients
//         res.status(200).json({
//           totalPatients,
//           patients: results,
//         });
//       }
//     });
//   });
// };
// // Get One Patinet
// const get_one_patient = (req, res) => {
//   const userId = req.params.id;
//   // const query = `SELECT * FROM patients WHERE id = ${userId}`;
//   const query = `SELECT patients.*, patient_details.*
//   FROM patients
//   JOIN patient_details
//   ON patients.id = patient_details.patient_id
//   WHERE patients.id = ${userId}`;
//   // console.log(userId)
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       delete results[0].password;
//       return res.status(200).json(results[0]);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// //update_pass

// const update_pass_func = (req, res) => {
//   userId = req.user.id;
//   // Check if user is logged in and the user id from request body matches the logged in user's id
//   if (!userId) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }

//   const { newPassword, confirmPassword } = req.body;

//   // Validate input
//   if (!newPassword || !confirmPassword) {
//     return res.status(400).send({ message: "All fields are required" });
//   }

//   if (newPassword !== confirmPassword) {
//     return res
//       .status(400)
//       .send({ message: "New password and confirm password do not match" });
//   }

//   // Check if old password is correct
//   conn.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
//     if (error) {
//       return res.status(500).send({ message: error.message });
//     }

//     // Update password in the database

//     // const hashedPassword = bcrypt.hashSync(newPassword, 8);

//     conn.query(
//       "UPDATE users SET password = ? WHERE id = ?",
//       [newPassword, userId],
//       (error, results) => {
//         if (error) {
//           return res.status(500).send({ message: error.message });
//         }

//         res.status(200).send({ message: "Password updated successfully" });
//       }
//     );
//   });

//   // var currentpass = req.body.current_pass;
//   // var updated_pass = req.body.updated_pass;
//   // var update_pass1 = req.body.update_pass1;
//   // var user_id = req.body.user_id;
//   // var dbname = process.env.dbname;
//   // let sql = "CALL " + dbname + ".get_user(?)";

//   // conn.query(sql, [user_id], (error, results, fields) => {
//   //   if (error) {
//   //     return console.error(error.message);
//   //   } else {
//   //     if (currentpass == results[0][0].password) {
//   //       if (updated_pass != update_pass1) {
//   //         return res.send({ msg: "passwords not same" });
//   //       }
//   //       if (updated_pass == update_pass1) {
//   //         //   return res.send({ msg: "success" });
//   //         let sql = "CALL " + dbname + ".update_passworda(?, ?)";

//   //         conn.query(sql, [updated_pass, user_id], (error, results, fields) => {
//   //           if (error) {
//   //             return console.error(error.message);
//   //           } else {
//   //             return res.send({ msg: "success" });
//   //           }
//   //         });
//   //       }
//   //     } else {
//   //       return res.send({ msg: "incorrect current pasword" });
//   //     }
//   //   }
//   // });
// };

// //update user name

// const update_name = (req, res) => {
//   const userId = req.user.id;
//   const newName = req.body.newname;

//   if (!userId) {
//     return res.status(401).send({ error: "Unauthorized" });
//   }
//   conn.query(
//     "UPDATE users SET name = ? WHERE id = ?",
//     [newName, userId],
//     (error, results) => {
//       if (error) {
//         return res.status(500).send({ error });
//       }
//       return res.status(200).json({ message: "Name Updated Successfully" });
//     }
//   );
// };

// //  login for Patients

// const patient_login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const checkUserQuery = `SELECT * FROM patients WHERE email = '${email}'`;
//     conn.query(checkUserQuery, (error, results) => {
//       if (error) throw error;
//       if (results.length === 0) {
//         return res.status(400).json({ message: "You are not registered" });
//       }
//       const user = results[0];
//       if (!user) {
//         return res
//           .status(400)
//           .json({ message: "You are not registered, Please Register first" });
//       }
//       if (user.password !== password) {
//         return res.status(400).json({ message: "Invalid email or password" });
//       }

//       // const payload = {
//       //   id: user.id,
//       //   name: user.name,
//       //   email: user.email
//       // };
//       const token = jwt.sign(
//         { id: user.id, name: user.name },
//         process.env.jwtSecret,
//         {
//           expiresIn: "8h",
//         }
//       );
//       res.cookie("token", token, { httpOnly: true });
//       res.cookie("id", user.id, { httpOnly: true });
//       res.status(200).json({ message: "Login successful", user, token });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };
// // Patient Search by Name
// const patient_search_by_name = (req, res) => {
//   const name = req.query.name;
//   const query = `SELECT * FROM patients WHERE name LIKE '%${name}%'`;
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "No results found" });
//       }
//       return res.status(200).json(results);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// //one patient details

// // const get_one_patient = (req, res) => {
// //   const userId = req.params.id;
// //   const query = `SELECT patients.*, patient_details.* FROM patients LEFT JOIN patient_details ON patients.id = patient_details.patient_id WHERE patients.id = ${userId}`;
// //   try {
// //     conn.query(query, (err, results) => {
// //       if (err) {
// //         throw err;
// //       }
// //       if (results.length === 0) {
// //         return res.status(404).json({ message: "User not found" });
// //       }
// //       return res.status(200).json(results[0]);
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ message: "Internal server error" });
// //   }
// // };

// const get_one_patient_devices = (req, res) => {
//   const userId = req.params.id;
//   const query = `SELECT * FROM patient_devices WHERE patient_id = ${userId}`;
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       return res.status(200).json(results);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// const get_one_patient_notes = (req, res) => {
//   const userId = req.params.id;
//   const query = `SELECT * FROM patient_notes WHERE patient_id = ${userId}`;
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       return res.status(200).json(results);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// const sharepatientdata = (req, res) => {
//   const { email, patient_link } = req.body;
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });
//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Patient's Data",
//     text: ``,
//     html: `<p>Please click on the link below to view the patient:</p>
//       <a href='${patient_link}/'>${patient_link}</a>`,
//     // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
//   };
//   transporter.sendMail(mailOptions);
//   return res.status(200).json({ msg: "Mail Sent" });
// };

// const add_notes = (req, res) => {
//   const { patient_id, note } = req.body;

//   // const doctorId = req.body.doctorId || req.user.id;
//   // const doctorName = req.user.name;
//   const insertPatientQuery = `INSERT INTO patient_notes(patient_id, note)  VALUES (?,?)`;
//   conn.query(insertPatientQuery, [patient_id, note], (error, results) => {
//     if (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "Note Added Successfully",
//       });
//     }
//   });
// };

// //timer update of screen

// const addtotime = (req, res) => {
//   // console.log(req.user);
//   const doctorId = req.user.id;
//   const patientid = req.body.pid;
//   const time = req.body.time;
//   // const { patientid, doctorId, time } = req.user;
//   // console.log(patientid);
//   // console.log(doctorId);
//   // console.log(time);
//   // console.log(time);

//   const query = `SELECT * FROM patient_time WHERE patient_id = ? and doctor_id = ?`;
//   try {
//     conn.query(query, [patientid, doctorId], (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         conn.query(
//           `insert into patient_time (doctor_id, patient_id, time_spent) values (?, ? ,?)`,
//           [doctorId, patientid, time],
//           (error, results1) => {
//             if (error) {
//               return res.status(500).json({
//                 success: false,
//                 message: error.message,
//               });
//             } else {
//               return res.status(200).json({
//                 success: true,
//                 message: "Time Added Successfully",
//               });
//             }
//           }
//         );
//       }
//       // console.log(results);
//       conn.query(
//         `update patient_time set time_spent = ? where patient_id = ? and doctor_id = ?`,
//         [time, patientid, doctorId],
//         (error, results1) => {
//           if (error) {
//             return res.status(500).json({
//               success: false,
//               message: error.message,
//             });
//           } else {
//             return res.status(200).json({
//               success: true,
//               message: "Time updated Successfully",
//             });
//           }
//         }
//       );
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// // function new_patient(req, res) {
// //   if (typeof req.body.device_barcode !== "undefined") {
// //     var device_barcode = req.body.device_barcode;
// //   } else {
// //     var device_barcode = "not set";
// //   }
// //   if (typeof req.body.hth !== "undefined") {
// //     var hth = req.body.hth;
// //   } else {
// //     var hth = "not set";
// //   }
// //   if (typeof req.body.lth !== "undefined") {
// //     var lth = req.body.lth;
// //   } else {
// //     var lth = "not set";
// //   }

// //   if (typeof req.body.mc !== "undefined") {
// //     var mc = req.body.mc;
// //   } else {
// //     var mc = "not set";
// //   }

// //   if (typeof req.body.notes !== "undefined") {
// //     var notes = req.body.notes;
// //   } else {
// //     var notes = "not set";
// //   }

// //   if (typeof req.body.dob !== "undefined") {
// //     var dob = req.body.dob;
// //   } else {
// //     var dob = "not set";
// //   }
// //   var name1 = req.body.name;
// //   var email1 = req.body.email;
// //   var pass1 = req.body.pass;
// //   //   var dob = req.body.dob;
// //   //   var device_barcode = req.body.device_barcode;
// //   //   var hth = req.body.hth;
// //   //   var lth = req.body.lth;
// //   //   var mc = req.body.mc;
// //   //   var notes = req.body.notes;
// //   var dbname = process.env.dbname;
// //   let sql = "CALL " + dbname + ".set_patient_registration(?, ?, ?)";

// //   conn.query(sql, [name1, email1, pass1], (error, results, fields) => {
// //     if (error) {
// //       return console.error(error.message);
// //     } else {
// //       // return res.send({ msg: "success" });
// //       let sql1 = "CALL " + dbname + ".get_latest_patient()";

// //       conn.query(sql1, (error, results1, fields) => {
// //         if (error) {
// //           return console.error(error.message);
// //         } else {
// //           lastest_patient = results1[0][0].newpatient;
// //           // return res.send({ msg: "success" });
// //           let sql2 = "CALL " + dbname + ".set_patient_details(?, ?, ?, ?, ?)";

// //           conn.query(
// //             sql2,
// //             [lastest_patient, dob, hth, lth, mc],
// //             (error, results, fields) => {
// //               if (error) {
// //                 return console.error(error.message);
// //               } else {
// //                 // return res.send({ msg: "success" });
// //                 let sql3 = "CALL " + dbname + ".set_patient_notes(?, ?)";

// //                 conn.query(
// //                   sql3,
// //                   [notes, lastest_patient],
// //                   (error, results, fields) => {
// //                     if (error) {
// //                       return console.error(error.message);
// //                     } else {
// //                       //   return res.send({ msg: "success" });
// //                       let sql4 =
// //                         "CALL " + dbname + ".set_patient_devices(?, ?)";

// //                       conn.query(
// //                         sql4,
// //                         [lastest_patient, device_barcode],
// //                         (error, results, fields) => {
// //                           if (error) {
// //                             return console.error(error.message);
// //                           } else {
// //                             return res.send({ msg: "success" });
// //                           }
// //                         }
// //                       );
// //                     }
// //                   }
// //                 );
// //               }
// //             }
// //           );
// //         }
// //       });
// //     }
// //   });
// //   //   console.log(
// //   //     device_barcode +
// //   //       "\n" +
// //   //       hth +
// //   //       "\n" +
// //   //       lth +
// //   //       "\n" +
// //   //       mc +
// //   //       "\n" +
// //   //       notes +
// //   //       "\n" +
// //   //       name1 +
// //   //       "\n" +
// //   //       email1 +
// //   //       "\n" +
// //   //       pass1 +
// //   //       "\n" +
// //   //       dob
// //   //   );
// //   return 0;
// // }

// // Logout for Patient

// const patient_logout = (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.clearCookie("id");
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //all patients of one doctor
// // const all_patients_of_one_doctor = (req, res) => {
// //   var d_id1 = req.query.d_id;
// //   //   console.log(d_id1);
// //   var dbname = process.env.dbname;
// //   let sql = "CALL " + dbname + ".all_patients_of_one_doctor(?)";

// //   conn.query(sql, [d_id1], (error, results, fields) => {
// //     if (error) {
// //       return console.error(error.message);
// //     } else {
// //       //   console.log(results);
// //       //   return res.results;
// //       return res.send({ msg: results[0] });
// //     }
// //   });
// // };
// // function all_msgs(con, err) {
// //   if (err) throw err;
// //   con.query("SELECT * FROM msgs", function (err, result, fields) {
// //     if (err) throw err;
// //     console.log(result);
// //   });
// // }
// const get_auth_token = (req, res) => {
//   var code = req.body.code;
//   var options = {
//     method: "POST",
//     url: "https://wbsapi.withings.net/v2/oauth2",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     form: {
//       action: "requesttoken",
//       client_id: `${process.env.client_ID_withings}`,
//       client_secret: `${process.env.secret_ID_withings}`,
//       grant_type: "authorization_code",
//       code: `${code}`,
//       redirect_uri: `${process.env.redirecturl_withings}`,
//     },
//   };
//   request(options, function (error, response) {
//     if (error) throw new Error(error);
//     // console.log(code);
//     // console.log(response.body);
//     return res.status(200).send(response.body);
//   });
// };

// const get_weight = (req, res) => {
//   var with_access_token = req.body.with_access_token;
//   var options = {
//     method: "POST",
//     url: "https://scalews.withings.com/measure",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization: `Bearer ${with_access_token}`,
//       Cookie:
//         "current_path_login=%3Fresponse_type%3Dcode%26client_id%3D188ad9ebf3c8bedad1ee8468b756ee4f4e1d0147c66146a8ef78e8d234345f27%26redirect_uri%3Dhttp%253A%252F%252F127.0.0.1%252F%26state%3D3UJ8Thq6d6Ce7EV%26scope%3Duser.metrics%252Cuser.activity%26b%3Dauthorize2; next_block_login=authorize2; next_workflow_login=oauth2_user; signin_authorize_state=06f68f9b2e; url_params=%3Fresponse_type%3Dcode%26client_id%3D188ad9ebf3c8bedad1ee8468b756ee4f4e1d0147c66146a8ef78e8d234345f27%26redirect_uri%3Dhttp%253A%252F%252F127.0.0.1%252F%26state%3D3UJ8Thq6d6Ce7EV%26scope%3Duser.metrics%252Cuser.activity%26b%3Dauthorize2",
//     },
//     form: {
//       action: "getmeas",
//       category: "1",
//       lastupdate: "0",
//       meastypes: "1",
//     },
//   };
//   request(options, function (error, response) {
//     if (error) throw new Error(error);
//     // console.log(response.body);
//     return res.status(200).send(response.body);
//   });
// };

// const order_device = (req, res) => {
//   const did = req.body.did;
//   const devicetype = req.body.devicetype;
//   const numberofdevices = req.body.numberofdevices;
//   const address = req.body.address;

//   const insertQuery = `INSERT INTO ordered_devices (devicetype, did, numberofdevices, address) VALUES (?, ?, ?, ?)`;
//   conn.query(
//     insertQuery,
//     [devicetype, did, numberofdevices, address],
//     (error, results1) => {
//       if (error) {
//         return res.status(500).json({
//           success: false,
//           message: error.message,
//         });
//       } else {
//         return res.status(200).json({
//           success: true,
//           message: "Ordered Placed Successfully",
//         });
//       }
//     }
//   );
// };
// //get previous device orders
// const getpreviousorders = (req, res) => {
//   const userId = req.params.id;
//   const query = `SELECT * FROM ordered_devices WHERE did = ${userId}`;
//   try {
//     conn.query(query, (err, results) => {
//       if (err) {
//         throw err;
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "No Data" });
//       }
//       return res.status(200).json(results);
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// const stripe_call = async (req, res) => {
//   const quantity = req.body.numberofdevices;
//   const devicetype = req.body.devicetype;
//   const did = req.body.did;
//   const address = req.body.address;
//   // console.log(quantity);
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: "price_1NsiCBCgXt0dXLeD1AaAH43E",
//         quantity: quantity,
//       },
//     ],
//     mode: "payment",
//     success_url: `${process.env.frontend_URL}/doctor/success.html?quantity=${quantity}&devicetype=${devicetype}&did=${did}&address=${address}`,
//     cancel_url: `${process.env.frontend_URL}/doctor/cancel.html`,
//   });
//   // return res.status(200).json({ msg: "Done" });
//   // console.log(session.url);
//   return res.status(200).json({ url: session.url });
//   // res.redirect(303, session.url);
// };

// const activate_request = (req, res) => {
//   const user_id = req.body.pid;
//   const user_name = req.body.name;
//   const user_email = req.body.email;
//   const user_weight = req.body.weight;
//   const user_height = req.body.height;
//   const user_gender = req.body.gender;
//   const mac_address = req.body.mac_address;
//   var short_name = "";
//   for (var i = 0; i < 3; i++) {
//     short_name += user_name[i];
//   }
//   if (user_gender == "male" || user_gender == "Male") {
//     const user_gender1 = 0;
//   } else if (
//     user_gender == "female" ||
//     user_gender == "Female" ||
//     user_gender == "woman" ||
//     user_gender == "Woman"
//   ) {
//     const user_gender1 = 1;
//   } else {
//     const user_gender1 = 0;
//   }
//   const user_bday = req.body.bday;
//   const user_bday1 = Math.floor(new Date(user_bday).getTime() / 1000);

//   // console.log(user_bday1);
//   var timestamp = Date.now();
//   // console.log(timestamp / 1000);
//   timestamp = parseInt(timestamp / 1000);
//   // console.log(timestamp);
//   // Use the CryptoJS
//   // console.log(timestamp);
//   var data =
//     "getnonce" + "," + process.env.client_ID_withings + "," + timestamp;
//   signature = HMAC(data);
//   signature = signature.toString("hex");
//   // console.log(signature);
//   var options = {
//     method: "POST",
//     url: "https://wbsapi.withings.net/v2/signature",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     form: {
//       action: "getnonce",
//       client_id: process.env.client_ID_withings,
//       timestamp: timestamp,
//       signature: signature,
//     },
//   };
//   request(options, function (error, response) {
//     if (error) throw new Error(error);
//     var resa = JSON.parse(response.body);
//     nonce = resa.body.nonce;
//     console.log(nonce);

//     const new_options = {
//       action: "activate",
//       client_id: process.env.client_ID_withings,
//       nonce: nonce,
//       signature: signature,
//       mailingpref: "yes",
//       birthdate: user_bday1,
//       measures: [
//         {
//           value: user_height,
//           unit: 0,
//           type: 4,
//         },
//         {
//           value: user_weight,
//           unit: 0,
//           type: 1,
//         },
//       ],
//       gender: user_gender1,
//       preflang: "en_US",
//       unit_pref: {},
//       email: user_email,
//       timezone: "America/New_York",
//       shortname: short_name,
//       external_id: user_id,
//       mac_addresses: mac_address,
//     };
//     res.status(200).json({ res: "success" });
//     // var state = "state";
//   });
//   // Set the new environment variable
//   // pm.environment.set('timestamp', timestamp);
//   // pm.environment.set('signature', signature);
//   // console.log(
//   //   user_id + user_name + user_email + user_weight + user_height + user_gender
//   // );
// };
const add_student_to_course = (req, res) => {
  const { student, course } = req.body;
  conn.query(
    "insert into student_enrollment (`sid`, `cid`) VALUES (?,?)",
    [student, course],
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ msg: "Internal Server Error", error: error });
      }
      return res
        .status(200)
        .json({ msg: "Student added to course successfully." });
    }
  );
  // console.log(student);
  // console.log(course);
};

module.exports = {
  new_student,
  student_login,
  new_course,
  get_all_courses,
  get_all_students,
  add_student_to_course,
  get_courses_of_one_student,
  unenrol_student,
  add_assignment,
  get_assignment_of_one_course,
  get_submissions_of_all_students,
  new_submission,
  get_one_assignment,
  execute_code,
  //   addtotime,
  //   get_weight,
  //   get_auth_token,
  //   getpreviousorders,
  //   stripe_call,
  //   new_patient,
  //   new_doctor,
  //   update_pass_func,
  //   update_name,
  //   verify_email,
  //   doctor_login,
  //   doctor_logout,
  //   patient_login,
  //   edit_patient,
  //   delete_patient,
  //   get_one_doctor,
  //   get_one_patient,
  //   patient_search_by_name,
  //   get_one_patient_devices,
  //   all_patients_of_one_doctor,
  //   add_notes,
  //   sharepatientdata,
  //   get_one_patient_notes,
  //   get_one_patient_time,
  //   patient_logout,
  //   order_device,
  //   activate_request,
};
