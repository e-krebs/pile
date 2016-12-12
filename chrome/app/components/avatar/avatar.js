app.component('avatar', {
  templateUrl: 'app/components/avatar/avatar.html',
  controller: AvatarController,
  bindings: {
    avatarId: '<',
    logo: '<',
    action: '<',
    actionTitle: '<',
    backgroundColor: '<',
    borderColor: '<',
    onAction: '&'
  }
});

function AvatarController() {

  if (angular.isUndefined(this.actionTitle) && angular.isDefined(this.action)) {
    this.actionTitle = this.action;
  }

  this.triggerAction = function (...args) {
    if (this.action) this.onAction(...args);
  }

}