app.controller('instapaperSettingsCtrl', [/*'instapaperListService',*/ instapaperSettingsCtrl]);

function instapaperSettingsCtrl(/*instapaperListService*/) {
  const vm = this;

  // vm.instapaper = instapaperListService;
  
  vm.instapaperConnected = angular.isDefined(localStorage.instapaper_code) &&
    angular.isDefined(localStorage.instapaper_token);
}