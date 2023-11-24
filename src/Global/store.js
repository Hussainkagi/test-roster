'use client'
import { legacy_createStore as createStore, combineReducers } from 'redux';
import csvReducer from './cvReducer';


const rootReducer = combineReducers({
  csv: csvReducer,
});

const store = createStore(rootReducer);

export default store;
