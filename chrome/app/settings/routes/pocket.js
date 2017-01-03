app.controller('pocketSettingsCtrl', ['pocketListService', pocketSettingsCtrl]);

function pocketSettingsCtrl(pocketListService) {
  const vm = this;

  vm.pocket = pocketListService;
  
  vm.pocketConnected = angular.isDefined(localStorage.pocket_code)
    && angular.isDefined(localStorage.pocket_token);

};