app.factory('httpRequestInterceptor', httpRequestInterceptor)
	.config(httpProvider)
	.config(compileProvider)
	.value('consumer_key', 'XXXXX-XXXXXXXXXXX')
	.value('access_token', localStorage.pocket_token)
	.value('redirect_uri', chrome.extension.getURL('oauth.html'));
	
function httpRequestInterceptor() {
	return {
		request: function (config) {
			config.headers['X-Accept'] = 'application/json';
			return config;
		}
	};
}

function httpProvider($httpProvider) {
	$httpProvider.interceptors.push('httpRequestInterceptor');
}

function compileProvider($compileProvider) {
	var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
	var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1) + '|chrome-extension:' + currentImgSrcSanitizationWhitelist.toString().slice(-1);
		//console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
	$compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
}
