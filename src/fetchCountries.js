export const fetchCountries = name =>
  fetch(`https://restcountries.com/v2/name/${name}?fields=name,capital,population,flag,languages
`).then(response => response.json());
