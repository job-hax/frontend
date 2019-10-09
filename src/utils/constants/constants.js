import React from "react";

export const MIN_CARD_NUMBER_IN_COLUMN = 0;

export const IS_CONSOLE_LOG_OPEN = true;

export const TOAPPLY = "toApply";
export const APPLIED = "applied";
export const PHONESCREEN = "phoneScreen";
export const ONSITEINTERVIEW = "onsiteInterview";
export const OFFER = "offer";

export const UPDATE_APPLICATION_STATUS = {
  [APPLIED]: {
    id: 1,
    value: "APPLIED"
  },
  [TOAPPLY]: {
    id: 2,
    value: "TO APPLY"
  },
  [PHONESCREEN]: {
    id: 3,
    value: "PHONE SCREEN"
  },
  [ONSITEINTERVIEW]: {
    id: 4,
    value: "ONSITE INTERVIEW"
  },
  [OFFER]: {
    id: 5,
    value: "OFFER"
  }
};

export const APPLICATION_STATUSES_IN_ORDER = [
  {
    id: "applied",
    name: "Applied",
    icon: "../../src/assets/icons/AppliedIcon@3x.png"
  },
  {
    id: "toApply",
    name: "To Apply",
    icon: "../../src/assets/icons/ToApplyIcon@3x.png"
  },
  {
    id: "phoneScreen",
    name: "Phone Screen",
    icon: "../../src/assets/icons/PhoneScreenIcon@3x.png"
  },
  {
    id: "onsiteInterview",
    name: "Onsite Interview",
    icon: "../../src/assets/icons/OnsiteInterviewIcon@3x.png"
  },
  {
    id: "offer",
    name: "Offer",
    icon: "../../src/assets/icons/OffersIcon@3x.png"
  }
];

export const TRENDING_STATUS_OPTIONS = [
  {
    id: 0,
    value: "All Applied",
    param: ""
  },
  {
    id: 2,
    value: "To Apply",
    param: "&status_id=2"
  },
  {
    id: 1,
    value: "Applied",
    param: "&status_id=1"
  },
  {
    id: 3,
    value: "Phone Screen",
    param: "&status_id=3"
  },
  {
    id: 4,
    value: "Onsite Interview",
    param: "&status_id=4"
  },
  {
    id: 5,
    value: "Offer",
    param: "&status_id=5"
  }
];

export const TRENDING_YEAR_OPTIONS = [
  {
    id: 0,
    value: "2019",
    param: "&year=2019"
  },
  {
    id: 1,
    value: "2018",
    param: "&year=2018"
  },
  {
    id: 2,
    value: "Lifetime",
    param: ""
  }
];

export const TRENDING_COUNT_OPTIONS = [
  {
    id: 0,
    value: "10",
    param: "&count=10"
  },
  {
    id: 1,
    value: "20",
    param: "&count=20"
  },
  {
    id: 2,
    value: "30",
    param: "&count=30"
  }
];

export const TRENDING_TYPE_OPTIONS = [
  {
    id: 0,
    value: "Companies",
    param: "/api/metrics/get_top_companies"
  },
  {
    id: 1,
    value: "Positions",
    param: "/api/metrics/get_top_positions"
  }
];

export const VISIBILITY_FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  INCOMPLETE: "incomplete"
};

export const USER_TYPES = {
  undefined: 1,
  public: 2,
  student: 3,
  alumni: 4,
  career_services: 5
};

export const USER_TYPE_NAMES = {
  1: { name: "Undefined", header: "Undefined" },
  2: { name: "Public", header: "Public" },
  3: { name: "Student", header: "School" },
  4: { name: "Alumni", header: "Alumni" },
  5: { name: "Career Services", header: "Career Services" }
};

export function makeTimeBeautiful(time, type = "date") {
  var beautiful_time = "";
  var dateFull = time.toString().split("T");
  var datePart = dateFull[0].split("-");
  var monthsList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  var fullMonthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var fullDaysList = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var beautifulDatePart =
    datePart[2] +
    "-" +
    monthsList[parseInt(datePart[1]) - 1] +
    "-" +
    datePart[0];
  var beautifulLongDatePart =
    fullDaysList[new Date(time).getDay()] +
    ", " +
    fullMonthsList[parseInt(datePart[1]) - 1] +
    " " +
    datePart[2] +
    ", " +
    datePart[0];
  if (type == "date" || dateFull[1] == undefined) {
    beautiful_time = beautifulDatePart;
  }
  if (type == "dateandtime" && dateFull[1] != undefined) {
    var time_part = dateFull[1].split(":");
    beautiful_time =
      beautifulDatePart + " at " + time_part[0] + ":" + time_part[1];
  }
  if (type == "longDate") {
    beautiful_time = beautifulLongDatePart;
  } else {
    beautiful_time = beautiful_time;
  }
  return beautiful_time;
}

export const closeIcon = (
  <svg viewBox="0 0 352 520">
    <path
      fill="currentColor"
      d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
    ></path>
  </svg>
);

export const commentDots = (
  <svg viewBox="0 0 512 512">
    <path
      fill="currentColor"
      d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"
    ></path>
  </svg>
);
