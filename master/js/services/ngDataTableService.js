App.service('ngTableDataService', function() {

  var TableData = {
    cache: null,
    getData: function($defer, params, api){
      // if no cache, request data and filter
      if ( ! TableData.cache ) {
        if ( api ) {
          api.get(function(data){
            TableData.cache = data;
            filterdata($defer, params);
          });
        }
      }
      else {
        filterdata($defer, params);
      }
      
      function filterdata($defer, params) {
        var from = (params.page() - 1) * params.count();
        var to = params.page() * params.count();
        var filteredData = TableData.cache.result.slice(from, to);

        params.total(TableData.cache.total);
        $defer.resolve(filteredData);
      }

    }
  };
  
  return TableData;

});

