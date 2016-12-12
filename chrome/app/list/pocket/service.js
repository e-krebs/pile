app.factory('pocketListService', ['$q', 'commonService', 'pocketOAuthService', 'fileService', 'articleService', 'redirect_uri', pocketListService]);

function pocketListService($q, commonService, pocketOAuth, fileService, articleService, redirect_uri) {
  const vm = {
    archive: pocketArchive, // function
    articles: null, // array
    connect: pocketConnect, // function
    connected: null, // boolean
    delete: pocketDelete, // function
    expand: pocketExpand, // function
    favorite: pocketFavorite, // function
    init: init, // init function
    request: pocketRequest, // function
    unfavorite: pocketUnfavorite // function
  };

  return vm;

  function init(snackFn) {
    if (angular.isDefined(snackFn)) vm.snackbar = snackFn;
    vm.connected = angular.isDefined(localStorage.pocket_code) && angular.isDefined(localStorage.pocket_token);
    if (vm.connected) pocketRequest();
  }

  function pocketRequest() {
    vm.articles = [];

    fileService.readJson('pocketArticles.json', []).then(result => { if (vm.articles.length === 0) vm.articles = result; });

    pocketOAuth.requestList().then(commonService.checkStatus).then(function (response) {
      const promiseArray = [];
      for (const index in response.data.list) {
        promiseArray.push(articleService.article(response.data.list[index]).promise);
      }
      $q.all(promiseArray).then(function (dataArray) {
        vm.articles = dataArray;
        fileService.writeJson(dataArray, 'pocketArticles.json');
        commonService.serviceLists.pocket = vm.articles.length;
        commonService.updateBadge();
        showSnack('pocket article list refreshed', 1000);
      });
    });
  }

  function showSnack(message, delay) {
    if (angular.isDefined(vm.snackbar)) {
      if (angular.isDefined(delay)) vm.snackbar.create(message, delay);
      else vm.snackbar.create(message);
    }
  }

  function pocketArchive(item_id) {
    pocketOAuth.archive(item_id)
      .then(response => removeFromList(response, item_id))
      .then(() => showSnack('item archived'));
  }

  function pocketDelete(item_id) {
    pocketOAuth.delete(item_id)
      .then(response => removeFromList(response, item_id))
      .then(() => showSnack('item deleted'));
  }

  function pocketFavorite(item_id) {
    pocketOAuth.favorite(item_id).then(commonService.checkDataStatus).then(() => {
      vm.articles.filter(x => x.id == item_id).forEach(x => x.favorite = true);
      fileService.writeJson(angular.copy(vm.articles), 'pocketArticles.json') // update json backup			
        .then(() => showSnack('item favorited'));		
    });
  }

  function pocketUnfavorite(item_id) {
    pocketOAuth.unfavorite(item_id).then(commonService.checkDataStatus).then(() => {
      vm.articles.filter(x => x.id == item_id).forEach(x => x.favorite = false);
      fileService.writeJson(angular.copy(vm.articles), 'pocketArticles.json') // update json backup
        .then(() => showSnack('item unfavorited'));
    });
  }

  function pocketExpand(item_id) {
    vm.articles.filter(x => x.id != item_id).forEach(x => x.expanded = false);
  }

  function pocketConnect() {
    pocketOAuth.requestCode().then(commonService.checkStatus).then(function (response) {
      localStorage.pocket_code = response.data.code;
      const url = `https://getpocket.com/auth/authorize?request_token=${localStorage.pocket_code}&redirect_uri=${redirect_uri}`;
      chrome.tabs.create({ url: url });
    });
  }

  function removeFromList(response, item_id) {
    commonService.checkDataStatus(response).then(() => {
      const item = vm.articles.filter(x => x.id == item_id)[0];
      vm.articles.splice(vm.articles.indexOf(item), 1);
      fileService.writeJson(angular.copy(vm.articles), 'pocketArticles.json'); // update json backup
      commonService.serviceLists.pocket = vm.articles.length;
      commonService.updateBadge();
    });
  }

}