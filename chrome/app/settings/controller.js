app.controller('settingsController', ['$location', settingsController]);

function settingsController($location) {
  const vm = this;

  if (angular.isUndefined(localStorage.pocket_enabled)) {
    localStorage.pocket_enabled = true;
  }
  if (angular.isUndefined(localStorage.instapaper_enabled)) {
    localStorage.instapaper_enabled = true;
  }
  
  vm.route = function (path) {
    $location.path(path);
  };

  vm.refresh = function () {
    vm.pocketEnabled = localStorage.pocket_enabled == 'true';
    vm.instapaperEnabled = localStorage.instapaper_enabled == 'true';
  }

  vm.route('/');
  vm.refresh();

}