'use strict';

const countriesContainer = document.querySelector('.countries');
const btnFind = document.querySelector('.btn-find');
const btnGetPlace = document.querySelector('.btn-where-am-i');
const inputName = document.querySelector('.input_name');
const geolocationTitle = document.getElementById('geolocation-info');
const placeTitle = document.getElementById('place-info');
const countriesContainerSecond = document.querySelector('.countries_second');

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
    .then(response => {
      // handling error if country not found
      console.log(response);

      if (response.status !== 200) {
        throw new Error(`Country not found! (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data[0]);
      showCard(data[0]);
      //const neighbour = data[0].borders[0];
      //console.log(neighbour);

      if (!data[0].borders) throw new Error('No neighbour found!');

      return fetch(
        `https://restcountries.com/v3.1/alpha/${data[0].borders[0]}`
      );
    })
    .then(response => {
      // handling error if country not found
      if (!response.status) {
        throw new Error(`Country not found! (${response.status})`);
      }
      return response.json();
    })
    .then(data => {
      showCard(data[0], 'neighbour');
    })
    .catch(err => {
      //dealing with errors if we could not fetch
      console.log(err);
      renderError(`${err}`);
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
/* 



*/
// Promises Codding Challenge #1
btnGetPlace.addEventListener('click', function (e) {
  e.preventDefault();

  console.log('clicked');
  geolocationTitle.textContent = 'e';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position);
        const data = [position.coords.latitude, position.coords.longitude];

        geolocationTitle.textContent = `Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`;
        whereAmI(data);
        btnFind.style.opacity = 0;
        inputName.style.opacity = 0;
      },
      function () {
        alert('Could not get you position');
      }
    );
  }

  const whereAmI = function (data) {
    console.log(data[0]);

    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${data[0]}&longitude=///${data[1]}&localityLanguage=en`
    )
      .then(response => {
        console.log(response);

        if (response.status !== 200) {
          throw new Error(`not 200(${response.status})`);
        }

        return response.json();
      })
      .then(response => {
        console.log(response);
        placeTitle.textContent = `You are in ${response.countryName}, ${response.city}`;
        return response;
      })
      .then(response => {
        run(response.countryName);
      })
      .catch(err => {
        //dealing with errors if we could not fetch
        console.log(err);
      });
  };
});
