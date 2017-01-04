app.config(['$locationProvider', '$routeProvider', settingsRouteProvider]);

function settingsRouteProvider($locationProvider, $routeProvider) {

  $locationProvider.hashPrefix('!');

  $routeProvider
    .when("/pocket", {
      templateUrl: "/app/settings/routes/pocket.html",
      controller: "pocketSettingsCtrl as vm"
    })
    .when("/instapaper", {
      templateUrl: "/app/settings/routes/instapaper.html",
      controller: "instapaperSettingsCtrl as vm"
    })
    .otherwise({
      templateUrl: "/app/settings/routes/main.html",
      controller: "mainCtrl as vm"
    });
}