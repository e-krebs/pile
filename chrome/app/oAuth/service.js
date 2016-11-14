app.factory('pocketOAuthService', ['$http', '$q', 'consumer_key', 'access_token', 'redirect_uri', pocketOAuthService]);

function pocketOAuthService($http, $q, consumer_key, access_token, redirect_uri) {
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
        var params = {
                consumer_key: consumer_key,
                redirect_uri: redirect_uri
            };
        return $http.post('https://getpocket.com/v3/oauth/request', params);
    }
    
    function requestToken() {
        var code = localStorage.pocket_code;
        var params = {
                consumer_key: consumer_key,
                code: code
            };
        return $http.post('https://getpocket.com/v3/oauth/authorize', params);
    }
    
    function requestList() {
        var params = {
                consumer_key: consumer_key,
                access_token: access_token,
                sort: 'newest'/*,
                detailType: 'complete'*/
            };
        return $http.post('https://getpocket.com/v3/get', params);
    }
    
    function modifyArticle(action, item_id) {
        var params = {
            consumer_key: consumer_key,
            access_token: access_token,
            actions: [{
                    action: action,
                    item_id: item_id
                }]
        };
        return $http.post('https://getpocket.com/v3/send', params);
    }
}
