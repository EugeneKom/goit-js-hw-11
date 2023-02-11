const API_KEY = '33503247-588ca757b47ad28580f337a8a';
const BASE_URL = 'https://pixabay.com/api/';

const axios = require('axios').default;

const requestData = {
  word: '',
  page: 1,
  imgCount: 0,
};

function findeUserRequest(request) {
  return axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${requestData.page}&per_page=40`
  );
}

export { findeUserRequest, requestData };
