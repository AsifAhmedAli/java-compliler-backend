const Pusher = require('pusher');
const conn = require("../conn/conn");
const jwt = require("jsonwebtoken");
const moment = require('moment');


const pusher = new Pusher({
    appId: "1568590",
    key: "1a67445cebebc23d19b6",
    secret: "a95c4fbf5ef8983c1de9",
    cluster: "ap2",
    useTLS: true
  });

//   pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
//   });

const check_patient_notifications =  (req, res) => {

  //   const  userId  = req.user.id;
  //   // Check patients who haven't been checked in 3 days
  // const threeDaysAgo = moment().subtract(3, 'days').toDate();

  // conn.query(
  //   'SELECT * FROM patients WHERE doctor_id = ? AND last_checked < ?',
  //   [userId, threeDaysAgo],
  //   (err, results) => {
  //     if (err) throw err;
  //     if (results.length > 0) {
  //       pusher.trigger('notifications', 'check_patients', {
  //         message: `You have ${results.length} patients who haven't been checked in 3 days`
  //       });
  //       console.log(pusher.trigger)
  //     }
  //   }
  // );

  // // Check patients who haven't been checked in 7 days
  // const sevenDaysAgo = moment().subtract(7, 'days').toDate();

  // conn.query(
  //   'SELECT * FROM patients WHERE doctor_id = ? AND last_checked < ?',
  //   [userId, sevenDaysAgo],
  //   (err, results) => {
  //     if (err) throw err;
  //     if (results.length > 0) {
  //       pusher.trigger('notifications', 'check_patients', {
  //         message: `You have ${results.length} patients who haven't been checked in 7 days`
  //       });
  //     }
  //   }
  // );

  // // Check patients who haven't been checked in 10 days
  // const tenDaysAgo = moment().subtract(10, 'days').toDate();

  // conn.query(
  //   'SELECT * FROM patients WHERE doctor_id = ? AND last_checked < ?',
  //   [userId, tenDaysAgo],
  //   (err, results) => {
  //     if (err) throw err;
  //     if (results.length > 0) {
  //       pusher.trigger('notifications', 'check_patients', {
  //         message: `You have ${results.length} patients who haven't been checked in 10 days`
  //       });
  //     }
  //   }
  // );

  // res.sendStatus(200);



  // const userId = req.user.id; // Get the logged-in user's ID

  // // Calculate the date for 3, 7, and 10 days ago
  // const date3DaysAgo = moment().subtract(3, 'days').format('YYYY-MM-DD');
  // const date7DaysAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
  // const date10DaysAgo = moment().subtract(10, 'days').format('YYYY-MM-DD');

  // // Query the database for patients who have not been checked in the last 3, 7, and 10 days
  // conn.query(
  //   `SELECT * FROM patients WHERE last_checked <= '${date3DaysAgo}' OR last_checked <= '${date7DaysAgo}' OR last_checked <= '${date10DaysAgo}'`,
  //   (err, patients) => {
  //     if (err) throw err;

  //     // Insert notifications for each patient who has not been checked in the last 3, 7, and 10 days
  //     patients.forEach(patient => {
      
  //       const message = `Patient ${patient.name} has not been checked since ${moment(patient.last_checked).format('MMMM Do, YYYY')}.`;
  //       const daysSinceLastCheckup = moment().diff(patient.last_checked, 'days');
  //       const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  //       conn.query(
  //         `INSERT INTO notifications (user_id, patient_id, message, days_since_last_checkup, created_at) VALUES (${userId}, ${patient.id}, '${message}', ${daysSinceLastCheckup}, '${createdAt}')`,
  //         (err, result) => {
  //           if (err) throw err;

  //           // Trigger a Pusher event for the new notification
  //           pusher.trigger(`user-${userId}`, 'new-notification', {
  //             notificationId: result.insertId,
  //             patientId:patient.id,
  //             message,
  //             daysSinceLastCheckup,
  //             createdAt
  //           });
  //         }
  //       );
  //     });

  //     res.send('Notifications created successfully.');
  //   }
  // );

    // Get the user ID from the request
    const userId = req.user.id;
    
// Get all patients for the user
conn.query('SELECT * FROM patients WHERE doctor_id = ?', [userId], (err, results) => {
  if (err) throw err;

  const notifications = [];

  // Check for patients who have not been checked in the last 3, 7, and 10 days
  for (let i = 0; i < results.length; i++) {
    const patient = results[i];

    const lastCheckedDate = moment(patient.last_checked);
    const currentDate = moment();

    const daysSinceLastChecked = currentDate.diff(lastCheckedDate, 'days');

    if (daysSinceLastChecked >= 10) {
      notifications.push({
        patientId: patient.id,
        message: `Patient ${patient.name} has not been checked in the last 10 days`,
        timestamp: moment().valueOf()
      });
    } else if (daysSinceLastChecked >= 7) {
      notifications.push({
        patientId: patient.id,
        message: `Patient ${patient.name} has not been checked in the last 7 days`,
        timestamp: moment().valueOf()
      });
    } else if (daysSinceLastChecked >= 3) {
      notifications.push({
        patientId: patient.id,
        message: `Patient ${patient.name} has not been checked in the last 3 days`,
        timestamp: moment().valueOf()
      });
    }
  }

  // Send notifications to the user using Pusher
  pusher.trigger(`notifications-${userId}`, 'new-notification', { notifications });

  res.json({ success: true, notifications });
});

}

