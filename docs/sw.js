/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

workbox.core.skipWaiting();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/audio/Nathalia1.ogg",
    "revision": "4d05ec40ede4b5c66c3c38482a846603"
  },
  {
    "url": "assets/audio/piano_c.ogg",
    "revision": "7f104724f52afa87b8b731b386e810ee"
  },
  {
    "url": "assets/audio/test.ogg",
    "revision": "3b1e93b039c0cd6dfa1d647ae47fae94"
  },
  {
    "url": "assets/audio/test1.ogg",
    "revision": "22f2704f1a486bc5c92d0dbcd894d62a"
  },
  {
    "url": "assets/fonts/bitwise.ttf",
    "revision": "567860c5074f320995d5c58e1b4a3ec7"
  },
  {
    "url": "assets/fonts/fonts.css",
    "revision": "7dc1d34ae8185e51d9de9cd0e1c4d558"
  },
  {
    "url": "assets/images/manifest/icon-144x144.png",
    "revision": "759ea4d0c7ae5b0d1ec4e72e145d89ba"
  },
  {
    "url": "assets/images/manifest/icon-192x192.png",
    "revision": "3bd35144943dee0804cd85cbeeecd29f"
  },
  {
    "url": "assets/images/manifest/icon-48x48.png",
    "revision": "27a12fde25cac25db2c12dad4ad3803e"
  },
  {
    "url": "assets/images/manifest/icon-512x512.png",
    "revision": "95b4eecbca20f2d8261f93459b401a5d"
  },
  {
    "url": "assets/images/manifest/icon-72x72.png",
    "revision": "a5e529342c20132e7f90227ac3468626"
  },
  {
    "url": "assets/images/manifest/icon-96x96.png",
    "revision": "77e96451c98469d71a2aebefb5190835"
  },
  {
    "url": "index.html",
    "revision": "87e9cae80867214724f8b82a096f5862"
  },
  {
    "url": "index.js",
    "revision": "7f61a738ccbeb22735227a5d0ca1fcfe"
  },
  {
    "url": "manifest.json",
    "revision": "7eb290335b1bb6205914c3851a1d8e4e"
  },
  {
    "url": "/",
    "revision": "fc7a69e860ea9a0f8195b8c4aa726ae1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  "ignoreURLParametersMatching": [/.*/]
});
