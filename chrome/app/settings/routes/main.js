app.controller('mainCtrl', ['$scope', mainCtrl]);

function mainCtrl($scope) {
  const vm = this;

  if (angular.isUndefined(localStorage.alarmPeriod)) {
    localStorage.alarmPeriod = 10;
  }
  if (angular.isUndefined(localStorage.pocket_enabled)) {
    localStorage.pocket_enabled = true;
  }
  if (angular.isUndefined(localStorage.instapaper_enabled)) {
    localStorage.instapaper_enabled = true;
  }

  vm.alarmPeriod = Number.parseInt(localStorage.alarmPeriod);
  vm.pocketEnabled = localStorage.pocket_enabled == 'true';
  vm.instapaperEnabled = localStorage.instapaper_enabled == 'true';

  vm.saveAlarm = function() {
    localStorage.alarmPeriod = vm.alarmPeriod;
    chrome.alarms.create("pocket_refresh", { periodInMinutes: vm.alarmPeriod });
    console.info(`pocket_refresh alarm set to ${vm.alarmPeriod} minutes`);
  };

  vm.pocketEnable = () => {
    localStorage.pocket_enabled = vm.pocketEnabled;
    $scope.$parent.vm.refresh();
  };
  
  vm.instapaperEnable = () => {
    localStorage.instapaper_enabled = vm.instapaperEnabled
    $scope.$parent.vm.refresh();
  };
}