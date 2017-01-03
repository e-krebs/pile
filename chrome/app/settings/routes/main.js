app.controller('mainCtrl', ['$scope', mainCtrl]);

function mainCtrl($scope) {
    const vm = this;
    if (angular.isUndefined(localStorage.alarmPeriod)) {
        localStorage.alarmPeriod = 10;
    }

    vm.alarmPeriod = Number.parseInt(localStorage.alarmPeriod);

    vm.saveAlarm = function() {
        localStorage.alarmPeriod = vm.alarmPeriod;
        chrome.alarms.create("pocket_refresh", { periodInMinutes: vm.alarmPeriod });
        console.info(`pocket_refresh alarm set to ${vm.alarmPeriod} minutes`);
    };
}