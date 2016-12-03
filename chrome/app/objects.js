app.service('articleObject', ['$q', '$http', 'fileService', ArticleObject]); // article object

function ArticleObject($q, $http, fileService) {
	return { article: article };
	
	function article(data) {
		const promise = $q.defer();
		const url = data.resolved_url && data.resolved_url !== null && data.resolved_url !== '' ? data.resolved_url : data.given_url;
		const articleData = {
			id: data.item_id,
			order: data.sort_id,
			title: data.resolved_title && data.resolved_title !== null && data.resolved_title !== '' ? data.resolved_title : (data.given_title && data.given_title !== null && data.given_title !== '') ? data.given_title : url,
			url: url,
			hostname: new URL(url).hostname,
			favorite: (data.favorite == 1)
		};
		icon(articleData.hostname).then(vibrant).then(function(iconData) {
			articleData.icon = iconData.icon;
			articleData.colors = iconData.colors;
			const result = Object.assign(Object.create({
				id: null, order: null, title: null, url: null, hostname: null, icon: null, colors: colors([0, 0, 0], [0, 0, 0])
			}), articleData);
			promise.resolve(result);
		});
		return promise;
	}
	
	function vibrant(iconData) {
		const promise = $q.defer();
		if (iconData.icon === null) {
			console.log('no icon in returned data');
			promise.resolve(iconData);
		} else {
			fileService.readJson(`${iconData.hostname}_palette.json`).then(function(res) {
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
		} catch(ex) {
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
		fileService.writeJson({'primary': primaryRgb, 'accent': accentRgb}, `${iconData.hostname}_palette.json`);
	}

	function getPrimaryRGB(swatches) {
		let primaryIsVibrant = null;
		if (!isNull(swatches.Vibrant) && !isNull(swatches.Muted)) primaryIsVibrant = (swatches.Vibrant.population >= swatches.Muted.population);
        else primaryIsVibrant = (!isNull(swatches.Vibrant) || isNull(swatches.Muted));
		return (isNull(primaryIsVibrant) || (isNull(swatches.Vibrant) && isNull(swatches.Muted))) ? [0, 0, 0] : (primaryIsVibrant ? swatches.Vibrant.getRgb() : swatches.Muted.getRgb());
	}

	function getAccentRgb(swatches) {
		let accentIsVibrant = null;
		if (!isNull(swatches.DarkVibrant) && !isNull(swatches.DarkMuted)) accentIsVibrant = (swatches.DarkVibrant.population >= swatches.DarkMuted.population);
        else accentIsVibrant = (!isNull(swatches.DarkVibrant) || isNull(swatches.DarkMuted));
		return (isNull(accentIsVibrant) || (isNull(swatches.DarkVibrant) && !isNull(swatches.DarkMuted))) ? [0, 0, 0] : (accentIsVibrant ? swatches.DarkVibrant.getRgb() : swatches.DarkMuted.getRgb());
	}

	function isNull(object) {
		return angular.isUndefined(object) || object === null;
	}
	
	function getIcon(iconUrl, res) {
		const defer = $q.defer();
		if (!isNull(res) && res.hostname !== null && res.icon !== null) {
			defer.resolve(res);
		} else {
			console.log('getIcon', res.hostname, iconUrl, res);
			$http.get(iconUrl)
				.success(function() {
					$http.get(iconUrl, { responseType: 'blob' })
						.success(function(blob) {
							if (blob.size > 0) {
								blob.name = res.hostname + '.png';
								fileService.writeFile(blob).then(function(result) {
									console.info(`icon OK from ${iconUrl} for ${res.hostname}`);
									res.icon = result;
									return defer.resolve(res);
								});
							} else {
								console.warn(`size 0 file got from ${iconUrl} for ${res.hostname}`);
								return defer.resolve(res);
							}
						})
						.error(function(error) {
							console.warn(`error getting icon blob ${iconUrl} for ${res.hostname}`, error);
							return defer.resolve(res);
						});
					})
				.error(function(error) {
					console.warn(`error testing icon url ${iconUrl} for ${res.hostname}`, error);
					return defer.resolve(res);
				});
		}
		return defer.promise;
	}
	
	function readIconFile(hostname) {
		const defer = $q.defer();
		fileService.readFile(`${hostname}.png`).then(function(res) {
			return defer.resolve({hostname: hostname, icon: res});
		});
		return defer.promise;
	}
	
	function icon(hostname) {
		const getGoogleIcon = getIcon.bind(undefined, `https://www.google.com/s2/favicons?domain=${hostname}&alt=404`);
		const getPocketIcon = getIcon.bind(undefined, `https://img.readitlater.com/i/${hostname}/favicon.ico`);
		const getFallbackIcon = getIcon.bind(undefined, chrome.extension.getURL('content/img/icon_default.png'));
		return readIconFile(hostname).then(getGoogleIcon).then(getPocketIcon).then(getFallbackIcon);
	}
	
	function colors(primary, accent) {
		return {
			primary: `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.5)`,
			primary_bg: `rgba(${primary[0]}, ${primary[1]}, ${primary[2]}, 0.1)`,
			accent: `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, 0.5)`,
			accent_bg: `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, 0.1)`
		};
	}
}
