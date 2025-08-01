// Stepik OAuth credentials
const STEPIC_CLIENT_ID = 'yTHDvlIxkBiLFIQy13HRBvXuJTN0OGFUY2lpq1YE';
const STEPIC_CLIENT_SECRET = 'Pjn88f560rp8ElUEH0PZwNvoWaaSp0UFF7KgmtFvYbS5UsF5kDlCd7KSq5UAfbZch3yVaXqSrrDd2Nqdn443RjsInitbNRZ1tHHeFg8SpUwjEIuQfcgBN3n4a3tMD5Ot';

async function getStepikToken() {
  const response = await fetch('https://stepik.org/oauth2/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${STEPIC_CLIENT_ID}&client_secret=${STEPIC_CLIENT_SECRET}`
  });
  const data = await response.json();
  return data.access_token;
}
const { onRequest } = require("firebase-functions/v2/https");
const fetch = require("node-fetch");


