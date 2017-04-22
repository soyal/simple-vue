/**
 * created by Soyal 2017.4.22
 */

var utils = {
  // 是否为元素节点
  isElementNode: function (node) {
    return node.nodeType === 1;
  },

  // 是否为文本节点
  isTextNode: function (node) {
    return node.nodeType === 3;
  },

  // 是否是指令
  isDirective: function (attrName) {
    var pattern = /^v-/;

    return pattern.test(attrName);
  },

  // 是否是动作指令
  isActionDirective: function (directName) {
    var pattern = /^on\:/;

    return pattern.test(directName);
  },

  /**
   * 将
   */
  bind: function (key, node, vm, type) {
    // 将初始化数据绑定到dom上
    node[type] = vm[key];

    // dom更改 =》 数据更改
    node.addEventListener('input', function () {
      vm[key] = this[type];
    }, false);

    // 数据更改 =》 dom更改
    new Watcher(key, vm, function () {
      var newVal = vm[key];
      if (newVal !== node[type]) {
        node[type] = newVal;
        console.log('update ', newVal);
      }
    });
  }
};

// 普通指令处理
var usualDirectiveUtils = {
  'model': function (key, node, vm) {
    utils.bind(key, node, vm, 'value');
  }
};

var actionDirectiveUtils = {
  'on:click': function(key, node, vm) {
    node.addEventListener('click', vm.$methods[key].bind(vm), false);
  }
}

/**
 * 解析器
 * @param {*} el 元素节点
 * @param {*} vm SVue对象
 */
function Compiler(el, vm) {
  this.$vm = vm;
  this.$el = typeof el === 'string' ? document.querySelector(el) : el;
  this.$fragment = this.node2fragment(this.$el);
  this.compile(this.$fragment);
  this.$el.appendChild(this.$fragment);
}

/**
 * 将node节点转到fragment中
 */
Compiler.prototype.node2fragment = function (element) {
  var fragment = document.createDocumentFragment();
  var child;

  while (child = element.firstChild) {
    fragment.appendChild(child);
  }

  return fragment;
}

/**
 * 解析根节点
 * @param {*} el 
 */
Compiler.prototype.compile = function ($el) {
  var childNodes = Array.prototype.slice.call($el.childNodes);
  var me = this;

  childNodes.forEach(function (childNode) {
    if (utils.isElementNode(childNode)) {
      me.compileElement(childNode);
    } else if (utils.isTextNode(childNode)) {
      me.compileText(childNode);
    }

    if (childNode.childNodes && childNode.childNodes.length) {
      me.compile(childNode);
    }
  });
}

/**
 * 解析元素节点
 * @param {*} node 
 */
Compiler.prototype.compileElement = function (node) {
  // 解析元素节点，主要是解析属性，解析指令
  var attributes = Array.prototype.slice.call(node.attributes);
  var me = this;

  attributes.forEach(function (attr) {
    var attrName = attr.name;
    var attrVal = attr.value;

    if (utils.isDirective(attrName)) {
      var directName = attrName.substring(2);

      // 是动作指令
      if (utils.isActionDirective(directName)) {
        actionDirectiveUtils[directName](attrVal, node, me.$vm);
      
      // 是普通指令
      } else {
        usualDirectiveUtils[directName](attrVal, node, me.$vm);
      }
    }
  });
}

/**
 * 解析文本节点
 * @param {*} node 
 */
Compiler.prototype.compileText = function (node) {
  var pattern = /\{\{\s*(\w+)\s*\}\}/;
  var value = node.nodeValue;

  if (pattern.test(value)) {
    var key = RegExp.$1;
    utils.bind(key, node, this.$vm, 'nodeValue');
  }
}

