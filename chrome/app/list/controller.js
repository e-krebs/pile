app.controller('listController', ['$scope', '$q', 'pocketOAuthService', 'fileService', 'articleObject', 'redirect_uri', listController]);

function listController($scope, $q, pocketOAuth, fileService, articleObject, redirect_uri) {

	function requestList() {
		$scope.articles = [];
		
		fileService.readJson('articles.json').then(function(result) {
			if (result === null) result = [];
			//window.articles = result;
			//console.log('json file length:', result.length);
			if ($scope.articles.length === 0) {
				$scope.articles = result;
				console.log('articles from local backup');
			} else {
				console.log('articles.json came too late', result);
			}
		});
		
		pocketOAuth.requestList().then(function(response) {
			if (response.status == 200) {
				var promiseArray = [];
				for (var index in response.data.list) {
					promiseArray.push(articleObject.article(response.data.list[index]).promise);
				}
				console.log('pocket response', response.statusText); 
				$q.all(promiseArray).then(function(dataArray) {
					$scope.articles = dataArray;
					console.log('saving dataArray, length:', dataArray.length);
					fileService.writeJson(dataArray, 'articles.json');
					updateBadge();
				});
			} else {
				console.error('error requesting the code', response);
			}
		});
	};
	
	function updateBadge() {
		chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 150]});
		if ($scope.articles.length > 0) {
			chrome.browserAction.setBadgeText({text: $scope.articles.length.toString()});
		} else {
			chrome.browserAction.setBadgeText({text: '-'});
		}
	};
	
	function removeFromList(item_id) {
        var item = $scope.articles.filter(x => x.id == item_id)[0];
		$scope.articles.splice($scope.articles.indexOf(item), 1);
		fileService.writeJson(angular.copy($scope.articles), 'articles.json'); // update json backup					
		updateBadge();
		console.info("article remove from list correctly", item_id);
	}
	
	$scope.archive = function(item_id) {
		pocketOAuth.archive(item_id).then(function(response) {
			//console.log(response);
			if (response.status == 200) {
				if (response.data.status == 1) {
					removeFromList(item_id);
				} else {
					console.error('error archiving', item_id, response.data.action_failures);					
				}
			} else {
				console.error('error archiving', item_id, response.data.status);
			}
		});
	};
	
	$scope.delete = function (item_id) {
		pocketOAuth.delete(item_id).then(function (response) {
			//console.log(response);
			if (response.status == 200) {
				if (response.data.status == 1) {
					removeFromList(item_id);
				} else {
					console.error('error deleting', item_id, response.data.action_failures);
				}
			} else {
				console.error('error deleting', item_id, response.data.status);
			}
		});
	};
	
	$scope.favorite = function (item_id) {
		pocketOAuth.favorite(item_id).then(function (response) {
			//console.log(response);
			if (response.status == 200) {
				if (response.data.status == 1) {
					$scope.articles.filter(x => x.id == item_id).forEach(x => x.favorite = true);
					fileService.writeJson(angular.copy($scope.articles), 'articles.json'); // update json backup					
					console.info("article favorited correctly", item_id);
				} else {
					console.error('error favoriting', item_id, response.data.action_failures);
				}
			} else {
				console.error('error favoriting', item_id, response.data.status);
			}
		});
	};
	
	$scope.unfavorite = function (item_id) {
		pocketOAuth.unfavorite(item_id).then(function (response) {
			//console.log(response);
			if (response.status == 200) {
				if (response.data.status == 1) {
					$scope.articles.filter(x => x.id == item_id).forEach(x => x.favorite = false);
					fileService.writeJson(angular.copy($scope.articles), 'articles.json'); // update json backup					
					console.info("article unfavorited correctly", item_id);
				} else {
					console.error('error unfavoriting', item_id, response.data.action_failures);
				}
			} else {
				console.error('error unfavoriting', item_id, response.data.status);
			}
		});
	};
    
	$scope.expand = function (item_id) {
		$scope.articles.filter(x => x.id != item_id).forEach(x => x.expanded = false);
		$scope.articles.filter(x => x.id == item_id).forEach(x => x.expanded = !x.expanded);
	};

	$scope.pocketConnect = function () {
		pocketOAuth.requestCode().then(function(response) {
			if (response.status == 200) {
				var pocket_token = response.data.code;
				localStorage.pocket_code = pocket_token;
				var url = `https://getpocket.com/auth/authorize?request_token=${pocket_token}&redirect_uri=${redirect_uri}`;
				chrome.tabs.create({url: url});
			} else {
				console.error('error requesting the code', response);
			}
		});
	}

// initializing	
	$scope.articles = null;
	$scope.isPocketConnected = true;
	
	if (angular.isUndefined(localStorage.pocket_code) || angular.isUndefined(localStorage.pocket_token)) {
		console.info('pocket not connected');
		$scope.isPocketConnected = false;
	} else if($scope.articles === null) {
		console.info('requesting list');
		requestList();
	} else {
		console.info('wtf ?!', localStorage, $scope.articles);
	}
}
