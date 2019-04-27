// 默认兼容ie8+
// $()     querySelectorAll ie8+
// $().ready()   该函数在最原始的ie8版本可能无法运行
// $().each()
// $().on()
// $().find()
// $().eq()
// $().get()
// $().hasClass()
// $().addClass()
// $().removeClass()
// $().css()
// $().show()
// $().hide()
// $().attr()
// $().removeAttr()
// $().append()
// $().remove()
// $().html()
// $().val()
// $().width()
// $().height()
// $.serialize()
// $.ajax()
// $.IEVersion()

var mQuery = function (selector, context) {
  context = context || document
  return new mQuery.prototype._init(selector, context)
}

mQuery.location = (function () {
  var location = window.location
  var res = {
    protocol: location.protocol,
    host: location.host,
    pathName: location.pathname,
    searchStr: location.search,
    searchObj: {},
    hashStr: location.hash
  }
  var searchStr = location.search
  if (searchStr) {
    searchStr = searchStr.substr(1)
    var arr = searchStr.split('&')
    for (var i = 0; i < arr.length; i++) {
      var kv = arr[i].split('=')
      res.searchObj[kv[0]] = decodeURIComponent(kv[1])
    }
  }
  return res
})()

mQuery.serialize = function (obj) {
  var str = ''
  for (var key in obj) {
    str += (key + '=' + encodeURIComponent(obj[key]) + '&')
  }
  if (str.length > 0) {
    str = str.substr(0, str.length - 1)
  }
  return str
}

mQuery.ajax = function (params) {
  var xmlhttp
  var url = params.url
  var method = params.method || 'get'
  var sendData

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest() //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP") // IE6, IE5 浏览器执行代码
  }

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      params.success && params.success(params.dataType === 'json' ?
        JSON.parse(xmlhttp.responseText) : xmlhttp.responseText, xmlhttp)
    } else {
      params.error && params.error(xmlhttp)
    }
    params.complete && params.complete(xmlhttp)
  }

  if (params.data) {
    if (method === 'get') {
      if (typeof params.data === 'string') {
        url += ('?' + params.data)
      } else if (typeof params.data === 'object') {
        url += ('?' + mQuery.serialize(params.data))
      }
    } else if (method === 'post' && typeof params.data === 'object') {
      sendData = mQuery.serialize(params.data)
    }
  }
  xmlhttp.open(method, url, true)

  if (params.headers) {
    for (var key in params.headers) {
      xmlhttp.setRequestHeader(key, params.headers[key])
    }
  }

  method === 'post' ? xmlhttp.send(sendData) : xmlhttp.send()
}

mQuery.IEVersion = function () {
  var userAgent = navigator.userAgent//取得浏览器的userAgent字符串  
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1//判断是否IE<11浏览器  
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE//判断是否IE的Edge浏览器  
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+)')
    reIE.test(userAgent)
    var fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion == 7) {
      return 7
    } else if (fIEVersion == 8) {
      return 8
    } else if (fIEVersion == 9) {
      return 9
    } else if (fIEVersion == 10) {
      return 10
    } else {
      return 6//IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'//edge
  } else if (isIE11) {
    return 11//IE11  
  } else {
    return -1//不是ie浏览器
  }
}

mQuery.each = function (arr, func) {
  if (arr) {
    var len = 0
    if (typeof arr === 'number') {
      len = arr
      for (var i = 0; i < len; i++) {
        if (func.call(i, i, i) === false) {
          break
        }
      }
    } else if (arr instanceof Array || arr instanceof NodeList) {
      len = arr.length
      for (var i = 0; i < len; i++) {
        if (func.call(arr[i], arr[i], i) === false) {
          break
        }
      }
    }
  }
}

mQuery.isString = function (params) {
  return typeof params === 'string'
}

mQuery.isObject = function (params) {
  typeof params === 'object'
}

mQuery.isFunction = function (params) {
  return typeof params === 'function'
}

mQuery.isElement = function (params) {
  return params instanceof Element
}

