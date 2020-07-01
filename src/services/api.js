/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import network from './network';

// ---------------------------- Manage Add, Update, Delete --------------------------------

export const postAddFlag = (payload) => network.publicPost('', payload);

export const putUpdateFlag = (payload) => network.publicPut(`${payload.id}`, payload);

export const deleteFlag = (payload) => network.publicRemove(`${payload.id}`, {});

export const getFlagListData = (payload) => network.publicGet('', payload);

export const getCategoriesListData = (payload) => network.publicGet('categories', payload);

export const getDragDropList = (payload) => network.publicPut('update_positions', payload);