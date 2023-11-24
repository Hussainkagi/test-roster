'use client'
const csvReducer = (state = { csvData: [] }, action) => {
  switch (action.type) {
    case 'SET_CSV_DATA':
      return { ...state, csvData: action.payload };
    default:
      return state;
  }
};

export default csvReducer;
