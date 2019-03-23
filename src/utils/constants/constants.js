export const MIN_CARD_NUMBER_IN_COLUMN = 0;

export const TOAPPLY = "toapply";
export const APPLIED = "applied";
export const PHONESCREEN = "phonescreen";
export const ONSITEINTERVIEW = "onsiteinterview";
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

export const FIND_APPLICATION_STATUS_LIST_NAME = {
  1:[APPLIED],
  2:[TOAPPLY],
  3:[PHONESCREEN],
  4:[ONSITEINTERVIEW],
  5:[OFFER]
};