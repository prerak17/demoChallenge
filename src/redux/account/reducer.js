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

//different Reducers for different Lists
const accountReducer = (state = intitialAccountState, { type, payload }) => {
  switch (type) {
    case types.FLAG_OBJECT:
      return { ...state, flagObj: intitialAccountState };
    case types.FLAGS_LIST:
      return { ...state, flagList: payload };
    case types.CATEGORY_LIST:
      return { ...state, categoryList: payload };
    case types.UPDATE_FLAGS_LIST:
      return { ...state };
    case types.UPDATE_FORM:
      return { ...state, flagObj: payload };
    default:
      return state;
  }
};

export default accountReducer;
