import { findeUserRequest, requestData } from './script/fetch.js';
import Notiflix from 'notiflix';

const refs = {
  formEl: document.querySelector('#search-form'),
  inputEl: document.querySelector('#search-form > input'),
  formBtn: document.querySelector('#search-form > button'),
  galleryEl: document.querySelector('.gallery'),
  loadingBtn: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', readInput);
refs.loadingBtn.addEventListener('click', readInput);

refs.loadingBtn.hidden = true;

async function readInput(event) {
  event.preventDefault();

  const inputValue = refs.inputEl.value.trim();

  if (requestData.word !== inputValue) resetGallery();

  requestData.word = inputValue;

  const dataImg = await findeUserRequest(inputValue);

  if (dataImg.data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (requestData.firstVisit) {
    Notiflix.Notify.success(
      `Hooray! We found ${dataImg.data.totalHits} images.`
    );
    requestData.firstVisit = false;
  }

  refs.galleryEl.insertAdjacentHTML('beforeend', creatMarcup(dataImg));

  refs.loadingBtn.hidden = false;
  requestData.page += 1;
  requestData.imgCount += dataImg.data.hits.length;

  console.log(requestData);

  if (requestData.imgCount >= dataImg.data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadingBtn.hidden = true;
  }
}

function creatMarcup({ data: { hits } }) {
  const imgCard = hits
    .map(
      img =>
        `<div class="photo-card">
  <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:${img.likes}</b>
    </p>
    <p class="info-item">
      <b>Views:${img.views}</b>
    </p>
    <p class="info-item">
      <b>Comments:${img.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:${img.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');

  // console.log(imgCard);
  return imgCard;
}

function resetGallery() {
  refs.galleryEl.innerHTML = '';
  requestData.page = 1;
  requestData.imgCount = 0;
  requestData.firstVisit = true;

  refs.loadingBtn.hidden = true;
}
