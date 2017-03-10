'use strict';

angular.module('myApp.BookList', ['ngRoute'])

    .factory("initBooksList", ['$http', function($http) {
      return function() {
        return $http.get('../static/books.json').then(function(res) {
            return {books: res.data};
        });
      }
    }])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/BookList', {
            templateUrl: 'BookList/BookList.html',
            controller: 'BookListCtrl',
            resolve: {
              data: function(initBooksList) {
                return initBooksList();
              }
            }
        });
    }])

    .controller('BookListCtrl', ['$scope', '$rootScope', '$http', '$mdDialog', 'data', function($scope, $rootScope, $http, $mdDialog, data) {
        $rootScope.currentTab = 'book-list';
        $scope.books = data.books;
        $scope.addBook = function(ev) {
            $mdDialog.show({
                controller: addEditBookCtrl,
                templateUrl: '../templates/add-book.html',
                bindToController: true,
                locals: {book: {}, books: $scope.books, edit: false},
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
        };

        $scope.editBook = function(ev, book) {
            $mdDialog.show({
                controller: addEditBookCtrl,
                templateUrl: '../templates/add-book.html',
                bindToController: true,
                locals: {book: book, books: $scope.books, edit: true},
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            })
        };

        $scope.removeBook = function(ev, index) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to remove this book?')
                .textContent('You cannot undo this operation.')
                .ariaLabel('Remove book')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                $scope.books.splice(index, 1);
            }, function() {

            });
        };

        function addEditBookCtrl($scope, book, books, edit) {
            $scope.book = book || {};
            $scope.editMode = edit;

            $scope.saveBook = function(ev) {
                var error = isValidDetails();
                if(error == '') {
                    if(!$scope.book.img)
                        $scope.book.img = '../static/img/default-book.jpeg'; // default image
                    books.push($scope.book);
                    $scope.hide();
                } else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title('Error!')
                            .textContent(error)
                            .ariaLabel('Error Dialog')
                            .ok('OK')
                            .targetEvent(ev)
                    );
                }

            };

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            function isValidDetails() {
              if(!$scope.book) {
                return 'You muse provide all details.';
              } else if(!$scope.book.title) {
                return "You must provide book's title.";
              } else if(!$scope.book.author) {
                return "You must provide book's author.";
              } else if(!$scope.book.date) {
                return "You must probide book's year of publish.";
              } else if($scope.book.date.toString().length != 4 || !Number.isInteger(parseInt($scope.book.date))) {
                return 'Year of publish must be a number (4 digits).';
              } else if(!$scope.book.summary) {
                return "You must provide book's summary.";
              } else {
                return '';
              }
            }
        }

    }])

.filter('parseTitle', function() {
  return function(input) {
    var filteredBooks = [];
    angular.forEach(input, function(book) {
      var tmp = book;
      tmp.title = tmp.title.replace(/[^A-Za-z0-9 -]/g, '');
      tmp.title = tmp.title.toLowerCase();
      var splitted = tmp.title.split(' ');
      angular.forEach(splitted, function(word, index) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
        splitted[index] = word;
      });
      splitted = splitted.join(' ');
      tmp.title = splitted;
      filteredBooks.push(tmp)
    });
    return filteredBooks;
  }
});