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

const run = function (countryName) {
  // OLD SCHOOL STUFF GOIN ON HERE

  // 1) making request with ajax call
  const request = new XMLHttpRequest();
  // 2) here we order info from this url
  request.open('GET', `https://restcountries.com/v3.1/name/${countryName}`);
  // 3) sending the request to that url in order to get an info from url
  request.send();

  request.addEventListener('load', function () {
    // getting JSON string
    console.log(this.responseText);

    // converting JSON to obj
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    showCard(data);

    // now lets request new data but after we get the data about the main country
    // in other words, lets see neighbour
    const [neighbour] = data.borders;
    console.log(neighbour);
    if (!neighbour) return;

    /*     
    // here starts a callback hell when we want to have a new data 
    // based on old data

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);
      showCard(data2, 'neighbour');
    }); 
    */

    // intstead of dealing with it lets use a promise
    // here how can we use the promise
    getCountryData(neighbour);
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
