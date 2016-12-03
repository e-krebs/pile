app.controller('oauthController', ['pocketOAuthService', oauthController]);

function oauthController(pocketOAuth) {
  const vm = this;
  vm.pocketAuth = {
    failed:     false,
    success:    false,
    inprogress: false
  };

  function pocketAuth() {
    vm.pocketAuth.inprogress = true;

    pocketOAuth.requestToken().then(function (response) {
      if (response.status == 200) {
        localStorage.pocket_token = response.data.access_token;
        localStorage.pocket_username = response.data.username;
        vm.pocketAuth.success = true;
      } else {
        vm.pocketAuth.failed = true;
      }
      vm.pocketAuth.inprogress = false;
    });
  };

  if (angular.isUndefined(localStorage.pocket_code) || angular.isUndefined(localStorage.pocket_token)) {
    pocketAuth();
  } else {
    vm.pocketAuth.success = true;
    vm.pocketAuth.inprogress = false;
  }
}
