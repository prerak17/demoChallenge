/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import network from './network';

// ---------------------------- Manage Account SignUp, SignIn, ForgotPassword, ResetPassword, VerifyAccount --------------------------------

export const postAddFlag = (payload) => network.publicPost('', payload);

export const getFlagListData = (payload) => network.publicGet('', payload);

export const getCategoriesListData = (payload) => network.publicGet('categories', payload);

export const getDragDropList = (payload) => network.publicPut('update_positions', payload);