app.factory('pocketOAuthService', ['$http', 'pocket_key', 'pocket_token', 'redirect_uri', pocketOAuthService]);

function pocketOAuthService($http, pocket_key, pocket_token, redirect_uri) {
  return {
    requestCode: requestCode,
    requestToken: requestToken,
    requestList: requestList,
    archive: modifyArticle.bind(undefined, 'archive'),
    delete: modifyArticle.bind(undefined, 'delete'),
    favorite: modifyArticle.bind(undefined, 'favorite'),
    unfavorite: modifyArticle.bind(undefined, 'unfavorite')
  };

  function requestCode() {
    const params = {
      consumer_key: pocket_key,
      redirect_uri: redirect_uri
    };
    return $http.post('https://getpocket.com/v3/oauth/request', params);
  }

  function requestToken() {
    const code = localStorage.pocket_code;
    const params = {
      consumer_key: pocket_key,
      code: code
    };
    return $http.post('https://getpocket.com/v3/oauth/authorize', params);
  }

  function requestList() {
    const params = {
      consumer_key: pocket_key,
      access_token: pocket_token,
      sort: 'newest'/*,
                detailType: 'complete'*/
    };
    return $http.post('https://getpocket.com/v3/get', params);
  }

  function modifyArticle(action, item_id) {
    const params = {
      consumer_key: pocket_key,
      access_token: pocket_token,
      actions: [{
        action: action,
        item_id: item_id
      }]
    };
    return $http.post('https://getpocket.com/v3/send', params);
  }
}
