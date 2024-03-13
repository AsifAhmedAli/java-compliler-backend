const conn = require("../conn/conn");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
var request = require("request");
// const prettier = require("prettier");
const crypto = require("crypto");
const { json } = require("express");

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
        conn.query(insertQuery, [name, email, password]);

        // const token = crypto.randomBytes(20).toString("hex");
        // const updateQuery = `UPDATE users SET token = ? WHERE email = ?`;
        // await conn.query(updateQuery, [token, email]);

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Student Registration",
          // text: `Hello ${name}, Thank you for registering as a doctor. Please click on the link below to verify your email address.`,
          html: `<p>Hello ${name},</p> <p>You are registered as a student.
          <br>Name: ${name}<br>
          Email: ${email} <br>
          Password: ${password}</p>`,
          // html: `Please click this link to verify your email: <a href="http://localhost:3000/verify/${token}">Verify Email</a>`
        };
        await transporter.sendMail(mailOptions);

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
        conn.query(insertQuery, [name]);

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

const get_courses_of_one_student = async (req, res) => {
  const sid = req.params.id;
  console.log(sid);

  const getEnrollments = () => {
    return new Promise((resolve, reject) => {
      const enrollmentQuery = `SELECT * FROM student_enrollment where sid = ?`;
      conn.query(enrollmentQuery, [sid], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

  const getCourses = (courseIds) => {
    return new Promise((resolve, reject) => {
      const courses = [];
      let counter = 0;

      if (courseIds.length === 0) {
        resolve(courses);
      }

      courseIds.forEach((element) => {
        const courseQuery = `SELECT * FROM courses where id = ?`;
        conn.query(courseQuery, [element], (err, results) => {
          if (err) {
            reject(err);
          } else {
            // console.log(results)
            courses.push(results);
            counter++;

            if (counter === courseIds.length) {
              // console.log(courses)
              resolve(courses);
            }
          }
        });
      });
    });
  };

  try {
    const enrollments = await getEnrollments();
    // console.log(enrollments)
    if (enrollments.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courseIds = enrollments.map((element) => element.cid);
    // console.log(courseIds)
    const courses = await getCourses(courseIds);

    console.log(courses);
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
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
         conn.query(insertQuery, [cid, question, answer, aname]);
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
  // console.log(sid);
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
        conn.query(insertQuery, [sid, aid, code, answer]);

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

const execute_code = async (req, res) => {
  const { code } = req.body;
  var options = {
    'method': 'POST',
    'url': 'http://52.90.27.199:4567/executeCode',
    'headers': {
      'Content-Type': 'text/plain'
    },
    body: code
  };
  await request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    return res.status(200).json({ output: response.body });
  });
  // console.log(code);
  // var request = require("request");
  // var options = {
  //   method: "POST",
  //   url: "https://05c350ad.compilers.sphere-engine.com/api/v4/submissions?access_token=43c2c16d3e55bdcfee2d805097cebf0c",
  //   formData: {
  //     compilerId: "10",
  //     // input: 'System.out.println("Hello, World!");',
  //     source: code,
  //   },
  // };
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   console.log(response.body);
  //   const pasred = JSON.parse(response.body);
  //   // console.log(pasred);
  //   const subid = pasred.id;


      //     var options4 = {
      //   method: "POST",
      //   url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
      // };
      // request(options4, function (error, response) {
      //   if (error) throw new Error(error);
      //   // console.log(response.body);
      //   const pasred_data = JSON.parse(response.body);
      //   console.log(pasred_data);
      //   if (pasred_data.result.status.code == 1) {
      //     setTimeout(function () {
      //       // console.log(subid);
      //     })
      //   }
      // });
    // setTimeout(function () {
    //   // console.log(subid);
    //   var options4 = {
    //     method: "GET",
    //     url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
    //   };
    //   request(options4, function (error, response) {
    //     if (error) throw new Error(error);
    //     // console.log(response.body);
    //     const pasred_data = JSON.parse(response.body);
    //     console.log(pasred_data);
    //     if (pasred_data.result.status.code == 1) {
    //       setTimeout(function () {
    //         // console.log(subid);
    //         var options3 = {
    //           method: "GET",
    //           url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
    //         };
    //         request(options3, function (error, response) {
    //           if (error) throw new Error(error);
    //           // console.log(response.body);
    //           const pasred_data = JSON.parse(response.body);
    //           if (pasred_data.result.status.code == 1) {
    //             setTimeout(function () {
    //               // console.log(subid);
    //               var options2 = {
    //                 method: "GET",
    //                 url: `https://05c350ad.compilers.sphere-engine.com/api/v4/submissions/${subid}?access_token=43c2c16d3e55bdcfee2d805097cebf0c`,
    //               };
    //               request(options2, function (error, response) {
    //                 if (error) throw new Error(error);
    //                 // console.log(response.body);
    //                 const pasred_data = JSON.parse(response.body);
    //                 if (pasred_data.result.status.code == 1) {
    //                   return res
    //                     .status(200)
    //                     .json({ output: "No response from the server" });
    //                 } else if (pasred_data.result.status.code == 11) {
    //                   return res
    //                     .status(200)
    //                     .json({ output: "Compilation Error" });
    //                 } else {
    //                   var options5 = {
    //                     method: "GET",
    //                     url: pasred_data.result.streams.output.uri,
    //                   };
    //                   request(options5, function (error, response) {
    //                     if (error) throw new Error(error);
    //                     // console.log(response.body);
    //                     return res.status(200).json({ output: response.body });
    //                   });
    //                 }
    //               });
    //             }, 3000);
    //           } else if (pasred_data.result.status.code == 11) {
    //             return res.status(200).json({ output: "Compilation Error" });
    //           } else {
    //             var options6 = {
    //               method: "GET",
    //               url: pasred_data.result.streams.output.uri,
    //             };
    //             request(options6, function (error, response) {
    //               if (error) throw new Error(error);
    //               // console.log(response.body);
    //               return res.status(200).json({ output: response.body });
    //             });
    //           }
    //         });
    //       }, 3000);
    //     } else if (pasred_data.result.status.code == 11) {
    //       return res.status(200).json({ output: "Compilation Error" });
    //     } else {
    //       var options7 = {
    //         method: "GET",
    //         url: pasred_data.result.streams.output.uri,
    //       };
    //       request(options7, function (error, response) {
    //         if (error) throw new Error(error);
    //         // console.log(response.body);
    //         return res.status(200).json({ output: response.body });
    //       });
    //     }
    //     // console.log(pasred_data.result.status.code);
    //   });
    // }, 3000);

    // console.log(subid);
  // });
// 
  // console.log(code);
};

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

const get_one_submission = (req, res) => {
  const subid = req.params.subid;
  // console.log(cid);
  var courses_list = [];
  const query = `SELECT * FROM submissions where id = ?`;
  try {
    conn.query(query, [subid], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Submission not found" });
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

// const get_prettified_code = (req, res) => {
//   const javaText = `
//   public class HelloWorldExample{
//     public static void main(String args[]){
//       System.out.println("Hello World !");
//     }
//   }
//   `;
  
//   const formattedText = prettier.format(javaText, {
//     parser: "java",
//     tabWidth: 2
//   });

  // try {
  //   const code = req.body.code;

  //   // Format Java code using google-java-format
  //   const formattedCode = formatCode(code);
  //   console.log(formattedCode)
    // return res.status(200).json({ result: formattedText });
  // } catch (error) {
  //   console.error('Error formatting code:', error);
  //   return res.status(500).json({ error: 'Internal Server Error' });
  // }
// }
module.exports = {
  new_student,
  student_login,
  get_one_submission,
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
  // get_prettified_code
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
