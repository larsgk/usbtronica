# usBTronica 

A simple sampler built with lit-html & lit-element

Utilizing:

* WebAudio (recording and playback)
* WebMIDI (controller)
* WebUSB (empiriKit, controller)
* WebBluetooth (Thingy:52, controller)

## Features

* Desktop and Mobile support
* PWA
* Visual trimming/filtering of recordings
* Storing/Loading sounds (indexeddb)
* Simple UI for configuring external controllers
* Using device sensors & touch when no external controllers available
* Dynamically tie controllers to actions (midi, variable, binary)


## References/inspiration

* https://www.sitepoint.com/using-fourier-transforms-web-audio-api/
* http://www.softsynth.com/webaudio/gainramp.php
* http://blog.chrislowis.co.uk/2013/06/10/playing-multiple-notes-web-audio-api.html
* https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-audio-midi-envelope-generator/
* https://codepen.io/skoyah/pen/dePEGJ
* http://jsbin.com/lenapigo/1/edit?html,css,js,output ( progress/seek in audio )
* https://developers.google.com/web/updates/2014/07/Blob-support-for-IndexedDB-landed-on-Chrome-Dev
* https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect-async-await.html


## Thoughts

* Should modules (~ drivers) output midi signals to the main app? 
* Previously known usb and ble devices should regain same config (if there are no conflicts)
* Could have an 80s style: http://www.color-hex.com/color-palette/28164
* Use easing curve from material design: https://material.io/design/motion/speed.html#easing 

