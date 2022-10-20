// promises, Async_Await, AJAX

// AJAX - allows to communicate with remote web servers in asynchronous way.
// With AJAX we calls, we can request data from web servers dynamically
// without reloading the page

// to learn more about this section -see project called 'AJAX_async_await_promises'
// you can find it on my github

// callback hell
// is something that looks like this like this:
setTimeout(() => {
  console.log('1 second passed');
  setTimeout(() => {
    console.log('2 seconds passed');
    setTimeout(() => {
      console.log('3 seconds passed');
      setTimeout(() => {
        console.log('4 seconds passed');
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);
//

// in order to avoid callback hell we should use feature called promises
// Promise - is a container for a asycnchronasly delivered value
// Promise is a container for a future value

/* 


*/
// Which will be executed first?
console.log('Test start');
setTimeout(() => console.log('0 Seconds Passed'), 0);
Promise.resolve('Resolved Promise').then(res => console.log(res));

// this promise will take long time to execute
Promise.resolve('Resolverd Promise 2').then(res => {
  for (let i; i < 10000000; i++) {}
});

console.log('Test end');

// First will be executed console logs, then it will be the choise between promise and setTimeout.
// Both of them will migrate to callback queue after completion
// However, the promise has microtasks queue,
// thats why it has priorioty of execution over setTimeout.
// And we can see it obvious by adding a long time execution promise

// so the execution thread will look like this:

console.log('Test start');
console.log('Test end');
Promise.resolve('Resolved Promise').then(res => console.log(res));
setTimeout(() => console.log('0 Seconds Passed'), 0);
/* 



*/
// Promise creator

const lotteryPromise = new Promise(
  setTimeout(function (resolve, reject) {
    console.log('Lottery is happening');
    if (Math.random() >= 0.5) {
      resolve('You won!');
    } else {
      reject(new Error('You lost'));
    }
  }, 3000)
)
  .then(res => console.log(res))
  .catch(err => console.error(err));
/* 



*/
// Promisifying setTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 second passed');
    return wait(1);
  })
  .then(() => console.log('4 second passed'));
/* 



*/
// lets make a promise with geolocation API
const getPosition = function () {
  // creating a promise which might return only good/bad
  return new Promise(function (relosve, reject) {
    navigator.geolocation.getCurrentPosition(
      // if good returning position
      position => relosve(position),
      // if bad returning error
      err => reject(err)
    );
  });
};

getPosition()
  .then(resolved => console.log(resolved))
  .catch(rejected => console.error(rejected));
/* 




*/
// top level await. this wait stops the execution! it will be executed first. it blocking entite execution!
const getLastUser = async function () {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await res.json();
  console.log(data);

  return { user: data.at(-1).id, name: data.at(-1).name };
};

// this will return a promise cuz data is not recieved while executing :(
const res = getLastUser();

// insted use top -level awiat
const res2 = await getLastUser();
console.log(res2);
