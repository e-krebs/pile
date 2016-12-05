app.service('articleService', ['$q', '$http', 'vibrantService', 'fileService', ArticleService]); // article object

function ArticleService($q, $http, vibrantService, fileService) {
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
		icon(articleData.hostname).then(vibrantService.vibrant).then(function(iconData) {
			articleData.icon = iconData.icon;
			articleData.colors = iconData.colors;
			const result = Object.assign(Object.create({
				id: null, order: null, title: null, url: null, hostname: null, icon: null, colors: vibrantService.colors([0, 0, 0], [0, 0, 0])
			}), articleData);
			promise.resolve(result);
		});
		return promise;
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
		const getFallbackIcon = getIcon.bind(undefined, chrome.extension.getURL('content/img/default-icon.png'));
		return readIconFile(hostname).then(getGoogleIcon).then(getPocketIcon).then(getFallbackIcon);
	}
}
