app.controller('listController', ['pocketListService', listController]);

function listController(pocketListService) {
  const vm = this;

  vm.pocket = pocketListService;
  vm.pocket.init();

}
