app.controller('oauthController', ['$scope', 'pocketOAuthService', oauthController]);

function oauthController($scope, pocketOAuth) {
  $scope.pocketAuth_failed = false;
  $scope.pocketAuth_success = false;
  $scope.pocketAuth_inprogress = false;

  function pocketAuth() {
    $scope.pocketAuth_inprogress = true;

    pocketOAuth.requestToken().then(function (response) {
      if (response.status == 200) {
        localStorage.pocket_token = response.data.access_token;
        localStorage.pocket_username = response.data.username;
        $scope.pocketAuth_success = true;
      } else {
        $scope.pocketAuth_failed = true;
      }
      $scope.pocketAuth_inprogress = false;
    });
  };

  if (angular.isUndefined(localStorage.pocket_code) || angular.isUndefined(localStorage.pocket_token)) {
    pocketAuth();
  } else {
    $scope.pocketAuth_success = true;
    $scope.pocketAuth_inprogress = false;
  }
}
