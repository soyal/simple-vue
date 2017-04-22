/**
 * Soyal created by 2017.4.21
 */

function SVue(option) {
  this.$data = option.data;
  this.$methods = option.methods;
  this.$el = option.el;

  this.__proxy(this.$data);
  observe(this.$data);

  new Compiler(this.$el, this);
}

/**
 * 将SVue.$data的set 和 get操作全部代理到SVue上面
 */
SVue.prototype.__proxy = function($data) {
  var me = this;

  Object.keys($data).forEach(function(key) {
    Object.defineProperty(me, key, {
      enumerable: true,  //可枚举类型
      configurable: false, //不可再次定义
      get: function() {
        return $data[key];
      },
      set: function(value) {
        $data[key] = value;
      }
    })
  });
};

