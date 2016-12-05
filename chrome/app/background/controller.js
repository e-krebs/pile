app.controller('backgroundController', ['$q', 'commonService', 'pocketOAuthService', 'fileService', 'articleService', backgroundController]);

function backgroundController($q, commonService, pocketOAuth, fileService, articleService) {

  // refresh the list
  function refreshPocketList() {
    pocketOAuth.requestList().then(commonService.checkStatus).then(function (response) {
      const promiseArray = [];
      for (const index in response.data.list) {
        promiseArray.push(articleService.article(response.data.list[index]).promise);
      }
      console.log(`pocket response : ${response.statusText}`);
      $q.all(promiseArray).then(function (dataArray) {
        console.log(`saving dataArray, length ${dataArray.length}`);
        fileService.writeJson(dataArray, 'pocketArticles.json');
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 150] });
        if (dataArray.length > 0) {
          chrome.browserAction.setBadgeText({ text: dataArray.length.toString() });
        } else {
          chrome.browserAction.setBadgeText({ text: '-' });
        }
      });
    });
  }

  // on alarm triggering
  chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == "pocket_refresh") {
      if (angular.isUndefined(localStorage.pocket_code) || angular.isUndefined(localStorage.pocket_token)) {
        console.warn(`no token : pocket_code = ${localStorage.pocket_code}, pocket_token = ${localStorage.pocket_token}`);
      } else {
        console.info('refreshing list');
        refreshPocketList();
      }
    } else {
      console.warn('alarm', date(), alarm);
    }
  });

  // create the alarm
  chrome.alarms.create("pocket_refresh", { periodInMinutes: 10 });
  console.info('pocket_refresh alarm set');

  //trigger it at launch
  refreshPocketList();
}