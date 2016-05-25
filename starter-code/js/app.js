console.log('this file is running.');

var app = angular.module('RedditApp', []);

app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  console.log(localStorage.searchHistory);
  if (localStorage.searchHistory) {
    $scope.searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
  } else {
    $scope.searchHistory = []
  }
  $scope.searchTerm = '';
  $scope.currentSearch = '';
  $scope.thumbnailPosts = [];
  $scope.posts = [];

  $scope.clearSearch = function() {
    $scope.searchTerm = "";
  }

  $scope.searchReddit = function() {
    if ($scope.searchHistory.indexOf($scope.searchTerm) < 0) {
      $scope.searchHistory.unshift($scope.searchTerm);
      $scope.currentSearch = $scope.searchTerm;
      localStorage.setItem('currentSearch', $scope.currentSearch);

      var req = {
        url: "https://www.reddit.com/search.json?",
        method: 'GET',
        params: {
          q: $scope.searchTerm,
          sort: 'new'
        }
      }

      $http(req).then(function success(res) {
        var posts = res.data.data.children
        console.log(posts);
        $scope.posts = [];
        $scope.thumbnailPosts = [];
        for (var i = 0; i < posts.length; i++) {
          var tn = posts[i].data.thumbnail
          if (tn !== 'self' && tn !== "" && $scope.thumbnailPosts.length < 4) {
            $scope.thumbnailPosts.push(posts[i]);
          } else {
            $scope.posts.push(posts[i]);
          }
        }
        console.log('Thumbnail list: ', $scope.thumbnailPosts);
      }, function error(res) {
        console.log(res);
      });
    } else {
      $scope.historyLinkClicked($scope.searchTerm);
    }
    $scope.searchTerm = "";
    localStorage.setItem('searchHistory', JSON.stringify($scope.searchHistory))
  };

  $scope.historyLinkClicked = function(search) {
    $scope.searchHistory.splice($scope.searchHistory.indexOf(search), 1);
    $scope.searchTerm = search;
    $scope.searchReddit();
  }

  if (localStorage.currentSearch) {
    console.log('currentSearch exists');
      $scope.searchTerm = localStorage.currentSearch;
      $scope.searchReddit();
  }

  $scope.clearAllHistory = function() {
    localStorage.searchHistory = [];
    $scope.searchHistory = [];
    localStorage.currentSearch = "";
    $scope.currentSearch = "";
    $scope.thumbnailPosts = [];
    $scope.posts = [];
  }

  $scope.clearHistoryItem = function(item) {
    $scope.searchHistory.splice($scope.searchHistory.indexOf(item), 1);
    localStorage.setItem('searchHistory', JSON.stringify($scope.searchHistory))
    $scope.searchTerm = '';
  }











}])

