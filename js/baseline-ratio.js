/* Universal Module Definition */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as a named AMD module.
    define('baselineRatio', [], function () {
      return (root.baselineRatio = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals
    root.baselineRatio = factory();
  }
}(this, function () {
  var baselineRatio = function(elem) {
    // Get the baseline in the context of whatever element is passed in.
    elem = elem || document.body;

    // The container is a little defenseive.
    var container = document.createElement('div');
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.bottom = "0";
    container.style.right = "0";
    container.style.width = "0px";
    container.style.height = "0px";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.visibility = "hidden";
    container.style.overflow = "hidden";

    // Intentionally unprotected style definition.
    var small = document.createElement('span');
    var large = document.createElement('span');

    // Large numbers help improve accuracy.
    small.style.fontSize = "0px";
    large.style.fontSize = "2000px";

    small.innerHTML = "X";
    large.innerHTML = "X";

    container.appendChild(small);
    container.appendChild(large);

    // Put the element in the DOM for a split second.
    elem.appendChild(container);
    var smalldims = small.getBoundingClientRect();
    var largedims = large.getBoundingClientRect();
    elem.removeChild(container);

    // Calculate where the baseline was, percentage-wise.
    var baselineposition = smalldims.top - largedims.top;
    var height = largedims.height;

    return 1 - (baselineposition / height);
  }

  return baselineRatio;
}));
