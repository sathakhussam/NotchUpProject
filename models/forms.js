const express = require("express");
const mongoose = require("mongoose");

const trialClassForm = new mongoose.Schema({
  ParentsName: {
    type: String,
    required: true,
  },
  ParentsPhoneNumber: {
    type: Number,
    required: true,
  },
  ParentsEmailId: {
    type: String,
    required: true,
  },
  ChildsName: {
    type: String,
    required: true,
  },
  ChildsAge: {
    type: Number,
    required: true,
  },
  CourseName: {
    type: String,
  },
  DateAlloted: {
    type: String,
  },
  DayAlloted: {
    type: String,
  },
});

module.exports = mongoose.model("Forms", trialClassForm);
