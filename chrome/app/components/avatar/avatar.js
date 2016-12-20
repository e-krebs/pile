app.component('avatar', {

  templateUrl: 'app/components/avatar/avatar.html',

  bindings: {
    avatarId: '<',
    logo: '<',
    action: '<',
    actionTitle: '<',
    backgroundColor: '<',
    borderColor: '<',
    onAction: '&'
  },

  controller: class AvatarController {
    constructor() { }

    $onInit() {
      if (angular.isUndefined(this.actionTitle) && angular.isDefined(this.action)) {
        this.actionTitle = this.action;
      }
    }

    triggerAction(...args) {
      if (this.action) this.onAction(...args);
    }

  }
  
});