// API endpoint to mark a notification as read
const markNotificationAsRead = (req, res) => {
  const { userId, patientId } = req.params;

  // Update the patient's last_checked date
  conn.query('UPDATE patients SET last_checked = ? WHERE id = ?', [moment().toISOString(), patientId], (err, results) => {
    if (err) throw err;

    // Update the notification's read status
    pusher.trigger(`notifications-${userId}`, 'mark-as-read', { patientId });

    res.json({ success: true });
  });
};


module.exports = {
    check_patient_notifications,markNotificationAsRead
}















// const Pusher = require('pusher');
// const conn = require("../conn/conn");
// const jwt = require("jsonwebtoken");
// const moment = require('moment');


// const pusher = new Pusher({
//     appId: "1568590",
//     key: "1a67445cebebc23d19b6",
//     secret: "a95c4fbf5ef8983c1de9",
//     cluster: "ap2",
//     useTLS: true
// });

// const check_patient_notifications = (req, res) => {

//     const userId = req.user.id;
//     let totalPatientCount = 0;
//     let patientNames = [];

//     // Check patients who haven't been checked in 3 days
//     const threeDaysAgo = moment().subtract(3, 'days').toDate();

//     conn.query(
//         'SELECT * FROM patients WHERE doctor_id = ? AND last_checked < ?',
//         [userId, threeDaysAgo],
//         (err, results) => {
//             if (err) throw err;
//             if (results.length > 0) {
//                 totalPatientCount += results.length;
//                 patientNames = patientNames.concat(results.map(patient => patient.name));
//             }
//         }
//     );

//     // Check patients who haven't been checked in 7 days
//     const sevenDaysAgo = moment().subtract(7, 'days').toDate();

//     conn.query(
//         'SELECT * FROM patients WHERE doctor_id = ? AND last_checked < ?',
//         [userId, sevenDaysAgo],
//         (err, results) => {
//             if (err) throw err;
//             if (results.length > 0) {
//                 totalPatientCount += results.length;
//                 patientNames = patientNames.concat(results.map(patient => patient.name));
//             }
//         }
//     );

//     // Check patients who haven't been checked in 10 days
//     const tenDaysAgo = moment().subtract(10, 'days').toDate();

//     conn.query(
//         'SELECT * FROM patients WHERE doctor_id = ? AND last_checked < ?',
//         [userId, tenDaysAgo],
//         (err, results) => {
//             if (err) throw err;
//             if (results.length > 0) {
//                 totalPatientCount += results.length;
//                 patientNames = patientNames.concat(results.map(patient => patient.name));
//             }

//             // Send notifications
//             if (totalPatientCount > 0) {
//                 const message = `You have ${totalPatientCount} patients who haven't been checked in the last 3, 7 or 10 days: ${patientNames.join(', ')}.`;
//                 pusher.trigger('notifications', 'check_patients', { message });
//             }
//         }
//     );

//     res.sendStatus(200);
// }

// module.exports = {
//     check_patient_notifications,
// }
