app.component('listItem', {
  templateUrl: 'app/components/listItem.html',
  controller: ListItemController,
  bindings: {
    id: '<',
    expanded: '=',
    icon: '<',
    url: '<',
    hostname: '<',
    pageTitle: '<',
    favorite: '<',
    colorPrimary: '<',
    colorPrimaryBg: '<',
    colorAccent: '<',
    colorAccentBg: '<',
    onArchive: '&',
    onDelete: '&',
    onFavorite: '&',
    onUnFavorite: '&',
    onExpand: '&'
  }
});

function ListItemController() {
  this.expand = function () {
    this.expanded = !this.expanded;
    if (this.expanded) this.onExpand({ id: this.id });
  }
}