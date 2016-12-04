app.factory('pocketListService', ['$q', 'commonService', 'pocketOAuthService', 'fileService', 'articleObject', 'redirect_uri', pocketListService]);

function pocketListService($q, commonService, pocketOAuth, fileService, articleObject, redirect_uri) {
  const vm = {};

  return vm.pocket = {
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
  }

  function init() {
    if (angular.isUndefined(localStorage.pocket_code) || angular.isUndefined(localStorage.pocket_token)) {
      console.info('pocket not connected');
      vm.pocket.connected = false;
    } else {
      console.info('requesting list');
      vm.pocket.connected = true;
      vm.pocket.request();
    }
  }

  function pocketRequest() {
    vm.pocket.articles = [];

    fileService.readJson('pocketArticles.json').then(function (result) {
      if (result === null) result = [];
      if (vm.pocket.articles.length === 0) {
        vm.pocket.articles = result;
        console.log('pocket articles from local backup');
      } else {
        console.log('pocketArticles.json came too late', result);
      }
    });

    pocketOAuth.requestList().then(function (response) {
      if (response.status == 200) {
        const promiseArray = [];
        for (const index in response.data.list) {
          promiseArray.push(articleObject.article(response.data.list[index]).promise);
        }
        console.log('pocket response', response.statusText);
        $q.all(promiseArray).then(function (dataArray) {
          vm.pocket.articles = dataArray;
          console.log('saving dataArray, length:', dataArray.length);
          fileService.writeJson(dataArray, 'pocketArticles.json');
          commonService.serviceLists['pocket'] = vm.pocket.articles.length;
          commonService.updateBadge();
        });
      } else {
        console.error('error requesting the code', response);
      }
    });
  }

  function pocketArchive(item_id) {
    pocketOAuth.archive(item_id).then(function (response) {
      //console.log(response);
      if (response.status == 200) {
        if (response.data.status == 1) {
          removeFromList(item_id);
        } else {
          console.error('error archiving', item_id, response.data.action_failures);
        }
      } else {
        console.error('error archiving', item_id, response.data.status);
      }
    });
  }

  function pocketDelete(item_id) {
    pocketOAuth.delete(item_id).then(function (response) {
      //console.log(response);
      if (response.status == 200) {
        if (response.data.status == 1) {
          removeFromList(item_id);
        } else {
          console.error('error deleting', item_id, response.data.action_failures);
        }
      } else {
        console.error('error deleting', item_id, response.data.status);
      }
    });
  }

  function pocketFavorite(item_id) {
    pocketOAuth.favorite(item_id).then(function (response) {
      //console.log(response);
      if (response.status == 200) {
        if (response.data.status == 1) {
          vm.pocket.articles.filter(x => x.id == item_id).forEach(x => x.favorite = true);
          fileService.writeJson(angular.copy(vm.pocket.articles), 'pocketArticles.json'); // update json backup					
          console.info("article favorited correctly", item_id);
        } else {
          console.error('error favoriting', item_id, response.data.action_failures);
        }
      } else {
        console.error('error favoriting', item_id, response.data.status);
      }
    });
  }

  function pocketUnfavorite(item_id) {
    pocketOAuth.unfavorite(item_id).then(function (response) {
      //console.log(response);
      if (response.status == 200) {
        if (response.data.status == 1) {
          vm.pocket.articles.filter(x => x.id == item_id).forEach(x => x.favorite = false);
          fileService.writeJson(angular.copy(vm.pocket.articles), 'pocketArticles.json'); // update json backup					
          console.info("article unfavorited correctly", item_id);
        } else {
          console.error('error unfavoriting', item_id, response.data.action_failures);
        }
      } else {
        console.error('error unfavoriting', item_id, response.data.status);
      }
    });
  }

  function pocketExpand(item_id) {
    vm.pocket.articles.filter(x => x.id != item_id).forEach(x => x.expanded = false);
    vm.pocket.articles.filter(x => x.id == item_id).forEach(x => x.expanded = !x.expanded);
  }

  function pocketConnect() {
    pocketOAuth.requestCode().then(function (response) {
      if (response.status == 200) {
        const pocket_token = response.data.code;
        localStorage.pocket_code = pocket_token;
        const url = `https://getpocket.com/auth/authorize?request_token=${pocket_token}&redirect_uri=${redirect_uri}`;
        chrome.tabs.create({ url: url });
      } else {
        console.error('error requesting the code', response);
      }
    });
  }

  function removeFromList(item_id) {
    const item = vm.pocket.articles.filter(x => x.id == item_id)[0];
    vm.pocket.articles.splice(vm.pocket.articles.indexOf(item), 1);
    fileService.writeJson(angular.copy(vm.pocket.articles), 'pocketArticles.json'); // update json backup
    commonService.serviceLists['pocket'] = vm.pocket.articles.length;
    commonService.updateBadge();
    console.info("article remove from list correctly", item_id);
  }

}