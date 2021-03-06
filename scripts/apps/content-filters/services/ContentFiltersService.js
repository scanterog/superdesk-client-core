/**
 * @name contentFilters
 * @module superdesk.apps.content_filters
 * @ngdoc service
 * @description
 *   This service implements a convenience layer on top of the server API,
 *   providing higher-level methods for fetching and modifying all content
 *   related to content filters on the server.
 */
ContentFiltersService.$inject = ['api', '$filter'];
export function ContentFiltersService(api, $filter) {
    this.productionTestFilter = function(filter) {
        return filter;
    };

    this.getFilterConditionParameters = function() {
        return api.query('filter_conditions/parameters')
            .then(angular.bind(this, (params) => params._items));
    };

    this.saveFilterCondition = function(orig, diff) {
        return api.save('filter_conditions', orig, diff);
    };

    this.remove = function(item) {
        return api.remove(item);
    };

    this.getAllFilterConditions = function(page, items) {
        return _getAll('filter_conditions', page, items);
    };

    this.getFilterSearchResults = function(inputParams) {
        // call api to get search results
        return api.query('subscribers', {filter_condition: inputParams})
            .then(angular.bind(this, (resultSet) => resultSet._items));
    };

    this.getAllContentFilters = function(page, items) {
        return _getAll('content_filters', page, items);
    };

    this.saveContentFilter = function(orig, diff) {
        return api.save('content_filters', orig, diff);
    };

    this.testContentFilter = function(diff) {
        return api.save('content_filter_tests', {}, diff);
    };

    this.getGlobalContentFilters = function() {
        return api.query('content_filters', {is_global: true})
            .then((response) => $filter('sortByName')(response._items));
    };

    var _getAll = function(endPoint, page = 1, items = []) {
        return api(endPoint)
            .query({max_results: 200, page: page})
            .then((result) => {
                let extended = items.concat(result._items);
                let pg = page;

                if (result._links.next) {
                    pg++;
                    return _getAll(endPoint, pg, extended);
                }
                return extended;
            });
    };
}
