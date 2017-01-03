app.config(['$locationProvider', '$routeProvider', settingsRouteProvider]);

function settingsRouteProvider($locationProvider, $routeProvider) {

  $locationProvider.hashPrefix('!');

  $routeProvider
    .when("/", {
      templateUrl: "/app/settings/routes/main.html",
      controller: "mainCtrl as vm"
    })
    .when("/main", {
      templateUrl: "/app/settings/routes/main.html",
      controller: "mainCtrl as vm"
    })
    .when("/pocket", {
      templateUrl: "/app/settings/routes/pocket.html",
      controller: "pocketSettingsCtrl as vm"
    });
}