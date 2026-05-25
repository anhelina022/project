const API_KEY = '55452633-c04e299450091da3b967905d2';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
const perPage = 12;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  query = event.currentTarget.elements.query.value.trim();
  page = 1;
  gallery.innerHTML = '';
  loadMoreBtn.hidden = true;

  if (!query) return;

  await fetchImages();
}

async function onLoadMore() {
  page += 1;
  await fetchImages();

  const lastCard = gallery.lastElementChild;
  lastCard?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
}

async function fetchImages() {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();

    if (data.hits.length === 0) {
      alert('No images found');
      return;
    }

    gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits));

    const totalPages = Math.ceil(data.totalHits / perPage);
    loadMoreBtn.hidden = page >= totalPages;
  } catch (error) {
    console.error(error);
    alert('Something went wrong');
  }
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <div class="photo-card">
          <img src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" />

          <div class="stats">
            <p class="stats-item">
              <i class="material-icons">thumb_up</i>
              ${likes}
            </p>
            <p class="stats-item">
              <i class="material-icons">visibility</i>
              ${views}
            </p>
            <p class="stats-item">
              <i class="material-icons">comment</i>
              ${comments}
            </p>
            <p class="stats-item">
              <i class="material-icons">cloud_download</i>
              ${downloads}
            </p>
          </div>
        </div>
      </li>
    `
    )
    .join('');
}