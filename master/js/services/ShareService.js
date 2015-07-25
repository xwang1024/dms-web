App.service('ShareService', function() {
  var data;
  return {
      getData: function () {
          return data;
      },
      setData: function(_data) {
          data = _data;
      }
  };
});
