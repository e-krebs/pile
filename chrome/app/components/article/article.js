app.component('article', {
  templateUrl: 'app/components/article/article.html',
  controller: ArticleController,
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

function ArticleController() {
  this.expand = function () {
    this.expanded = !this.expanded;
    if (this.expanded) this.onExpand({ id: this.id });
  }
}