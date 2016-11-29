app.controller('backgroundController', ['$scope', '$q', 'pocketOAuthService', 'fileService', 'articleObject', 'redirect_uri', backgroundController]);

function backgroundController($scope, $q, oAuthService, fileService, articleObject, redirect_uri) {
	
	// refresh the list
	$scope.refreshList = function() {
		oAuthService.requestList().then(function(response) {
			if (response.status == 200) {
				var promiseArray = [];
				for (var index in response.data.list) {
					promiseArray.push(articleObject.article(response.data.list[index]).promise);
				}
				console.log(`pocket response : ${response.statusText}`); 
				$q.all(promiseArray).then(function(dataArray) {
					console.log(`saving dataArray, length ${dataArray.length}`);
					fileService.writeJson(dataArray, 'articles.json');
					chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 150] });
					if (dataArray.length > 0) {
						chrome.browserAction.setBadgeText({text: dataArray.length.toString()});
					} else {
						chrome.browserAction.setBadgeText({text: '-'});
					}
				});
			} else {
				console.error('error requesting the code', response);
			}
		});
	};
	
	// on alarm triggering
	chrome.alarms.onAlarm.addListener(function(alarm) {
		if (alarm.name == "pocket_refresh") {
			if (typeof(localStorage.pocket_code) == 'undefined' || typeof(localStorage.pocket_token) == 'undefined') {
				console.warn(`no token : pocket_code = ${localStorage.pocket_code}, pocket_token = ${localStorage.pocket_token}`);
			} else {
				console.info('refreshing list');
				$scope.refreshList();
			}
		} else {
			console.warn('alarm', date(), alarm);		
		}
	});
	
	// create the alarm
	chrome.alarms.create("pocket_refresh", { periodInMinutes: 10 });
	console.info('pocket_refresh alarm set');
	
	//trigger it at launch
	$scope.refreshList();
}