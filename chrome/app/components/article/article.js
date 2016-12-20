app.component('article', {

  templateUrl: 'app/components/article/article.html',

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
  },

  controller: class ArticleController {
    constructor() { }

    expand() {
      this.expanded = !this.expanded;
      if (this.expanded) this.onExpand({ id: this.id });
    }

  }
  
});