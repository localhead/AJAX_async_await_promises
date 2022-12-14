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
/* 



*/
// Coding Challenge #2 // loading images
// push the btn which will load the image. after 2 sec after
// it has loaded - load the second one
const btnLoadImg = document.querySelector('.btn-load-img');
const imageLoad = document.createElement('img');
const imagesPlace = document.querySelector('.images');

btnLoadImg.addEventListener('click', function (e) {
  // create a fn which just waits given amount of seconds
  // the purpose of this fn with promise is only to count seconds
  const wait = function (seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`${seconds} second passed`);
        // telling promise that it has been resolved
        resolve();
      }, seconds * 1000);
    });
  };

  // create fn with a promise which takes a path for pict
  // this promise can return resolve if success
  // or it can return reject if failture
  // then on resolve it loads it and returns picture
  // on reject it creates a new error

  const createImage = function (imgPath) {
    return new Promise((resolve, reject) => {
      imageLoad.src = `${imgPath}`;

      // If image loaded then return that const on resolved
      imageLoad.addEventListener('load', () => {
        imagesPlace.append(imageLoad);
        resolve(imageLoad);
      });

      imageLoad.addEventListener('error', () => {
        reject(new Error('Image not loaded'));
      });
    });
  };

  let currentImg;

  createImage('img/img-1.jpg')
    .then(img => {
      currentImg = img;
      console.log('Image 1 loaded');
      // loading 2 seconds after loading
      return wait(2);
    })
    .then(() => {
      //currentImg.style.display = 'none';
      return createImage('img/img-2.jpg');
    })
    .then(img => {
      currentImg = img;
      console.log('Image 2 loaded');
      return wait(2);
    })
    .then(() => {
      currentImg.style.display = 'none';
    })
    .catch(err => console.error(err));
});
/* 



*/
// Async Await/ its just a syntactic sugar for promises

const DoSomeThing = async function (country) {
  // Using try/Catch in order to find error in code
  try {
    // wait until U get data and then store it in variable
    const result = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    // wait until data will be jsoned and store it
    const toJayson = await result.json();

    // show me what you got after some time
    console.log(toJayson);

    // Lets make an error to catch
    if (toJayson[0].capital[0] === 'Paris')
      throw new Error('This is a Fucking Paris. We hate those frog Lovers!');
    return toJayson[0].capital[0];
  } catch (err) {
    // Here we are trying to catch every occuring
    // error in code grabed with try
    console.error(err.message);
  }
};

DoSomeThing('France');

// Cool now let get data from asycn func
// Is it going to work?
const AsyncFnResult = DoSomeThing('Russia');
console.log(AsyncFnResult);
// it will return a promise dumbass!
// cuz asycn fn always returns a promise
// because JS did not get data out of it at real time!
// instead of this use 'than' method again!
DoSomeThing('Russia').then(result => console.log(result));

// But lets not mix old aproach of writing promises with 'then' with async/await
// and lets use IIFE in order to get the result and still remain inside of asycn/await syntax
(async function () {
  const resultAsync = await DoSomeThing('Portugal');
  console.log(resultAsync);
})();
/* 




*/
const getJSON = async function (country) {
  const what = await fetch(`https://restcountries.com/v3.1/name/${country}`);

  if (!what.status) {
    throw new Error(`Country not found! (${response.status})`);
  }

  return what.json();
};

// Promise.all
// in this fn we use async operations at the same time!
const get3Countries = async function (c1, c2, c3) {
  try {
    const data = await Promise.all([getJSON(c1), getJSON(c2), getJSON(c3)]);
    const res = [data.map(d => d[0].capital)].flat(2);
    console.log(res);
  } catch (err) {
    console.error(err.message);
  }
};

get3Countries('Spain', 'Tanzania', 'norway');

/* 


*/
// Promise.race - first settled promise wins the race.
// data will have data from the fastest promise. No matter if its relosved or reject
(async function () {
  const data = await Promise.race([
    getJSON('italy'),
    getJSON('spain'),
    getJSON('brazil'),
  ]);

  const [res] = data;
  console.log('Check out RACE! Res is ', res);
})();

// Example of race which throws error if time of loading was above 10 seconds
const RaceTimerWithTimer = async function () {
  const result = await Promise.race([
    getJSON('mongolia'),
    new Promise(function (_, reject) {
      return setTimeout(function () {
        reject(new Error('Request took too much time!'));
      }, 10000);
    }),
  ]);
  console.log(result);
};

RaceTimerWithTimer();
/* 


*/
// Promise.allSettled - shows all the results even though some are rejected

Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Not success'),
  Promise.resolve('Success for sure'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err.message));
/* 


*/
// Promise.allSettled - always shows only one fastest of the results
// even though some might be rejected
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Not success'),
  Promise.resolve('Success for sure'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err.message));
/* 



*/
// Codding challenge #3
/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, 
this time using async/await (only the part where the promise is consumed).
Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 
'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' 
function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

*/

const btnLoadImgAsycn = document.querySelector('.btn-load-img-async');
const imageLoadAsync = document.createElement('img');
const imagesPlaceAsync = document.querySelector('.images-async');

const waitAsync = async function (seconds) {
  return await new Promise(function (resolve, _) {
    setTimeout(() => {
      console.log(`${seconds} passed`);
      resolve();
    }, seconds * 1000);
  });
};

const showPicturesAsync = async function (imgPath) {
  console.log(imgPath);
  const a = await new Promise(function (resolve, reject) {
    imageLoadAsync.src = `${imgPath}`;

    imageLoadAsync.addEventListener('load', () => {
      imagesPlace.append(imageLoadAsync);
      resolve(imageLoadAsync);
    });

    imageLoadAsync.addEventListener('error', () => {
      reject(new Error('Cant load img'));
    });
  });
  return a;
};

const hidePicture = async function (pict) {
  console.log('sadad');
};

btnLoadImgAsycn.addEventListener('click', function () {
  try {
    const loadNPause = async function () {
      let pict = await showPicturesAsync('img/img-1.jpg');

      await waitAsync(2);
      pict.style.display = 'none';

      pict = await showPicturesAsync('img/img-2.jpg');
      pict.style.display = 'block';
      await waitAsync(2);
      pict.style.display = 'none';
    };
    loadNPause();
  } catch (err) {
    console.error(err);
  }
});
