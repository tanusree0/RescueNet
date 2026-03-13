import API from './api';

export const updateMyLocation = async (latitude, longitude) => {
  const { data } = await API.patch('/users/me/location', { latitude, longitude });
  return data;
};
