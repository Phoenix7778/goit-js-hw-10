import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(handleInputValue, DEBOUNCE_DELAY));

function handleInputValue(event) {
  const inputValue = event.target.value.trim();
  if (!inputValue) {
    cleanMarkup();
    return;
  } else {
    fetchCountries(inputValue).then(onInputValueLength).catch(onError);
  }
}

function onInputValueLength(data) {
  if (data.length > 10) {
    cleanMarkup();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    renderListOfCountries(data);
  } else if (data.length === 1) {
    renderCountry(...data);
  } else {
    throw new Error('Oops, there is no country with that name');
  }
}

function renderListOfCountries(arr) {
  cleanMarkup();
  const markup = arr.reduce(
    (markup, country) => markup + createMarkup(country),
    ''
  );
  countryList.innerHTML = markup;
}

function createMarkup(countries) {
  onClear();
  const markup = countries
    .map(({ flag, name }) => {
      return `<li class="list container-text"><img src='${flag}' width="50" height="30"/><p class="text">${name}</p></li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountry({ name, capital, population, flag, languages }) {
  cleanMarkup();
  countryInfo.innerHTML = `
  <div class="country-title"><img src="${flag}"width="50" height="30"><h2 class="country-name">${name}</h2></div><div class="country-property"><h3>Capital: </h3><p>${capital}</p></div><div class="country-property"><h3>Population: </h3><p>${population}</p></div><div class="country-property"><h3>Languages: </h3><p>${languages.map(
    language => ` ${language.name}`
  )}</p></div>
  `;
}

function onError() {
  cleanMarkup();
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

function cleanMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
