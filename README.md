# Pile

> pile is a material design-ish chrome extension that show your [pocket](https://getpocket.com) list

![example](img/pile.png)
![example2](img/pile-opened.png)

> the icons color are dynamicaly computed thx to the [`node-vibrant`][1] library
>
> ⚠️ it is working, however, it is still a work in progress ⚠️

# Install
## From the chrome web store

[install from the chrome web store](https://chrome.google.com/webstore/detail/injagampgkalbbmhpemnfknoeghfenif)

## Your own version
First create a copy of `src/env.sample.json` into a new `src/env.json` file.

In order to have your own version, you must "create a new app" in the [pocket developer API](https://getpocket.com/developer/apps/).

Then, add the consumer key provided by pocket in the newly created `src/env.json` file by replacing the `XXXXX-XXXXXXXXXXX` chain.

Then, you either:
- (dev) run `yarn start`
  - then import the `/dist` folder into `chrome://extensions` in your browser
- (prod) run `yarn build`
  - then import the `/dist/webext-prod` folder into `chrome://extensions` in your browser
  - by then running `yarn zip`, you can also generates a `pile.zip` file (in that folder) that you can upload to the chrome web store

# Release
To trigger a release:
- update the version in both `package.json` & `src/manifest.json`
- generate a new tag following the pattern `v*.*.*`
- the **cd** Github action should automagically generate a new release with both changelog and zip file
- you can now upload that zip to the chrome web store, and update the changelog there

# Libraries
This project is built using:
- [typescript](https://www.typescriptlang.org/)
- [react](https://reactjs.org/)
- [tailwindcss](https://tailwindcss.com/)
- [node-vibrant](https://github.com/vibrant-colors/node-vibrant)
- [mui](https://mui.com/)
- [feather icons](https://feathericons.com/)
- [parcel.js](https://parceljs.org/)
- and plenty other tools and libraries that you can find in the **package.json**

[1]: https://github.com/vibrant-colors/node-vibrant