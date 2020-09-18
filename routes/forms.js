const express = require("express");

const router = express.Router();

const trialClassForm = require("../models/forms");

router.get("/", async (req, res) => {
  const allForms = await trialClassForm.find();
  try {
    res.status(200).json({ status: "success", data: { allForms } });
  } catch (err) {
    res.status(200).json({ error: `There is an error, ${err}` });
  }
});

router.post("/", async (req, res) => {
  const new_form = {
    ParentsName: req.body.parentsName,
    ParentsEmailId: req.body.parentsEmailId,
    ParentsPhoneNumber: req.body.parentsPhoneNumber,
    ChildsName: req.body.childsName,
    ChildsAge: req.body.childsAge,
    CourseName: req.body.courseName,
    DateAlloted: req.body.dateAlloted,
    DayAlloted: req.body.dayAlloted,
  };
  try {
    const newFormSubmit = new trialClassForm(new_form);
    newFormSubmit.save(function (err, doc) {
      if (err) return console.error(err);
      console.log("Document inserted succussfully!");
    });
    res.status(201).json(newFormSubmit);
    sendingMail(
      req.body.parentsEmailId,
      req.body.parentsName,
      req.body.childsName,
      req.body.dateAlloted,
      req.body.DayAlloted
    );
  } catch (err) {
    res.send(`There is an error, ${err}`);
  }
});

module.exports = router;

function sendingMail(reciever, ParentName, StudentName, date, day) {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "gmail",
    // turn on the less secure apps on gmail
    auth: {
      user: "mohamedhussam4002@gmail.com",
      pass: "satush12",
    },
  });

  var mailOptions = {
    from: "youremail@gmail.com",
    to: `${reciever}`,
    subject: "NotchUp Trial Class Booked successfully",
    text: `Dear ${ParentName}\n ${StudentName}'s class at ${date} ${day} has been successfully booked.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
