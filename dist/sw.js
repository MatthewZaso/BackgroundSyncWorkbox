importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js');

/*
workboxSW.precache([
  {
    "url": "/app/bundle.js",
    "revision": "19afcfdd70063492b4b7fba29e6d0fba"
  },
  {
    "url": "/app/css/main.css",
    "revision": "e88bcd142c360d622399a618faad3999"
  }
]);
*/

// const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
//   maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
// });

// workbox.routing.registerRoute(
//   new RegExp('https://jsonplaceholder.typicode.com.*'),
//   workbox.strategies.networkOnly({
//     plugins: [bgSyncPlugin]
//   }),
//   'GET'
// );

const sendNotification = (data) => {
  console.log('channel message broadcasted');
  const channel = new BroadcastChannel('app-channel');
  console.log(data);
  console.log(data[0].request.url);
  const clone = data.map(item => item.request.url);
  console.log(clone);
  channel.postMessage({ data: clone });
}

const queue = new workbox.backgroundSync.Queue(
  'myQueueName',
  {
    callbacks: {
      queueDidReplay: sendNotification
    }
  }
);

self.addEventListener('fetch', (event) => {
  // Clone the request to ensure it's save to read when
  // adding to the Queue.
  const promiseChain = fetch(event.request.clone())
    .catch((err) => {
      console.log(err, 'caught by sw');
      return queue.addRequest(event.request);
    });

  event.waitUntil(promiseChain);
});
