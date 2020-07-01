/* eslint-disable import/no-cycle */
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL;

const handleError = (error) => {
  const { response } = error;
  if (error && response) {
    throw (response.data);
  }
  throw (error);
};

const publicGet = (url, params) => axios.get(baseUrl + url, { params })
  .then((response) => response.data).catch((error) => handleError(error));

const publicPost = (url, payload, headers = undefined) => axios.post(baseUrl + url, payload, headers)
  .then((response) => response).catch((error) => handleError(error));

const publicRemove = (url, payload, headers = undefined) => axios.delete(baseUrl + url, payload, headers)
  .then((response) => response).catch((error) => handleError(error));

const publicPut = (url, payload, headers = undefined) => axios.put(baseUrl + url, payload, headers)
  .then((response) => response).catch((error) => handleError(error));

// const get = (url, params) => axios.get(baseUrl + url, {
//   params,
//   headers: { Authorization: getTokenFromStorage('userToken') },
// }).then((response) => response.data).catch((error) => handleErrorSender(error));

// const post = (url, payload) => axios.post(baseUrl + url, payload,
//   { headers: { Authorization: getTokenFromStorage('userToken') } })
//   .then((response) => response)
//   .catch((error) => handleErrorSender(error));

// const put = (url, payload) => axios.put(baseUrl + url, payload,
//   { headers: { Authorization: getTokenFromStorage('userToken') } })
//   .then((response) => response)
//   .catch((error) => handleErrorSender(error));

// const remove = (url) => axios.delete(baseUrl + url,
//   { headers: { Authorization: getTokenFromStorage('userToken') } })
//   .then((response) => response)
//   .catch((error) => handleErrorSender(error));

const network = {
  publicGet,
  publicPost,
  publicRemove,
  publicPut,
  // get,
  // post,
  // put,
  // remove,
};

export default (network);
