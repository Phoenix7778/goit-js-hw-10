import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener('input', debounce(handleInputValue, DEBOUNCE_DELAY));

function handleInputValue(e) {
  const inputValue = e.target.value.trim();

  fetchCountries(inputValue)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        onClearInput();
      } else if (data.length >= 2 && data.length <= 10) {
        RenderList(data);
      } else if (data.length === 1) {
        RenderContainer(data);
      } else if (data.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        onClearInput();
      } else if (inputValue === '') {
        onClearInput();
      }
    })
    .catch(FetchError);
}

function RenderContainer(countries) {
  onClearInput();
  const markup = countries
    .map(({ name, capital, flag, population, languages }) => {
      const nameLanguages = languages.map(language => language.name);

      return `<div><div class="container-title"><img src='${flag}' width="50" height="30"/><h1 class="title"><b>${name}</b></h1></div><p class="text"><b>Capital:</b> ${capital}</p>
    <p class="text"><b>Population:</b> ${population}</p><p class="text"><b>Languages:</b> ${nameLanguages.join(
        ', '
      )}</p></div>`;
    })
    .join('');
  info.insertAdjacentHTML('beforeend', markup);
}

function RenderList(countries) {
  onClearInput();
  const markup = countries
    .map(({ flag, name }) => {
      return `<li class="list container-text"><img src='${flag}' width="50" height="30"/><p class="text">${name}</p></li>`;
    })
    .join('');
  list.insertAdjacentHTML('beforeend', markup);
}

function FetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function onClearInput() {
  list.innerHTML = '';
  info.innerHTML = '';
}
