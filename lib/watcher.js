/**
 * created by Soyal 2017.4.22
 */

/**
 * 观察者
 * @param {*} vm  
 * @param {*} key 
 * @param {*} update 
 */
function Watcher(key, vm, update) {
  this.$vm = vm;
  this.$key = key;
  this.$update = update;
  this.init();
}

/**
 * 将watcher添加到Dep的subs队列里面
 */
Watcher.prototype.init = function() {
  Dep.target = this;
  this.$value = this.$vm[this.$key];
  Dep.target = null;
};

Watcher.prototype.update = function() {
  this.$update.call(this);
};