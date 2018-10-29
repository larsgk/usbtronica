/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["README.md","d9715fff77b7bfe0418d8833dbaa8b74"],["assets/audio/Nathalia1.ogg","4d05ec40ede4b5c66c3c38482a846603"],["assets/audio/piano_c.ogg","7f104724f52afa87b8b731b386e810ee"],["assets/audio/test.ogg","3b1e93b039c0cd6dfa1d647ae47fae94"],["assets/audio/test1.ogg","22f2704f1a486bc5c92d0dbcd894d62a"],["assets/images/favicon.ico","df3db0761919615e41c6ecdcecbbf4d0"],["assets/images/manifest/icon-144x144.png","759ea4d0c7ae5b0d1ec4e72e145d89ba"],["assets/images/manifest/icon-192x192.png","3bd35144943dee0804cd85cbeeecd29f"],["assets/images/manifest/icon-48x48.png","27a12fde25cac25db2c12dad4ad3803e"],["assets/images/manifest/icon-512x512.png","95b4eecbca20f2d8261f93459b401a5d"],["assets/images/manifest/icon-72x72.png","a5e529342c20132e7f90227ac3468626"],["assets/images/manifest/icon-96x96.png","77e96451c98469d71a2aebefb5190835"],["index.html","b6d84876a822435d72eb1e23503a427f"],["local_modules/audio-utils/audio-utils.js","2a44c0b9b86fe82263712facfd76eb74"],["local_modules/controller-settings/controller-settings.js","44a86f2981a4f2dd2c7298133a5c13af"],["local_modules/instrument-control/base-control.js","7af5106e7cb221b2f47f3d890a2c02be"],["local_modules/instrument-control/defs.js","9e8409521a147ec84055153fdf639164"],["local_modules/instrument-control/dummy-control.js","2992f7fccf688d8f97c44c39c4247506"],["local_modules/instrument-control/empirikit-control.js","c4ad086dc9d649b920fb4b2521f947b4"],["local_modules/instrument-control/instrument-control.js","f64fc83f03651e46b3603ab5ca5770ed"],["local_modules/instrument-control/keyboard-control.js","816fc28d8157c1e5d0777fe91d84be63"],["local_modules/instrument-control/midi-mapping.js","69fcc7a558d9f9022a9e5932b9965fab"],["local_modules/instrument-control/thingy52-control.js","39ca5d51e32283f8d16dbb59c26c3eac"],["local_modules/instrument-control/webbluetoth-helper.js","532926ef03f3809a008b4792e1c1d8b6"],["local_modules/instrument-control/webmidi-control.js","90959bcc7fc5499cd58e66bffdfa4a8e"],["local_modules/instrument-control/webusb-helper.js","043d216233b15e31bb8c695b333f4c2c"],["local_modules/mat-button/mat-button.js","0de22135cc69a768da397886c1a57a09"],["local_modules/sample-visualizer/sample-visualizer.js","06a24a0951f93843a80d0b3ded24d0be"],["manifest.json","7eb290335b1bb6205914c3851a1d8e4e"],["modules/lit-html-element/lit-element.js","7d6d1dfe9a176b49492e80830626cc3e"],["modules/lit-html/lib/lit-extended.js","a509408415a9c38ba3e2c7ef944cb063"],["modules/lit-html/lib/repeat.js","be611d6d6b4357f7f02e1dc15095698e"],["modules/lit-html/lib/unsafe-html.js","39e654e2d250e121b685a9d8e60a6ecf"],["modules/lit-html/lib/until.js","ee03ee53eee5697f51fb8aa258d42e6e"],["modules/lit-html/lit-html.js","ea40d1680c36cb7a76d522ad160f75c1"],["node_modules/@types/w3c-web-usb/README.md","d5e2093f0cc8775cbc87fffb1d9bebcb"],["node_modules/@types/w3c-web-usb/index.d.ts","0645fa9a94165c8972e6ae6a2f227336"],["node_modules/@types/w3c-web-usb/package.json","28af22b4b4e0996b6cc00f4c97e08c39"],["node_modules/@types/web-bluetooth/README.md","325673c29f9e3592cbc073a70654b733"],["node_modules/@types/web-bluetooth/index.d.ts","3ccb017c1731ac8fd23586e8925b895a"],["node_modules/@types/web-bluetooth/package.json","12ab8221f780e548e27871b245f7678d"],["node_modules/lit-html-element/CHANGELOG.md","be6859897967b6497860c9d59bb49561"],["node_modules/lit-html-element/README.md","e2d3e06901942049c8baf7ee46de926f"],["node_modules/lit-html-element/lit-element.js","7d6d1dfe9a176b49492e80830626cc3e"],["node_modules/lit-html-element/node_modules/lit-html/CHANGELOG.md","d3f3bfad2cfdfb92cca412c295748966"],["node_modules/lit-html-element/node_modules/lit-html/README.md","d11260d21b7fbc539898cbfcdb88d415"],["node_modules/lit-html-element/node_modules/lit-html/lib/async-append.d.ts","ee8e88815bd50b8d63cab58e753c5527"],["node_modules/lit-html-element/node_modules/lit-html/lib/async-append.js","3425f2ed3c050b5222b81be095ad493e"],["node_modules/lit-html-element/node_modules/lit-html/lib/async-append.js.map","1603e6638535ad8217bc950f695c8003"],["node_modules/lit-html-element/node_modules/lit-html/lib/async-replace.d.ts","4d766de107b017ca5e78523575d924f5"],["node_modules/lit-html-element/node_modules/lit-html/lib/async-replace.js","63e384c9cb26516380907986c1a23fbf"],["node_modules/lit-html-element/node_modules/lit-html/lib/async-replace.js.map","73da4f5743d630e7342a0603263f1c93"],["node_modules/lit-html-element/node_modules/lit-html/lib/lit-extended.d.ts","ee2dde55ade6f5ab2ff422d83d93329f"],["node_modules/lit-html-element/node_modules/lit-html/lib/lit-extended.js","fce22866ffac8998434dbc1546a38d4c"],["node_modules/lit-html-element/node_modules/lit-html/lib/lit-extended.js.map","cbb617dc3419ec47626e9c8ecdc9e8f8"],["node_modules/lit-html-element/node_modules/lit-html/lib/repeat.d.ts","aa60b4d10a5f2a865c828ee23c14bade"],["node_modules/lit-html-element/node_modules/lit-html/lib/repeat.js","f4cbcb7a4a2b453fa2df5460a7ca3faa"],["node_modules/lit-html-element/node_modules/lit-html/lib/repeat.js.map","743f20a0586d0f67f2b160ce8ccd5cc8"],["node_modules/lit-html-element/node_modules/lit-html/lib/toggle.d.ts","d41d8cd98f00b204e9800998ecf8427e"],["node_modules/lit-html-element/node_modules/lit-html/lib/toggle.js","33ba7cf6589f73ffa264be94344524a1"],["node_modules/lit-html-element/node_modules/lit-html/lib/toggle.js.map","0015b364a0f5c591a5ab6ab887269c7b"],["node_modules/lit-html-element/node_modules/lit-html/lib/unsafe-html.d.ts","57ed3dbe9ac8e75ed22e29c0fe343fa0"],["node_modules/lit-html-element/node_modules/lit-html/lib/unsafe-html.js","68d76f033adbaf4fea06ad13cf0980ce"],["node_modules/lit-html-element/node_modules/lit-html/lib/unsafe-html.js.map","0e172f14244d54806a0cda99028cccb7"],["node_modules/lit-html-element/node_modules/lit-html/lib/until.d.ts","11155bf497626c89f796a21a5e22ca7a"],["node_modules/lit-html-element/node_modules/lit-html/lib/until.js","5c149fcee4354ebda36af2e9bb63a79a"],["node_modules/lit-html-element/node_modules/lit-html/lib/until.js.map","e55f9093357be24f15f3827d860be772"],["node_modules/lit-html-element/node_modules/lit-html/lit-html.d.ts","65cbd5c6b1274e254a1508f79a7da235"],["node_modules/lit-html-element/node_modules/lit-html/lit-html.js","ca54784733a4f223bd271d66bad1b559"],["node_modules/lit-html-element/node_modules/lit-html/lit-html.js.map","82d016d15f791ca464b78ccf0479093c"],["node_modules/lit-html-element/node_modules/lit-html/package.json","3190f52d922e655bdf2c2a9c8bcc169a"],["node_modules/lit-html-element/node_modules/lit-html/src/lib/async-append.ts","6ec0ca38cbd0db834e0e118bcd84ca8e"],["node_modules/lit-html-element/node_modules/lit-html/src/lib/async-replace.ts","3d1d5221bcf72240ce06ef928184ba85"],["node_modules/lit-html-element/node_modules/lit-html/src/lib/lit-extended.ts","948af400b743bf735bf69e21c77d8b32"],["node_modules/lit-html-element/node_modules/lit-html/src/lib/repeat.ts","b139003720d74a01dbb38671233483d5"],["node_modules/lit-html-element/node_modules/lit-html/src/lib/unsafe-html.ts","fbc7ffabf2082c9a868ac37852fe1e74"],["node_modules/lit-html-element/node_modules/lit-html/src/lib/until.ts","944db08f31d7432fbcf8ed68f03200c6"],["node_modules/lit-html-element/node_modules/lit-html/src/lit-html.ts","0a0687908c378cae561f006560f12166"],["node_modules/lit-html-element/package.json","b22b88be6bba7f89dbdbe8edef3cd491"],["node_modules/lit-html-element/src/lit-element-decorators.d.ts","a9fa17e6fd5e998a41f3da25f440fa04"],["node_modules/lit-html-element/src/lit-element-decorators.js","3fac377a31864a468b9b08228654a105"],["node_modules/lit-html-element/src/lit-element-decorators.js.map","630ec145387bc06a8290f64d35e99871"],["node_modules/lit-html-element/src/lit-element-decorators.ts","14294f3baa1545feef25fdc2a513cf0e"],["node_modules/lit-html-element/src/lit-element.d.ts","e37e28cb218f48fd6d9473de4289d241"],["node_modules/lit-html-element/src/lit-element.js","b2044f6cfb55768f6b8fdadba277a03d"],["node_modules/lit-html-element/src/lit-element.js.map","3b53ba1f656cac555169ca64a1dcbef9"],["node_modules/lit-html-element/src/lit-element.ts","6555c7d10c6074a5d64d9c2e82303cdb"],["node_modules/lit-html/CHANGELOG.md","d8f2624a76dbd1f3af042f0e3250e681"],["node_modules/lit-html/README.md","1e706bba3521ae62f7670030f6e70773"],["node_modules/lit-html/lib/async-append.d.ts","ee8e88815bd50b8d63cab58e753c5527"],["node_modules/lit-html/lib/async-append.js","3425f2ed3c050b5222b81be095ad493e"],["node_modules/lit-html/lib/async-append.js.map","1603e6638535ad8217bc950f695c8003"],["node_modules/lit-html/lib/async-replace.d.ts","4d766de107b017ca5e78523575d924f5"],["node_modules/lit-html/lib/async-replace.js","94441d15b3b527cf44bc2d3ac703de54"],["node_modules/lit-html/lib/async-replace.js.map","6781998c5bf8b698bf8c16d864d1d493"],["node_modules/lit-html/lib/lit-extended.d.ts","e0aaf11f927f277514045eb2f0b2bcc0"],["node_modules/lit-html/lib/lit-extended.js","16bf2cb7a12d3beaa0aa711d6db9d737"],["node_modules/lit-html/lib/lit-extended.js.map","757ac29b80ade1e7cfb8a10f6e42f519"],["node_modules/lit-html/lib/repeat.d.ts","aa60b4d10a5f2a865c828ee23c14bade"],["node_modules/lit-html/lib/repeat.js","f4cbcb7a4a2b453fa2df5460a7ca3faa"],["node_modules/lit-html/lib/repeat.js.map","03678534d65e1f3e33ad3d9f62f6ac62"],["node_modules/lit-html/lib/shady-render.d.ts","c53f37026a59f449e07b4db69cd01d05"],["node_modules/lit-html/lib/shady-render.js","a77476b03a11424b79374febc0a97a56"],["node_modules/lit-html/lib/shady-render.js.map","9bd143c83754a47f8ecc028cc5015e8b"],["node_modules/lit-html/lib/toggle.d.ts","d41d8cd98f00b204e9800998ecf8427e"],["node_modules/lit-html/lib/toggle.js","33ba7cf6589f73ffa264be94344524a1"],["node_modules/lit-html/lib/toggle.js.map","0015b364a0f5c591a5ab6ab887269c7b"],["node_modules/lit-html/lib/unsafe-html.d.ts","57ed3dbe9ac8e75ed22e29c0fe343fa0"],["node_modules/lit-html/lib/unsafe-html.js","68d76f033adbaf4fea06ad13cf0980ce"],["node_modules/lit-html/lib/unsafe-html.js.map","0e172f14244d54806a0cda99028cccb7"],["node_modules/lit-html/lib/until.d.ts","11155bf497626c89f796a21a5e22ca7a"],["node_modules/lit-html/lib/until.js","5c149fcee4354ebda36af2e9bb63a79a"],["node_modules/lit-html/lib/until.js.map","e55f9093357be24f15f3827d860be772"],["node_modules/lit-html/lit-html.d.ts","0edf6b88866a59b1079d1bc36641ed79"],["node_modules/lit-html/lit-html.js","0d445d3f418fa2abfb7b41a604f0cb0b"],["node_modules/lit-html/lit-html.js.map","c8f95ba6af94b8661e5d7b4678ba3d89"],["node_modules/lit-html/package.json","026dc2ff065b62ed62b968956093a94c"],["node_modules/lit-html/src/lib/async-append.ts","6ec0ca38cbd0db834e0e118bcd84ca8e"],["node_modules/lit-html/src/lib/async-replace.ts","7a4d4a369f272e65b9007ba7964f881d"],["node_modules/lit-html/src/lib/lit-extended.ts","3b28f4deeb967ca23d1c62c72e01aafe"],["node_modules/lit-html/src/lib/repeat.ts","d4becab5398764195d773084e9b25bb7"],["node_modules/lit-html/src/lib/shady-render.ts","c668ea4ebe2830c4912453e01409b542"],["node_modules/lit-html/src/lib/unsafe-html.ts","fbc7ffabf2082c9a868ac37852fe1e74"],["node_modules/lit-html/src/lib/until.ts","944db08f31d7432fbcf8ed68f03200c6"],["node_modules/lit-html/src/lit-html.ts","8ad05506d52ead55061041818604e109"],["node_modules/reflect-metadata/AUTHORS.md","4a63d21e30e34edc1a1cbd59103b0159"],["node_modules/reflect-metadata/CopyrightNotice.txt","94afd0276ab6f08eb35fd8aecc17b128"],["node_modules/reflect-metadata/README.md","55cfd7218291e19ca076ad6610af450d"],["node_modules/reflect-metadata/Reflect.d.ts","9b71aac961f0bb2d3487e570fcde60ae"],["node_modules/reflect-metadata/Reflect.js","35c9e8e6d413655a41edb470153affed"],["node_modules/reflect-metadata/Reflect.js.map","ede7f3d9d544a1048db937963f81bcc6"],["node_modules/reflect-metadata/docs/ecmarkup.css","32c4559c0e9f3ef8cdcb2e01c997f70a"],["node_modules/reflect-metadata/docs/ecmarkup.js","e2cc43801857f221d48bfb8e8db66afd"],["node_modules/reflect-metadata/docs/index.html","aa41e934acd3a5957b084772330ca76c"],["node_modules/reflect-metadata/docs/spec.biblio.json","1ec9ada12a8f2bbcce03d142f5035931"],["node_modules/reflect-metadata/index.d.ts","b53446c42544c01686ed955e1ad02d7c"],["node_modules/reflect-metadata/package.json","178d77e615b96ba5848d24a34cf6ef92"],["node_modules/reflect-metadata/reflect-metadata.d.ts","0da24240a4d19ed6c86bdb28872ab5b9"],["node_modules/reflect-metadata/standalone.d.ts","14014069528e000a632c334900a6c51d"],["node_modules/reflect-metadata/typings.d.ts","70e870bcac816043d076d7ae10c5e0e4"],["package-lock.json","7b8b485ebc42ea81d017167184a77c3e"],["package.json","ae5596ed39a7cbf7f974a96589d655fe"],["src/bitwise.ttf","567860c5074f320995d5c58e1b4a3ec7"],["src/main-app.js","a2bef151898e9e59fef934a0a02a4835"],["sw-precache-config.js","cd46ac7aaf8d7b7b0fa8fecabd6c9d1c"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







