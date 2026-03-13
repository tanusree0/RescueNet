import API from './api';

export const getMyReports = async () => {
  const { data } = await API.get('/incidents/my-reports');
  return data;
};

export const sendThankYou = async (id, thankYouNote) => {
  const { data } = await API.post(`/incidents/${id}/thank`, { thankYouNote });
  return data;
};

export const getNearbyIncidents = async (latitude, longitude) => {
  const { data } = await API.get(`/incidents/nearby?latitude=${latitude}&longitude=${longitude}`);
  return data;
};

export const createIncident = async (formData) => {
  const { data } = await API.post('/incidents', formData);
  return data;
};

export const acceptIncident = async (id) => {
  const { data } = await API.patch(`/incidents/${id}/accept`);
  return data;
};

export const completeIncident = async (id, isFakeReport = false) => {
  const { data } = await API.patch(`/incidents/${id}/complete`, { isFakeReport });
  return data;
};
