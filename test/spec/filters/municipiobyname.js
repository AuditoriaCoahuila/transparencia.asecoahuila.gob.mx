'use strict';

describe('Filter: municipioByName', function () {

  // load the filter's module
  beforeEach(module('asecApp'));

  // initialize a new instance of the filter before each test
  var municipioByName;
  beforeEach(inject(function ($filter) {
    municipioByName = $filter('municipioByName');
  }));

  it('should return the input prefixed with "municipioByName filter:"', function () {
    var text = 'angularjs';
    expect(municipioByName(text)).toBe('municipioByName filter: ' + text);
  });

});
