app.factory('commonService', ['$q', commonService]);

function commonService($q) {

  const serviceLists = {};

  return {
    serviceLists: serviceLists,
    updateBadge: updateBadge,
    checkDataStatus: checkDataStatus,
    checkStatus: checkStatus
  };

  function updateBadge() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 150] });

    let count = 0;
    for (const x in serviceLists) {
      if (angular.isDefined(serviceLists[x]) && serviceLists[x] !== null) {
          count += serviceLists[x];
      }
    }
    
    const badge = {
      text: (count > 0) ? count.toString() : '-'
    };
    chrome.browserAction.setBadgeText(badge);
  }

  function checkStatus(response) {
    const resp = $q.defer();
    if (response.status == 200) resp.resolve(response);
    else resp.reject();
    return resp.promise;
  }

  function checkDataStatus(response) {
    const resp = $q.defer();
    if (response.status == 200 && response.data.status == 1) resp.resolve(response);
    else resp.reject();
    return resp.promise;
  }

}