/* eslint-disable no-param-reassign */
import accountActionTypes from './type';
import * as api from '../../services/api';

// sync action
export const registeredFlag = (data) => ({ type: accountActionTypes.FLAG_OBJECT, payload: data });

export const deletedFlag = (data) => ({ payload: data });

export const setFlagList = (data) => ({ type: accountActionTypes.FLAGS_LIST, payload: data });

export const setCategoriesList = (data) => ({ type: accountActionTypes.CATEGORY_LIST, payload: data });

export const setDragDropList = (data) => ({ type: accountActionTypes.UPDATE_FLAGS_LIST, payload: data });

export const updateData = (data) => ({ type: accountActionTypes.UPDATE_FORM, payload: data });

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

export const onDeleteFlagAsync = (regDetails) => (dispatch) => api.deleteFlag(regDetails)
  .then((response) => dispatch(deletedFlag(response.data)));

export const onUpdateFlagAsync = (regDetails) => (dispatch) => api.putUpdateFlag(regDetails)
  .then((response) => dispatch(updateData(response.data)));

export const getDragDropListAsync = (regDetails) => (dispatch) => api.getDragDropList(regDetails)
  .then((response) => dispatch(setDragDropList(response.data)));