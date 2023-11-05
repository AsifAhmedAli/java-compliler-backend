const conn = require("../conn/conn");

const moment = require("moment");
var fs = require("fs");
const io = require("socket.io")();
// var type = upload.single("msgfileattachment");

//set_new_message
const set_new_message = (req, res) => {
  // console.log(req.body);
  // const [chatroomID, msg, sender_id] = req.body;
  chatroomID = req.body.chatroomid;
  if (req.body.msgarea == "") {
    msg = "";
  } else {
    msg = req.body.msgarea;
  }
  sender_id = req.body.sender_id;
  conn.query(
    "INSERT INTO messages (sender_id, message, chatroomid) VALUES (?, ?, ?)",
    [sender_id, msg, chatroomID],
    function (err, result) {
      if (err) {
        console.log(err);
      }
    }
  );
  if (req.files) {
    req.files.forEach(function (file) {
      var newname = file.originalname.replaceAll(" ", "");
      if (fs.existsSync("uploads/" + newname)) {
        var tmp_path = file.path;
        var time = Date.now();
        var updatednewname = time + newname;
        var target_path = "uploads/" + updatednewname;
        // console.log(target_path);
        //Copy the uploaded file to a custom folder
        fs.rename(tmp_path, target_path, function () {
          conn.query(
            "SELECT id FROM messages WHERE sender_id = ? and message = ? and chatroomid = ? and id = (select max(id) from messages)",
            [sender_id, msg, chatroomID],
            (error, results, fields) => {
              if (error) {
                console.log(error);
              }
              var idofmessage = results[0].id;
              // console.log(idofmessage);
              conn.query(
                "INSERT INTO message_attachments(message_id, file_name, file_path) VALUES (?, ?, ?)",
                [idofmessage, updatednewname, target_path],
                function (err, result) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }
          );
        });
      } else {
        var tmp_path = file.path;
        var target_path = "uploads/" + newname;
        // console.log(target_path);
        //Copy the uploaded file to a custom folder
        fs.rename(tmp_path, target_path, function () {
          conn.query(
            "SELECT id FROM messages WHERE sender_id = ? and message = ? and chatroomid = ? and id = (select max(id) from messages)",
            [sender_id, msg, chatroomID],
            (error, results, fields) => {
              if (error) {
                console.log(error);
              }
              var idofmessage = results[0].id;
              // console.log(idofmessage);
              conn.query(
                "INSERT INTO message_attachments(message_id, file_name, file_path) VALUES (?, ?, ?)",
                [idofmessage, newname, target_path],
                function (err, result) {
                  if (err) {
                    console.log(err);
                    // return res.json({ err });
                  }
                }
              );
            }
          );
          //Send a NodeJS file upload confirmation message
          // res.write("NodeJS File Upload Success!");
          // res.end();
        });
        // console.log("file not found!");
      }
    });
  }
  return res.status(200).json({ message: "Success" });
};
const edit_message = (req, res) => {
  const message_id = req.params.id;
  const userId = req.user.id;
  const { message } = req.body;

  conn.query(
    "UPDATE messages SET message = ? WHERE id = ? AND sender_id = ?",
    [message, message_id, userId],
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(400)
          .send({ message: "Message not found or unauthorized" });
      }
      // Emit the updated message to all connected clients
      io.emit("update message", { id: message_id, message });
      return res.send({ message: "Message updated successfully" });
    }
  );
};

// Delete a message

const delete_message = (req, res) => {
  const messageId = req.params.id;
  const userId = req.user.id;

  conn.query(
    "DELETE FROM messages WHERE id = ? AND sender_id = ?",
    [messageId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: "Error deleting message" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(400)
          .send({ message: "You can only delete your own message" });
      }
      // Emit the deleted message to all connected clients
      io.emit("delete message", messageId);
      return res.send({ message: "Message deleted successfully" });
    }
  );
};

// Delete all chat
const delete_all_messages = async (req, res) => {
  const userId = req.user.id;

  conn.query(
    "DELETE FROM messages WHERE sender_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: "Error deleting messages" });
      }
      if (result.affectedRows === 0) {
        return res.status(400).send({ message: "No messages found" });
      }
      // Emit the deleted messages to all connected clients
      io.emit("delete messages", userId);
      return res.send({ message: "Messages deleted successfully" });
    }
  );
};

// const list_of_all_to_messages = (req, res) => {
//   const userId = req.params.id;

//   conn.query(
//     "SELECT * FROM messages WHERE sender_id = ? or receiver_id = ? group by receiver_id",
//     [userId, userId],
//     (error, results, fields) => {
//       // const totalPatients = results;

