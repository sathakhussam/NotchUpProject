const proxyurl = "https://cors-anywhere.herokuapp.com/";
fetch(
  `${proxyurl}https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }
)
  .then((res) => {
    return res.json();
  })
  .then((response) => {
    this.data = response;
    return response, setTimeout(() => forCourseName(response), 500);
  })
  .catch((error) => {
    this.error = error.message || error.error;
  });

let resp;
let course_select = document.querySelector(".course");
async function forCourseName(response) {
  resp = response;
  for (let obj of resp) {
    course_select.innerHTML += await `<label class="option"><input type="radio" value='${obj.course_name}' class='course-radio' name="courseName" /><span class="title animated fadeIn"><i class="icon"></i>${obj.course_name}</span></label>`;
  }
  const radioinputs = document.querySelectorAll(".course-radio");

  for (let radioinput of radioinputs) {
    radioinput.addEventListener("click", datesAdder);
  }
}

let selectedValue;
let CourseDates = [];
let selectedArray;
let newSelectedArray;
let CourseDatesUnique;
let DatesObject = [];
let SuppCourseDates = [];
function datesAdder() {
  const rbs = document.querySelectorAll('input[name="courseName"]');
  // checking for checked radio buttons
  for (const rb of rbs) {
    if (rb.checked) {
      selectedValue = rb.value;
      break;
    }
  }
  // filtering the selected radio button value from the response
  selectedArray = resp.filter((obj) => {
    return obj.course_name === selectedValue;
  });
  // return console.log(selectedArray[0].slots);
  course_select = document.querySelector(".course-date");
  // converting UNIX TO Date
  for (let obj of selectedArray[0].slots) {
    date = Unixtohuman(obj.slot * 1);
    // DatesObject = date;
    CourseDates.push(date.Date);
    SuppCourseDates.push(date.DateSupp);
    DatesObject.push(date);
  }
  // Seperating Unique Items
  CourseDatesUnique = CourseDates.filter(function (item, pos) {
    return CourseDates.indexOf(item) == pos;
  });
  let SuppCourseDatesUnique = SuppCourseDates.filter(function (item, pos) {
    return SuppCourseDates.indexOf(item) == pos;
  });
  // creating radio button with dates
  course_select.innerHTML = `<!-- You can toggle select (disabled) --> <input type="radio" name="dateAlotted" id="course" /> <i class="toggle icon icon-arrow-down"></i> <i class="toggle icon icon-arrow-up"></i> <span class="placeholder">Choose Date</span>`;
  for (i = 0; i < CourseDatesUnique.length; i++) {
    DateVar = new Date(SuppCourseDatesUnique[i]);
    // console.log(CourseDatesUnique);
    const checkk = CompareMyTime(DateVar);
    if (checkk) {
      course_select.innerHTML += `<label class="option"><input type="radio" value='${CourseDatesUnique[i]}' class='course-date-radio' name="dateAlotted" /><span class="title animated fadeIn"><i class="icon"></i>${CourseDatesUnique[i]}</span></label>`;
    }
  }
  // adding event listeners to dates
  const datesradioinput = document.querySelectorAll(".course-date-radio");

  for (let radioinput of datesradioinput) {
    radioinput.addEventListener("click", timesAdder);
  }
}

function timesAdder() {
  const rbs = document.querySelectorAll('input[name="dateAlotted"]');
  // checking for checked radio buttons
  for (const rb of rbs) {
    if (rb.checked) {
      selectedValue = rb.value;
      break;
    }
  }
  // filtering the selected radio button value from the response

  // console.log(selectedValue);

  // console.log(DatesObject);

  newSelectedArray = DatesObject.filter((obj) => {
    // console.log(obj);
    return obj.Date == selectedValue;
  });
  date_select = document.querySelector(".course-date-time");
  date_select.innerHTML = `<!-- You can toggle select (disabled) --> <input type="radio" name="dayAlotted" id="course" /> <i class="toggle icon icon-arrow-down"></i> <i class="toggle icon icon-arrow-up"></i> <span class="placeholder">Choose Date</span>`;
  for (let obj of newSelectedArray) {
    const checkk = CompareMyTimeInSec(obj.ExpiryTimeObject);
    if (checkk) {
      date_select.innerHTML += `<label class="option"><input type="radio" value='${obj.Time}' class='course-date-radio' name="dayAlotted" /><span class="title animated fadeIn"><i class="icon"></i>${obj.Time} - ${obj.Extra_Time}</span></label>`;
    }
  }
}

//
//
//

function Unixtohuman(unixTimestamp) {
  const dateObject = new Date(unixTimestamp);
  // const humanDateFormat = dateObject.toUTCString();
  // console.log(humanDateFormat);
  var funcminutes = dateObject.getMinutes();
  funcminutes = funcminutes > 9 ? funcminutes : "0" + funcminutes;
  var funcmonths = dateObject.getMonth();
  funcmonths = funcmonths > 9 ? funcminutes : "0" + funcminutes;
  let copyDateObject = new Date(dateObject);

  copyDateObject.setHours(dateObject.getHours() - 4);
  // console.log(dateObject);
  // console.log(copyDateObject);
  const ToReturn = {
    Date: `${dateObject.getDate()}/${
      dateObject.getMonth() + 1
    }/${dateObject.getFullYear()}`,
    DateSupp: `${
      dateObject.getMonth() + 1
    }/${dateObject.getDate()}/${dateObject.getFullYear()}`,
    Time: `${dateObject.getHours()}:${funcminutes}`,
    Extra_Time: `${dateObject.getHours() + 1}:${funcminutes}`,
    UTCString: `${dateObject.toUTCString()}`,
    dateObject,
    Minutes: funcminutes,
    Hours: dateObject.getHours(),
    Day: dateObject.getDate(),
    Month: dateObject.getMonth() + 1,
    Year: dateObject.getFullYear(),
    ExpiryTime: `${dateObject.getHours() - 4}:${funcminutes}`,
    ExpiryTimeObject: copyDateObject,
  };
  // console.log(ToReturn.ExpiryTimeObject);
  return ToReturn;
}

function CompareMyTimeInSec(ToReturn) {
  const myTime = new Date();
  // returns true if the current time is correct return false  if the current time is the future meaning the trial class is over
  if (myTime > ToReturn) {
    return false;
  } else if (myTime < ToReturn) {
    return true;
  } else {
    return null;
  }
}
function CompareMyTime(ToReturn) {
  const myTime = new Date();
  return (
    myTime.getFullYear() <= ToReturn.getFullYear() &&
    myTime.getMonth() <= ToReturn.getMonth() &&
    myTime.getDate() <= ToReturn.getDate()
  );
}

function phonenumber(inputtxt) {
  var phoneno = /^\d{10}$/;
  if (inputtxt.value.match(phoneno)) {
    return true;
  } else {
    alert("message");
    return false;
  }
}

let phninput = document.querySelector(".phone");
phninput.addEventListener("onblur", (e) => {
  if (!phninput.value >= 1000000000 && phninput <= 9999999999) {
    const errors = document.querySelector(".errors");
    errors.innerHTML += "<p>The Phone Number isn't valid";
  }
});
var form = document.querySelector(".myform");
var btnlog = document.querySelector(".login");
function valuefromradio(classname) {
  const rbs = document.querySelectorAll(`input[name="${classname}"]`);
  // checking for checked radio buttons
  for (const rb of rbs) {
    if (rb.checked) {
      return rb.value;
      break;
    }
  }
}
let CourseName;
let DateAlloted;
let DayAlloted;
btnlog.addEventListener("click", (e) => {
  for (const rb of document.querySelectorAll(`input[name="courseName"]`)) {
    if (rb.checked) {
      CourseName = rb.value;
      break;
    }
  }
  for (const rb of document.querySelectorAll(`input[name="dateAlotted"]`)) {
    if (rb.checked) {
      DateAlloted = rb.value;
      break;
    }
  }
  for (const rb of document.querySelectorAll(`input[name="dayAlotted"]`)) {
    if (rb.checked) {
      DayAlloted = rb.value;
      break;
    }
  }

  const bodyContent = JSON.stringify({
    parentsName: document.querySelector(".namef").value,
    parentsEmailId: document.querySelector(".emailf").value,
    parentsPhoneNumber: document.querySelector(".phone").value,
    childsName: document.querySelector(".childnamef").value,
    childsAge: document.querySelector(".childagef").value,
    CourseName: `${CourseName}`,
    dateAlloted: `${DateAlloted}`,
    dayAlloted: `${DayAlloted}`,
  });
  // console.log(bodyContent);

  fetch("http://127.0.0.1:3000/forms", {
    // Adding method type
    method: "POST",

    // Adding body or contents to send

    body: bodyContent,

    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    // Converting to JSON

    // Displaying results to console
    .then((json) => {
      return json;
    });
  document.querySelector(".myform").reset();

  // console.log(bodyContent);
  e.preventDefault();
});
