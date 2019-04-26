export const MIN_CARD_NUMBER_IN_COLUMN = 0;

export const IS_CONSOLE_LOG_OPEN = false;

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
    name: "All Applied",
    param: ""
  },
  {
    id: 2,
    name: "To Apply",
    param: "&status_id=2"
  },
  {
    id: 1,
    name: "Applied",
    param: "&status_id=1"
  },
  {
    id: 3,
    name: "Phone Screen",
    param: "&status_id=3"
  },
  {
    id: 4,
    name: "Onsite Interview",
    param: "&status_id=4"
  },
  {
    id: 5,
    name: "Offer",
    param: "&status_id=5"
  }
];

export const TRENDING_YEAR_OPTIONS = [
  {
    id: 0,
    name: "2019",
    param: "&year=2019"
  },
  {
    id: 1,
    name: "2018",
    param: "&year=2018"
  },
  {
    id: 2,
    name: "Lifetime",
    param: ""
  }
];

export const TRENDING_COUNT_OPTIONS = [
  {
    id: 0,
    name: "10",
    param: "&count=10"
  },
  {
    id: 1,
    name: "20",
    param: "&count=20"
  },
  {
    id: 2,
    name: "30",
    param: "&count=30"
  }
];

export const TRENDING_TYPE_OPTIONS = [
  {
    id: 0,
    name: "Companies",
    param: "api/metrics/get_top_companies"
  },
  {
    id: 1,
    name: "Positions",
    param: "api/metrics/get_top_positions"
  }
];

export const VISIBILITY_FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  INCOMPLETE: "incomplete"
};

export function makeTimeBeautiful(time, type = "date") {
  var beautiful_time = "";
  var dateFull = time.toString().split("T");
  var datePart = dateFull[0].split("-");
  var beautifulDatePart = datePart[1] + "." + datePart[2] + "." + datePart[0];
  if (type == "date" || dateFull[1] == undefined) {
    beautiful_time = beautifulDatePart;
  }
  if (type == "dateandtime" && dateFull[1] != undefined) {
    var time_part = dateFull[1].split(":");
    beautiful_time =
      beautifulDatePart + " at " + time_part[0] + ":" + time_part[1];
  } else {
    beautiful_time = beautiful_time;
  }
  return beautiful_time;
}
