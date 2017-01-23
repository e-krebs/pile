app.service('vibrantService', ['$q', 'fileService', VibrantService]); // article object

function VibrantService($q, fileService) {
  return {
    vibrant: vibrant,
    colors: colors
  };

  function vibrant(iconData) {
    const promise = $q.defer();
    if (iconData.icon === null) {
      console.log('no icon in returned data');
      promise.resolve(iconData);
    } else {
      fileService.readJson(`${iconData.hostname}_palette.json`).then(function (res) {
        if (res !== null) {
          iconData.colors = colors(res.primary, res.accent);
          promise.resolve(iconData);
        } else {
          console.log(`there was no vibrant file for ${iconData.hostname}, iconData.icon beeing : ${iconData.icon}`);
          const img = document.createElement('img');
          img.setAttribute('src', iconData.icon);
          img.addEventListener('load', imageLoaded.bind(null, img, iconData, promise));
        }
      });
    }
    return promise.promise;
  }

  function imageLoaded(img, iconData, promise) {
    let vibrant;
    try {
      vibrant = new Vibrant(img);
    } catch (ex) {
      console.error(`error getting vibrant for ${iconData.hostname}, iconData.icon beeing : ${iconData.icon}`);
      promise.resolve(iconData);
      return;
    }
    console.log(`vibrant : `, vibrant);
    const swatches = vibrant.swatches();
    console.log(`swatches : `, swatches);
    const primaryRgb = getPrimaryRGB(swatches);
    const accentRgb = getAccentRgb(swatches);
    iconData.colors = colors(primaryRgb, accentRgb);
    promise.resolve(iconData);
    fileService.writeJson({ 'primary': primaryRgb, 'accent': accentRgb }, `${iconData.hostname}_palette.json`);
  }

  function colors(primary, accent) {
    return {
      primary: `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.5)`,
      primary_bg: `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.1)`,
      accent: `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, 0.5)`,
      accent_bg: `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, 0.1)`
    };
  }

  function getPrimaryRGB(swatches) {
    let primaryIsVibrant = null;
    if (isNull(swatches.Vibrant) && isNull(swatches.Muted))
      return [0, 0, 0];
    if (!isNull(swatches.Vibrant) && !isNull(swatches.Muted))
      primaryIsVibrant = (swatches.Vibrant.population >= swatches.Muted.population);
    else primaryIsVibrant = !isNull(swatches.Vibrant);
    return primaryIsVibrant ? swatches.Vibrant.getRgb() : swatches.Muted.getRgb();
  }

  function getAccentRgb(swatches) {
    let accentIsVibrant = null;
    if (isNull(swatches.DarkVibrant) && isNull(swatches.DarkMuted))
      return [0, 0, 0];
    if (!isNull(swatches.DarkVibrant) && !isNull(swatches.DarkMuted))
      accentIsVibrant = (swatches.DarkVibrant.population >= swatches.DarkMuted.population);
    else accentIsVibrant = !isNull(swatches.DarkVibrant);
    return accentIsVibrant ? swatches.DarkVibrant.getRgb() : swatches.DarkMuted.getRgb();
  }

  function isNull(object) {
    return angular.isUndefined(object) || object === null;
  }

}