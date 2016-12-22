app.controller('settingsController', ['$location', settingsController]);

function settingsController($location) {
  const vm = this;

  vm.route = function (path) {
    $location.path(path);
  };

  vm.route('/');

}

app.controller('mainCtrl', ['$scope', mainCtrl]);

function mainCtrl($scope) {
  $scope.message = "main controller working!"
};


app.controller('pocketSettingsCtrl', ['$scope', pocketSettingsCtrl]);

function pocketSettingsCtrl($scope) {
  $scope.message = "pocket controller working!"
};
