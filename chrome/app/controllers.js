app.controller('listController', ['$scope', '$q', 'pocketOAuthService', 'fileService', 'articleObject', 'redirect_uri', listController]);

function listController($scope, $q, oAuthService, fileService, articleObject, redirect_uri) {
	$scope.requestToken = function() {
		oAuthService.requestCode().then(function(response) {
			if (response.status == 200) {
				var pocket_token = response.data.code;
				//console.log(response.statusText, pocket_token);
				localStorage.pocket_code = pocket_token;
				var url = `https://getpocket.com/auth/authorize?request_token=${pocket_token}&redirect_uri=${redirect_uri}`;
				//console.log('redirect url:', url);
				chrome.tabs.create({url: url});
			} else {
				console.error('error requesting the code', response);
			}
		});
	};

	$scope.requestList = function() {
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
		
		oAuthService.requestList().then(function(response) {
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
	
	var updateBadge = function() {
		//console.log('updateBadge:', $scope.articles.length);
		chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 150]});
		if ($scope.articles.length > 0) {
			chrome.browserAction.setBadgeText({text: $scope.articles.length.toString()});
		} else {
			chrome.browserAction.setBadgeText({text: '-'});
		}
	};
	
	$scope.archive = function(item_id) {
		oAuthService.archive(item_id).then(function(response) {
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
		oAuthService.delete(item_id).then(function (response) {
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
		oAuthService.favorite(item_id).then(function (response) {
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
		oAuthService.unfavorite(item_id).then(function (response) {
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
	
	function removeFromList(item_id) {
        var item = $scope.articles.filter(x => x.id == item_id)[0];
		$scope.articles.splice($scope.articles.indexOf(item), 1);
		fileService.writeJson(angular.copy($scope.articles), 'articles.json'); // update json backup					
		updateBadge();
		console.info("article remove from list correctly", item_id);
	}

	$scope.articles = null;

	if (typeof(localStorage.pocket_code) == 'undefined' || typeof(localStorage.pocket_token) == 'undefined') {
		console.info('requesting token');
		$scope.requestToken();
	} else if($scope.articles === null) {
		console.info('requesting list');
		$scope.requestList();
	} else {
		console.info('wtf ?!', localStorage, $scope.articles);
	}
}
