import Notiflix from 'notiflix';
import { findeUserRequest, requestData } from './script/fetch.js';
let throttle = require('lodash.throttle');

const refs = {
  formEl: document.querySelector('#search-form'),
  inputEl: document.querySelector('#search-form > input'),
  galleryEl: document.querySelector('.gallery'),
};

refs.formEl.addEventListener('submit', searchImages);

async function searchImages(event) {
  event.preventDefault();

  const inputValue = refs.inputEl.value.trim();

  if (requestData.word !== inputValue) resetGallery();
  if (requestData.word === inputValue) {
    return;
  }

  requestData.word = inputValue;

  const dataImg = await findeUserRequest(inputValue);

  infinityScroll();

  if (dataImg.data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  Notiflix.Notify.success(`Hooray! We found ${dataImg.data.totalHits} images.`);

  creatMarcup(dataImg);

  requestData.imgCount += dataImg.data.hits.length;
}

async function onLoadMore() {
  requestData.page += 1;

  const dataImg = await findeUserRequest(requestData.word);
  creatMarcup(dataImg);

  requestData.imgCount += dataImg.data.hits.length;

  if (requestData.imgCount >= dataImg.data.totalHits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    removeinfinityScroll();
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
  refs.galleryEl.insertAdjacentHTML('beforeend', imgCard);

  // console.log(imgCard);
  // return imgCard;
}

function resetGallery() {
  refs.galleryEl.innerHTML = '';
  requestData.page = 1;
  requestData.imgCount = 0;
}

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const treshhold = height - screenHeight / 6;
  const position = scrolled + screenHeight;

  if (position >= treshhold) {
    onLoadMore();
  }
}

const throttleChekPosition = throttle(() => checkPosition(), 250);

function infinityScroll() {
  window.addEventListener('scroll', throttleChekPosition);
}

function removeinfinityScroll() {
  window.removeEventListener('scroll', throttleChekPosition);
}
