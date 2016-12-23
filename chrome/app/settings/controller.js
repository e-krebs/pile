app.controller('settingsController', ['$location', settingsController]);

function settingsController($location) {
  const vm = this;

  vm.route = function (path) {
    $location.path(path);
  };

  vm.route('/');

}