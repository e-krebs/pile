app.controller('oauthController', ['$scope', 'pocketOAuthService', oauthController]);

function oauthController($scope, pocketOAuth) {
	$scope.accessToken = function() {
		$scope.auth_failed = false;
		$scope.auth_success = false;
		
		pocketOAuth.requestToken().then(function(response) {
			if (response.status == 200) {
				//console.log(response.statusText, response.data);
				localStorage.pocket_token = response.data.access_token;
				localStorage.pocket_username = response.data.username;
				$scope.auth_success = true;
				//console.log($scope.auth_success, $scope.auth_failed);
			} else {
				//console.error('error requesting the token', response);
				$scope.auth_failed = true;
				//console.log($scope.auth_success, $scope.auth_failed);
			}
		});
	};

	if (angular.isUndefined(localStorage.pocket_code) || angular.isUndefined(localStorage.pocket_token)) {
		$scope.accessToken();
	}
}
