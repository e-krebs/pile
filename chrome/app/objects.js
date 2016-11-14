app.service('articleObject', ['$q', '$http', 'fileService', ArticleObject]); // article object

function ArticleObject($q, $http, fileService) {
	var articleSchema = {
		id: null,
		order: null,
		title: null,
		url: null,
		hostname: null,
		icon: null,
		colors: {
			vibrant_bg: null,
			vibrant: null,
			muted: null,
			muted_bg: null
		}
	};
	
	return {
		article: article
	};
	
	function article(data) {
		var promise = $q.defer();
		
		var url = data.given_url && data.given_url !== null && data.given_url !== '' ? data.given_url : data.resolved_url;
		var hostname = new URL(url).hostname;
		
		var articleData = {
			id: data.item_id,
			order: data.sort_id,
			title: data.given_title && data.given_title !== null && data.given_title !== '' ? data.given_title : (data.resolved_title && data.resolved_title !== null && data.resolved_title !== '') ? data.resolved_title : url,
			url: url,
			hostname: hostname,
			favorite: (data.favorite == 1)
		};
		
		icon(hostname).then(vibrant).then(function(iconData) {
			articleData.icon = iconData.icon;
			articleData.colors = iconData.colors;
			var result = Object.assign(Object.create(articleSchema), articleData);
			promise.resolve(result);
		});
		
		return promise;
	}
	
	function vibrant(iconData) {
		var promise = $q.defer();
		
		if (iconData.icon === null) {
			console.log('no icon in returned data');
			iconData.colors = {
				primary: 'rgba(0, 0, 0, 0.5)',
				primary_bg: 'rgba(0, 0, 0, 0.1)',
				accent: 'rgba(0, 0, 0, 0.5)',
				accent_bg: 'rgba(0, 0, 0, 0.1)',
			};
			promise.resolve(iconData);
		} else {
			fileService.readJson(`${iconData.hostname}_palette.json`).then(function(res) {
				if (res !== null) {
					iconData.colors = {
						primary: `rgba(${res.primary[0]}, ${res.primary[1]}, ${res.primary[2]}, 0.5)`,
						primary_bg: `rgba(${res.primary[0]}, ${res.primary[1]}, ${res.primary[2]}, 0.1)`,
						accent: `rgba(${res.accent[0]}, ${res.accent[1]}, ${res.accent[2]}, 0.5)`,
						accent_bg: `rgba(${res.accent[0]}, ${res.accent[1]}, ${res.accent[2]}, 0.1)`,
					};
					promise.resolve(iconData);
				} else {
					console.log(`there was no vibrant file for ${iconData.hostname}, iconData.icon beeing : ${iconData.icon}`);
					var img = document.createElement('img');
					img.setAttribute('src', iconData.icon);
					img.addEventListener('load', imageLoaded.bind(null, img, iconData, promise));
				}
			});
		}
		return promise.promise;
	}

	function imageLoaded(img, iconData, promise) {
		console.log(`getting vibrant`);
		var vibrant;
		try {
			vibrant = new Vibrant(img);
		} catch(ex) {
			console.error(`error getting vibrant for ${iconData.hostname}, iconData.icon beeing : ${iconData.icon}`);
			iconData.colors = {
				primary: 'rgba(0, 0, 0, 0.5)',
				primary_bg: 'rgba(0, 0, 0, 0.1)',
				accent: 'rgba(0, 0, 0, 0.5)',
				accent_bg: 'rgba(0, 0, 0, 0.1)',
			};
			promise.resolve(iconData);
			return;
		}
		console.log(`vibrant : `, vibrant);
		console.log(`getting swatches...`);
		var swatches = vibrant.swatches();
		console.log(`swatches : `, swatches);
		var primaryIsVibrant = null;
		if (!isNull(swatches.Vibrant) && !isNull(swatches.Muted)) primaryIsVibrant = (swatches.Vibrant.population >= swatches.Muted.population);
		else primaryIsVibrant = (!isNull(swatches.Vibrant) || isNull(swatches.Muted));
		
		var primaryRgb = [0, 0, 0];
		if (!isNull(primaryIsVibrant) && (!isNull(swatches.Vibrant) || !isNull(swatches.Muted))) {
			primaryRgb = (primaryIsVibrant ? swatches.Vibrant.getRgb() : swatches.Muted.getRgb());
		}
		
		var accentIsVibrant = null;
		if (!isNull(swatches.DarkVibrant) && !isNull(swatches.DarkMuted)) accentIsVibrant = (swatches.DarkVibrant.population >= swatches.DarkMuted.population);
		else accentIsVibrant = (!isNull(swatches.DarkVibrant) || isNull(swatches.DarkMuted));

		var accentRgb = [0, 0, 0];
		if (accentIsVibrant && (!isNull(swatches.DarkVibrant) || !isNull(swatches.DarkMuted))) {
			accentRgb = (accentIsVibrant ? swatches.DarkVibrant.getRgb() : swatches.DarkMuted.getRgb());							
		}
		
		iconData.colors = {
			primary: `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.5)`,
			primary_bg: `rgba(${primaryRgb[0]}, ${primaryRgb[1]}, ${primaryRgb[2]}, 0.1)`,
			accent: `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, 0.5)`,
			accent_bg: `rgba(${accentRgb[0]}, ${accentRgb[1]}, ${accentRgb[2]}, 0.1)`,
		};
		
		promise.resolve(iconData);
		fileService.writeJson({'primary': primaryRgb, 'accent': accentRgb}, `${iconData.hostname}_palette.json`);
	}

	function isNull(object) {
		return typeof object == typeof undefined || object === null;
	}
	
	function getIcon(iconUrl, res) {
		var defer = $q.defer();
		if (typeof(res) != 'undefined' && res !== null && res.hostname !== null && res.icon !== null) {
			//console.log('getIcon already there', hostname, iconUrl);
			defer.resolve(res);
		} else {
			//var hostname = res[0];
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
		var defer = $q.defer();
		fileService.readFile(`${hostname}.png`).then(function(res) {
			return defer.resolve({hostname: hostname, icon: res});
		});
		return defer.promise;
	}
	
	function icon(hostname) {
		var getGoogleIcon = getIcon.bind(undefined, `http://www.google.com/s2/favicons?domain=${hostname}&alt=404`);
		var getPocketIcon = getIcon.bind(undefined, `https://img.readitlater.com/i/${hostname}/favicon.ico`);
		var getFallbackIcon = getIcon.bind(undefined, chrome.extension.getURL('content/img/icon_default.png'));
		return readIconFile(hostname)
			.then(getGoogleIcon)
			.then(getPocketIcon)
			.then(getFallbackIcon);
	}
}
