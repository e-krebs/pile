app.controller('listController', ['pocketListService', 'snackbar', listController]);

function listController(pocketListService, snackbar) {
  const vm = this;

  if (angular.isUndefined(localStorage.pocket_enabled)) {
    localStorage.pocket_enabled = true;
  }
  if (angular.isUndefined(localStorage.instapaper_enabled)) {
    localStorage.instapaper_enabled = true;
  }

  vm.pocketEnabled = localStorage.pocket_enabled == 'true';
  vm.instapaperEnabled = localStorage.instapaper_enabled == 'true';

  if (vm.pocketEnabled) {
    vm.selectedTab = 'pocket';
  } else if (vm.instapaperEnabled) {
    vm.selectedTab = 'instapaper';
  } else {
    // TODO : better default option then forcing pocket ?
    localStorage.pocket_enabled = true;
    vm.pocketEnabled = true;
    vm.selectedTab = 'pocket';
  }
  
  vm.pocket = pocketListService;
  vm.pocket.init(snackbar);

  vm.openSettings = function () {
    // chrome.tabs.create({url: browser.extension.getURL('settings.html')});
    browser.runtime.openOptionsPage();
  };

}
