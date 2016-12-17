app.controller('listController', ['pocketListService', 'snackbar', listController]);

function listController(pocketListService, snackbar) {
  const vm = this;

  vm.pocket = pocketListService;
  vm.pocket.init(snackbar);

  vm.openSettings = function () {
    browser.runtime.openOptionsPage();
  }

}
