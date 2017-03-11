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
            controllerAs: 'vm',
            resolve: {
                data: function(initBooksList) {
                    return initBooksList();
                }
            }
        });
    }])

    .controller('BookListCtrl', BookListCtrl)

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

function BookListCtrl($scope, $rootScope, $mdDialog, data) {
    $rootScope.currentTab = 'book-list';

    var vm = this;
    vm.books = data.books;
    vm.addBook = function (ev) {
        $mdDialog.show({
            controller: addEditBookCtrl,
            controllerAs: 'vm',
            templateUrl: '../templates/add-book.html',
            bindToController: true,
            locals: {book: {}, books: vm.books, edit: false},
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };

    vm.editBook = function (ev, book) {
        $mdDialog.show({
            controller: addEditBookCtrl,
            controllerAs: 'vm',
            templateUrl: '../templates/add-book.html',
            bindToController: true,
            locals: {book: book, books: vm.books, edit: true},
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
    };

    vm.removeBook = function (ev, index) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove this book?')
            .textContent('You cannot undo this operation.')
            .ariaLabel('Remove book')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            vm.books.splice(index, 1);
        });
    };

}

function addEditBookCtrl($scope, book, books, $mdDialog, edit) {
    var vm = this;
    vm.book = book || {};
    vm.editMode = edit;

    vm.saveBook = function(ev) {
        var error = isValidDetails();
        if(error == '') {
            if(!vm.book.img)
                vm.book.img = '../static/img/default-book.jpeg'; // default image
            books.push(vm.book);
            vm.hide();
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

    vm.hide = function() {
        $mdDialog.hide();
    };

    vm.cancel = function() {
        $mdDialog.cancel();
    };

    vm.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    function isValidDetails() {
        if(!vm.book) {
            return 'You muse provide all details.';
        } else if(!vm.book.title) {
            return "You must provide book's title.";
        } else if(!vm.book.author) {
            return "You must provide book's author.";
        } else if(!vm.book.date) {
            return "You must probide book's year of publish.";
        } else if(vm.book.date.toString().length != 4 || !Number.isInteger(parseInt(vm.book.date))) {
            return 'Year of publish must be a number (4 digits).';
        } else if(!vm.book.summary) {
            return "You must provide book's summary.";
        } else {
            return '';
        }
    }
}