//       // console.log(doctor_id);
//       if (error) {
//         res.status(500).json({ error: error.message });
//       } else {
//         res.status(200).json({
//           results,
//           // patients: results,
//         });
//       }
//     }
//   );
// conn.query(

//   [],
//   (err, result) => {
//     if (err) {
//       return res.status(500).send({ message: 'Error deleting messages' });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(400).send({ message: 'No messages found' });
//     }
//     // Emit the deleted messages to all connected clients
//     io.emit('delete messages', userId);
//     return res.send({ message: 'Messages deleted successfully' });
//   }
// );
// };

// new chat room
const newchatroom = (req, res) => {
  // const { chatroomname } = req.params;
  // function getParameterByName(name, url = window.location.href) {
  //   name = name.replace(/[\[\]]/g, "\\$&");
  //   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  //     results = regex.exec(url);
  //   if (!results) return null;
  //   if (!results[2]) return "";
  //   return decodeURIComponent(results[2].replace(/\+/g, " "));
  // }
  // const params = Object.fromEntries(req.params.id.entries());
  const urlParams = new URLSearchParams(req.params.id);
  // console.log(req.params.id.moiz);
  // console.log(urlParams);
  keys1 = [];
  values1 = [];
  const keys = urlParams.keys(),
    values = urlParams.values();
  for (const key of keys) {
    keys1.push(key);
    // console.log(key);
  }
  for (const value of values) {
    values1.push(value);
    // console.log(value);
  }
  const chatroomname = values1.shift();
  const created_by = values1.pop();
  // urlParams.forEach((key) => {
  // console.log(values1.length);
  var keysa = "";
  var valsa = "";

  // });
  try {
    // Check if the email is already registered
    conn.query(
      "INSERT INTO chatroom (name, created_by) VALUES (?, ?)",
      [chatroomname, created_by],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        conn.query(
          `SELECT * from chatroom where name = ? and created_by = ? and id = (select max(id) from chatroom)`,
          [chatroomname, created_by],
          async (error, results) => {
            if (error) {
              return res.status(500).json({ message: error.message });
            }
            var rea = results[0].id;
            // console.log(values1);
            keysa = `(${results[0].id}, ${created_by})`;
            for (i = 0; i < values1.length; i++) {
              keysa += `,(${rea}, ${values1[i]})`;
            }
            // console.log(keysa);
            // -------------------------------------------------------------
            // results[0].id
            // console.log();/
            const insertQuery = `INSERT INTO chatroommembers (chatroomID, memberID) VALUES ${keysa}`;
            await conn.query(insertQuery, [], async (error, results) => {
              if (error) {
                return res.status(500).json({ message: error.message });
              }
              res.status(201).json({
                message: "Chatroom registered successfully.",
                success: true,
              });
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const get_all_chat_rooms_of_a_user = (req, res) => {
  const userId = req.params.id;

  conn.query(
    "SELECT chatroom.name,chatroom.id FROM chatroom join chatroommembers on chatroommembers.chatroomID = chatroom.id WHERE chatroommembers.memberID = ?",
    [userId],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({
          results,
          // patients: results,
        });
      }
    }
  );
};

const countchatroommembers = (req, res) => {
  const chatroomID = req.params.id;
  // const chatroomID = req.body;
  // console.log(chatroomID);

  conn.query(
    "SELECT count(memberID) as pcount FROM chatroommembers WHERE chatroomID = ?",
    [chatroomID],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({
          results,
          // patients: results,
        });
      }
    }
  );
};

const get_all_messages_of_a_chatroom = (req, res) => {
  const chatroomID = req.params.id;
  conn.query(
    "SELECT * FROM messages  WHERE chatroomid = ?",
    [chatroomID],
    (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        // results.forEach((key) => {
        //   conn.query(
        //     "SELECT * FROM message_attachments WHERE message_id = ?",
        //     [key.id],
        //     (error, results1, fields) => {
        //       if (error) {
        //         res.status(500).json({ error: error.message });
        //       } else {
        //         if (results1 == "") {
        //         } else {
        //           results = results.push(results1);
        //         }
        //         // res.status(200).json({ results1 });
        //       }
        //     }
        //   );
        // });
        // console.log(results);
        res.status(200).json({ results });
      }
    }
  );
};
// getchat
// const getchat = (req, res) => {
//     var from = req.body.from;
//     var to = req.body.to;

// }
module.exports = {
  set_new_message,
  delete_message,
  delete_all_messages,
  edit_message,
  // list_of_all_to_messages,
  newchatroom,
  get_all_chat_rooms_of_a_user,
  get_all_messages_of_a_chatroom,
  countchatroommembers,
};
