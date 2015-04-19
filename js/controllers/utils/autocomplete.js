angular.module("SpotJams")
    .controller('AutocompleteInstrController', AutocompleteInstrController)
    .controller('AutocompleteGenreController', AutocompleteGenreController);

function AutocompleteInstrController($timeout, $q, $http) {
    var self = this;
    // list of `items` value/display objects
    self.whichList = "instrument_list.txt";
    loadAll(self.whichList);

    self.theList = null;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.simulateQuery = false;
    self.isDisabled = false;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for theList... use $timeout to simulate
     * remote dataservice call.
     */

    function querySearch(query) {
            var results = query ? self.theList.filter(createFilterFor(query)) : [];
            return results;

        }
        /**
         * Build `theList` list of key/value pairs
         */
    function loadAll(whichList) {
            console.log(whichList)
            $http.get('data/' + whichList).
            success(function(data, status, headers, config) {
                console.log("GOT HERE 1")

                var lines = data.split(/ *\n/g);

                var items = lines.map(function(item) {
                    item = $.trim(item);
                    return {
                        value: item.toLowerCase(),
                        display: item
                    };
                });

                console.log(items)
                self.theList = items;
            }).
            error(function(data, status, headers, config) {
                console.log("GOT HERE 2")
                return [{
                    value: "error",
                    display: "error: " + status,
                }];
            });
        }
        /**
         * Create filter function for a query string
         */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            if (query.length < 3) {
                return false;
            }
            return (item.value.indexOf(lowercaseQuery) >= 0);
        };
    }
}

function AutocompleteGenreController($timeout, $q, $http) {
    var self = this;
    // list of `items` value/display objects
    self.whichList = "genre_list.txt";
    loadAll(self.whichList);

    self.theList = null;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.simulateQuery = false;
    self.isDisabled = false;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for theList... use $timeout to simulate
     * remote dataservice call.
     */

    function querySearch(query) {
            var results = query ? self.theList.filter(createFilterFor(query)) : [];
            return results;
        }
        /**
         * Build `theList` list of key/value pairs
         */
    function loadAll(whichList) {
            console.log(whichList)
            $http.get('data/' + whichList).
            success(function(data, status, headers, config) {
                console.log("GOT HERE 1")

                var lines = data.split(/ *\n/g);

                var items = lines.map(function(item) {
                    item = $.trim(item);
                    return {
                        value: item.toLowerCase(),
                        display: item
                    };
                });

                console.log(items)
                self.theList = items;
            }).
            error(function(data, status, headers, config) {
                console.log("GOT HERE 2")
                return [{
                    value: "error",
                    display: "error: " + status,
                }];
            });
        }
        /**
         * Create filter function for a query string
         */
    function createFilterFor(query) {
        if (query.length < 3) {
            return false;
        }
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) >= 0);
        };
    }
}