/* eslint-disable no-param-reassign */
import accountActionTypes from './type';
import * as api from '../../services/api';

// sync action
export const registeredFlag = (data) => ({ type: accountActionTypes.ADDFLAG_ACCOUNT, payload: data });

export const setFlagList = (data) => ({ type: accountActionTypes.FLAGS_LIST, payload: data });

export const setCategoriesList = (data) => ({ type: accountActionTypes.CATEGORY_LIST, payload: data });

export const setDragDropList = (data) => ({ type: accountActionTypes.UPDATE_FLAGS_LIST, payload: data });

// Async action

export const getFlagListAsync = () => (dispatch) => api.getFlagListData()
  .then((response) => {
    return dispatch(setFlagList(response.data));
  })
  .catch((err) => {
    return err;
  });

export const getCategpriesListAsync = () => (dispatch) => api.getCategoriesListData()
  .then((response) => {
    return dispatch(setCategoriesList(response.data));
  })
  .catch((err) => {
    return err;
  });

export const onAddFlagAsync = (regDetails) => (dispatch) => api.postAddFlag(regDetails)
  .then((response) => dispatch(registeredFlag(response.data)));

export const getDragDropListAsync = (regDetails) => (dispatch) => api.getDragDropList(regDetails)
  .then((response) => dispatch(setDragDropList(response.data)));