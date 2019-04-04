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
    id: 'applied',
    name: 'Applied',
    icon: "../../src/assets/icons/AppliedIcon@3x.png",
  },
  {
    id: 'toApply',
    name: 'To Apply',
    icon: "../../src/assets/icons/ToApplyIcon@3x.png",
  },
 {
    id: 'phoneScreen',
    name: 'Phone Screen',
    icon: "../../src/assets/icons/PhoneScreenIcon@3x.png",
  },
  {
    id: 'onsiteInterview',
    name: 'Onsite Interview',
    icon: "../../src/assets/icons/OnsiteInterviewIcon@3x.png",
  },
  {
    id: 'offer',
    name: 'Offer',
    icon: "../../src/assets/icons/OffersIcon@3x.png",
  }
]