import types from './type';

const intitialAccountState = {
  flagObj: {
    name: '',
    tag: '',
    type: 'job',
    categories: [],
    colour: '#ABB8C3',
    pos: 1,
    attributes: [
      { date_applicable: false },
    ],
  },
  flagList: [],
};

const accountReducer = (state = intitialAccountState, { type, payload }) => {
  switch (type) {
    case types.ADDFLAG_ACCOUNT:
      return { ...state, flagObj: intitialAccountState };
    case types.FLAGS_LIST:
      return { ...state, flagList: payload };
    case types.CATEGORY_LIST:
      return { ...state, categoryList: payload };
    case types.UPDATE_FLAGS_LIST:
      return { ...state };
    default:
      return state;
  }
};

export default accountReducer;
