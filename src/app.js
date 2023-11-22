import axios from 'axios';
import Notiflix from 'notiflix';

const search = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let images = [];
let currentPage = 1;
let q = '';
let per_page = 40;

const getImages = async (page = 1) => {
  try {
    const res = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '40628537-4691ca78f12bcbf3b40caa1e0',
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page,
        page,
      },
    });

    images = res.data.hits;

    const totalHits = res.data.totalHits;

    if (totalHits > per_page && images.length === per_page) {
      loadBtn.style.display = 'flex';
    } else {
      loadBtn.style.display = 'none';
      Notiflix.Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
    }

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again.');
  }
};

function imageTemplate(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  return `<div class="photo-card ">
        <a class='gallery__link' href="${largeImageURL}">
          <img class="gallery__image " src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views </b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments </b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads </b>
            ${downloads}
          </p>
        </div>
      </div>
  `;
}

function imagesTemplate() {
  return images.map(imageTemplate).join('');
}

function renderImages() {
  const markup = imagesTemplate();
  gallery.innerHTML += markup;
}

function onSearch(evt) {
  evt.preventDefault();

  const input = evt.target.elements.searchQuery.value.trim();
  q = input;

  if (input !== '') {
    gallery.innerHTML = '';
    currentPage = 1;
    getImages(currentPage).then(() => renderImages());
  }

  evt.target.reset();
}

function loadMore() {
  currentPage++;
  getImages(currentPage).then(() => renderImages());
}

loadBtn.addEventListener('click', loadMore);

search.addEventListener('submit', onSearch);

/*

*/
