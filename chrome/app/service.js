app.factory('commonService', [commonService]);

function commonService() {

  const serviceLists = {};

  return {
    serviceLists: serviceLists,
    updateBadge: updateBadge
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
      text: (count > 0)
        ? count.toString()
        : '-'
    };
    chrome.browserAction.setBadgeText(badge);
  }

}