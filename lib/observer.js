/**
 * created by Soyal 2017.4.22
 */

/**
 * 检测数据变化
 * @param {*} data 
 */
function observe(data) {
  if(data && typeof data === 'object') {
    Object.keys(data).forEach(function (key) {
      doObserve(data, key, data[key]);
    });
  }

}

function doObserve(data, key, value) {
  observe(value);
  var dep = new Dep();

  Object.defineProperty(data, key, {
    enumerable: true,
    configruable: false,
    get: function () {
      if(Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set: function(newValue) {
console.log('数值改变', key, newValue);
      value = newValue;
      dep.notify();
    }
  })
}

function Dep() {
  this.subs = []; //订阅者
}

Dep.prototype.addSub = function(sub) {
  this.subs.push(sub);
}

Dep.prototype.notify = function() {
  this.subs.forEach(function(sub) {
    sub.update();
  });
}