'use strict';

const countriesContainer = document.querySelector('.countries');
const btnFind = document.querySelector('.btn-find');
const inputName = document.querySelector('.input_name');

const showCard = function (data, className = '') {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span>${data.population}</p>
    <p class="country__row"><span>🗣️</span>${data.capital}</p>
    <p class="country__row"><span>💰</span>${
      data.region === 'Europe' ? 'EURO' : 'Unknown'
    }</p>
  </div>
</article>
`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  countriesContainer.style.opacity = 1;
};

// Example of promise chain: (flat chain of promises)
// first we fetch from API. then we convert delivered data with JSON
// then we use that data to show chard wit our function & also return fetched data
// of neigbour country and continue same cycle

const run = function (countryName) {
  fetch(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(response => response.json())
    .then(data => {
      showCard(data[0]);
      const neighbour = data[0].borders[0];
      console.log(neighbour);

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(response => response.json())
    .then(data => {
      showCard(data[0], 'neighbour');
    })
    .catch(error => {
      //dealing with errors if we could not fetch
      console.log(error);
      renderError(`Conection lost! ${error}`);
    })
    .finally(() => {
      console.log(
        'finally - always shows up nomatter if promise is success or not'
      );
    });
};

btnFind.addEventListener('click', function (e) {
  e.preventDefault();

  const countryName = inputName.value;
  console.log(countryName);

  run(countryName);
});

// making the same request as with a main country but with promise.
// 1 - we fetch data from API, it returning a promise
// 2 - then we get it with JSON, to read the response. it also returns a promise
// 3 - then we store that data in last function
const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      showCard(data[0], 'neighbour');
    });
};
