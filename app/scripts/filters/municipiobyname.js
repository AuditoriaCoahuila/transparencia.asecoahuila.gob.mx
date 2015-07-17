'use strict';

/**
 * @ngdoc filter
 * @name asecApp.filter:municipioByName
 * @function
 * @description
 * # municipioByName
 * Filter in the asecApp.
 */
angular.module('asecApp')
  .filter('municipioByName',['$filter', function ($filter) {
    var inputArray;
    return function (input, name) {
      return input;
      if(!inputArray && !input.length){
        inputArray = [];
        Object.keys(input).filter(function(index){
          inputArray.push(input[index]);
        });
      }else if(input.length){
        inputArray = input;
      }
      if(!name)
        return input;

      return $filter('filter')(inputArray, function(m){
          return m.datos_entidad.nombre_completo.toLowerCase().indexOf(name) != -1;
      });
    };

  }]);
