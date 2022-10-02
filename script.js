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

    // now lets request new data but after
    // we get the data about the main country
    const [neighbour] = data.borders;
    console.log(neighbour);
    if (!neighbour) return;

    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);
      showCard(data2, 'neighbour');
    });
  });
};

btnFind.addEventListener('click', function (e) {
  e.preventDefault();

  const countryName = inputName.value;
  console.log(countryName);

  run(countryName);
});