mQuery.prototype = {
  _init: function (selector, context) {
    this.elems = []
    this.length = 0
    if (selector) {
      if (selector === document || selector === 'document') {
        this.elems.push(document)
      } else if (selector === 'body') {
        this.elems.push(document.body)
      } else if (this.isElement(selector)) {
        this.elems.push(selector)
      } else if (typeof selector === 'string') {
        // 创建元素
        if (/^<([a-z]+[0-9]?)>$/.test(selector)) {
          this.elems.push(document.createElement(RegExp.$1))
        } else if (this._selectorIsId(selector)) {
          this._selectId(selector)
        } else if (this._selectorIsTagName(selector)) {
          this._selectTagName(selector, context)
        } else {
          this._selectOther(selector, context)
        }
        this.length = this.elems && this.elems.length
      }
    }
    return this
  },
  _selectorIsId: function (selector) {
    return /^#[0-9a-zA-Z-]+$/.test(selector)
  },
  _selectorIsTagName: function (selector) {
    return /^[a-z]+$/.test(selector)
  },
  _selectorIsClassName: function (selector) {
    return /^\.[0-9a-zA-Z-]+$/.test(selector)
  },
  _selectId: function (selector) {
    var tempElem = document.getElementById(selector.replace('#', ''))
    if (tempElem) {
      this.elems.push(tempElem)
    }
  },
  _selectTagName: function (selector, context) {
    var i, j, elems = [], tempElems
    if (context === document) {
      tempElems = context.getElementsByTagName(selector)
      if (tempElems && tempElems.length) {
        for (j = 0; j < tempElems.length; j++) {
          elems.push(tempElems[j])
        }
      }
    } else if (context && context.length) {
      for (i = 0; i < context.length; i++) {
        tempElems = context[i].getElementsByTagName(selector)
        if (tempElems && tempElems.length) {
          for (j = 0; j < tempElems.length; j++) {
            elems.push(tempElems[j])
          }
        }
      }
    }
    this.elems = elems
  },
  _selectOther: function (selector, context) {
    var i, j, elems = [], tempElems
    if (context === document) {
      tempElems = context.querySelectorAll(selector)
      if (tempElems && tempElems.length) {
        for (j = 0; j < tempElems.length; j++) {
          elems.push(tempElems[j])
        }
      }
    } else if (context && context.length) {
      for (i = 0; i < context.length; i++) {
        tempElems = context[i].querySelectorAll(selector)
        if (tempElems && tempElems.length) {
          for (j = 0; j < tempElems.length; j++) {
            elems.push(tempElems[j])
          }
        }
      }
    }
    this.elems = elems
  },
  
  ready: function (func) {
    var ieVersion = mQuery.IEVersion()
    if (ieVersion > 8 || ieVersion < 0) {
      this.on('DOMContentLoaded', function (e) {
        func(e)
      })
    } else {
      this.on('readystatechange', function (e) {
        if (document.readyState === 'complete') {
          func(e)
        }
      })
    }
  },
  each: function (func) {
    if (this.elems && this.elems.length > 0) {
      for (var i = 0; i < this.elems.length; i++) {
        if (func.call(this.elems[i], this.elems[i], i) === false) {
          break
        }
      }
    }
  },
  on: function (eventType, selector, handle) {
    var that = this, mySelector, myHandle
    if (this.isString(selector)) {
      mySelector = selector
      myHandle = handle
    } else if (this.isFunction(selector)) {
      myHandle = selector
    }
    function addEventHandle(elem, type, handler) {
      if (elem.addEventListener)
        elem.addEventListener(type, handler, false)
      else if (elem.attachEvent)
        elem.attachEvent("on" + type, handler)
      else
        elem["on" + type] = handler
    }
    this.each(function (elem, index) {
      if (eventType === 'touchDirection') {
        addEventHandle(elem, "touchstart", handleTouchEvent)
        addEventHandle(elem, "touchend", handleTouchEvent)
        addEventHandle(elem, "touchmove", handleTouchEvent)
        var startX
        var startY

        function handleTouchEvent(event) {
          switch (event.type) {
            case "touchstart":
              startX = event.touches[0].clientX
              startY = event.touches[0].clientY
              break
            case "touchend":
              var spanX = event.changedTouches[0].clientX - startX
              var spanY = event.changedTouches[0].clientY - startY
              if (Math.abs(spanX) > Math.abs(spanY)) { //认定为水平方向滑动
                if (spanX > 30) { //向右
                  myHandle.call(elem, event, 'right')
                } else if (spanX < -30) { //向左
                  myHandle.call(elem, event, 'left')
                }
              } else { //认定为垂直方向滑动
                if (spanY > 30) { //向下
                  myHandle.call(elem, event, 'down')
                } else if (spanY < -30) { //向上
                  myHandle.call(elem, event, 'up')
                }
              }
              break
            case "touchmove":
              // 可阻止默认行为
              myHandle.call(elem, event, 'move')
              break
          }
        }
      } else {
        addEventHandle(elem, eventType, function (e) {
          if (mySelector) {
            var target = e.target
            if (that._selectorIsTagName(mySelector)) {
              while (target !== elem) {
                if (target.nodeName.toLowerCase() === mySelector) {
                  myHandle.call(target, e)
                  break
                }
                target = target.parentNode
              }
            } else if (that._selectorIsClassName(mySelector)) {
              if (target.className.indexOf(mySelector.replace('.', '')) >= 0) {
                while (target !== elem) {
                  if (target.nodeName.toLowerCase() === mySelector) {
                    myHandle.call(target, e)
                    break
                  }
                  target = target.parentNode
                }
                myHandle.call(elem, e)
              }
            } else {
              new Error('事件绑定时子选择器只能为tagName或className')
            }
          } else {
            myHandle.call(elem, e)
          }
        })
      }

    })
    return this
  },
  find: function (selector) {
    if (selector && this.length) {
      return mQuery(selector, this.elems)
    } else {
      return this
    }
  },
  eq: function (index) {
    return mQuery(this.elems[index])
  },
  get: function (index) {
    return this.elems[index]
  },
  hasClass: function (className, dom) {
    if (dom) {
      return dom.className.indexOf(className) >= 0
    }
    var res = true
    this.each(function (elem, index) {
      if (elem.className.indexOf(className) < 0) {
        res = false
        return false
      }
    })
    return res
  },
  addClass: function (className) {
    var that = this
    this.each(function (elem, index) {
      if (!that.hasClass(className, elem)) {
        elem.className += ' ' + className
      }
    })
    return this
  },
  removeClass: function (className) {
    if (typeof className === 'string') {
      this.each(function (elem) {
        elem.className = elem.className.replace(new RegExp(className, 'g'), '')
      })
    } else if (className instanceof Array) {
      this.each(function (elem) {
        var elemClassName = elem.className
        for (var i = 0; i < className.length; i++) {
          elemClassName = elemClassName.replace(new RegExp(className[i], 'g'), '')
        }
        elem.className = elemClassName
      })
    }
    return this
  },
  css: function (styleName, styleValue) {
    if (typeof styleName === 'string') {
      this.each(function (elem) {
        elem.style[styleName] = styleValue
      })
    } else if (typeof styleName === 'object') {
      this.each(function (elem) {
        for (var key in styleName) {
          elem.style[key] = styleName[key]
        }
      })
    }
    return this
  },
  show: function (value) {
    this.css('display', value ? value : 'block')
  },
  hide: function () {
    this.css('display', 'none')
  },
  attr: function (attrName, attrValue) {
    if (this.isString(attrName)) {
      if (attrValue === undefined) {
        return this.elems[0].getAttribute(attrName)
      } else if (this.isString(attrValue)) {
        this.each(function (elem) {
          elem.setAttribute(attrName, attrValue)
        })
      }
    } else if (this.isObject(attrName)) {
      this.each(function (elem) {
        for (var key in attrName) {
          elem.setAttribute(key, attrName[key])
        }
      })
    }
    return this
  },
  removeAttr: function (attrName) {
    if (attrName) {
      this.each(function (elem) {
        elem.removeAttribute(attrName)
      })
    }
    return this
  },
  html: function (params) {
    this.each(function (elem) {
      elem.innerHTML = params
    })
    return this
  },
  append: function (params) {
    if (typeof params === 'string') {
      this.each(function (elem) {
        elem.innerHTML += params
      })
    } else if (this.isElement(params)) {
      this.each(function (elem) {
        elem.appendChild(params)
      })
    } else if (params instanceof mQuery) {
      this.each(function (elem) {
        params.each(function (elem2) {
          elem.appendChild(elem2)
        })
      })
    }
  },
  remove: function (selector) {
    var $target = selector ? this.find(selector) : this
    $target.each(function (elem) {
      elem.parentNode.removeChild(elem)
    })
    return this
  },
  val: function (params) {
    if (params) {
      this.each(function (elem) {
        elem.value = params
      })
      return this
    } else {
      return this.elems[0] && this.elems[0].value
    }
  },
  width: function () {
    return this.elems[0].offsetWidth
  },
  height: function () {
    return this.elems[0].offsetHeight
  }
}
mQuery.prototype._init.prototype = mQuery.prototype
