var assert = require('chai').assert;

var cases = {
  SumPropis: {
    module: require("../index"),
    cases: {
      simple: [
        [0, 'нуль гривень 00 копійок'],
        ['0', 'нуль гривень 00 копійок'],
        ['1', 'одна гривня 00 копійок'],
      ],
      typical: [
        [988, 'дев\'ятсот вісімдесят вісім гривень 00 копійок'],
        [34567, 'тридцять чотири тисячі п\'ятсот шістдесят сім гривень 00 копійок'],
        [15690, 'п\'ятнадцять тисяч шістсот дев\'яносто гривень 00 копійок'],
      ],
      stringDelims: [
        ['0.12', 'нуль гривень 12 копійок'],
        ['0.121', 'нуль гривень 12 копійок'],
        ['0.115', 'нуль гривень 12 копійок'],
        ['0,12', 'нуль гривень 12 копійок'],
        ['1,000.12', 'одна тисяча гривень 12 копійок'],
        ['1,000,120', 'один мільйон сто двадцять гривень 00 копійок'],
        ['1000,12', 'одна тисяча гривень 12 копійок'],
      ],
    }
  }
};

for (var moduleName in cases) {
  var moduleObj = cases[moduleName];
  var moduleCases = moduleObj.cases;
  iterateProps(moduleCases, moduleName, moduleObj);
}

function iterateProps(moduleCases, moduleName, moduleObj) {
  describe(moduleName, function() {
    var propsArr = Object.keys(moduleCases);

    iterRec(propsArr, function(prop, cb) {
      var child = moduleCases[prop];
      describe(prop, function() {
        if (child.constructor == Object) {
          iterateProps(child, moduleName, moduleObj);
        } else if (child.constructor == Array) {
          runTests(child, moduleObj);
        }
      });
      cb();
    });
  });
}

function runTests(caseArr, moduleObj) {
  var moduleInst = moduleObj.module;

  iterRec(caseArr, function(testCase, cb) {

    var query = testCase[0];
    var res = testCase[1];
    var prop = testCase[2];

    var name = (prop ? prop + " of " : "") +
      ((typeof query == "object") ? JSON.stringify(query) : query) + " == " + res;

    it(name, function() {
      if (prop) {
        assert.equal(res, moduleInst(query)[prop]);
      } else assert.equal(res, moduleInst(query));
    });
    cb();
  });
}

function iterRec(arr, func) {
  var i = 0;
  var l = arr.length;

  (function next() {
    var item = arr[i];
    func(item, nextCb);

    function nextCb() {
      i++;
      if (i < l) next();
    }
  })();
}