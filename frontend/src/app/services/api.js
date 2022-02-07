const axios = require('axios');

const api = axios.create({
  baseURL: process.env.API_URL,
});

const homeService = axios.create({
  baseURL: process.env.HOME_URL,
});

const sessionsService = axios.create({
  baseURL: process.env.SESSIONS_URL,
});

module.exports = {api, homeService, sessionsService};