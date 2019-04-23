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
