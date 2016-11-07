# Pile

> pile is a material design-ish chrome extension that show your [pocket](https://getpocket.com) list

![example](img/pile.png)

> the icons color are dynamicaly computed thx to the [`vibrant.js`][1] library
>
> /!\ it is working, however, it is still a work in progress /!\


## Install

### From the chrome web store

[install from the chrome web store](https://chrome.google.com/webstore/detail/injagampgkalbbmhpemnfknoeghfenif)

### Your own version

In order to have your own version, you must "create a new app" in the [pocket developer API](https://getpocket.com/developer/apps/).

Then, add the consumer key provided by pocket in the `/chrome/app/config.js` file by replacing the `XXXXX-XXXXXXXXXXX` chain.

Finally, import the `/chrome` folder into `chrome://extensions` in your browser


## Libraries

- [angular.js (1.5.8)](https://github.com/angular/angular.js)
- [vibrant.js (1.0)][1]
- [material design icons (3.0.1)](https://github.com/google/material-design-icons)
- [material design icons iconfont (3.0.2)](https://github.com/jossef/material-design-icons-iconfont)

[1]: https://github.com/jariz/vibrant.js