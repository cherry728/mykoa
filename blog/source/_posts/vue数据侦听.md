# Vue2.x数据变化响应式

### 一. 数据驱动视图

1. 数据可以理解为状态，数据的变化可能是由用户操作引起的，或者后端数据变化引起的。状态改变了，页面就应该跟随改变，这种特性就是数据驱动视图

   ​	**UI = render(state)**

2. Vue怎么知道state改变了呢？**变化侦听**

### 二. Object的变化侦听

借助Object.defineProperty() 对数据的读取和改写进行“侦听”

```js
let obj = {
  foo: 'fooo',
  bar: 'barr'
}
let val = 'fooooo'
Object.defineProperty(obj, 'foo', {
  enumerable: true,
  configurable: true,
  get(){
    console.log('foo属性被读取了')
    return val
  },
  set(newVal){
    console.log('foo属性被修改了')
    val = newVal
  }
})
```



```js
// 源码位置：src/core/observer/index.js

/**
 * Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */
export class Observer {
  constructor (value) {
    this.value = value
    // 给value新增一个__ob__属性，值为该value的Observer实例
    // 相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作
    def(value,'__ob__',this)
    if (Array.isArray(value)) {
      // 当value为数组时的逻辑
      // ...
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}
/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 对象
 * @param { String } key 对象的key
 * @param { Any } val 对象的某个key的值
 */
function defineReactive (obj,key,val) {
  // 如果只传了obj和key，那么val = obj[key]
  if (arguments.length === 2) {
    val = obj[key]
  }
  if(typeof val === 'object'){
      new Observer(val)
  }
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get(){
      console.log(`读取key: ${key}, value: ${val}`);
      return val;
    },
    set(newVal){
      if(val === newVal){
          return
      }
      console.log(`修改${key}, value: ${newVal}`);
      val = newVal;
    }
  })
}
```

### 三. 数组的变化侦听

1. Object.defineProperty可以监控到数组下标的变化

```js
function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
     get: function defineGet() {
      console.log(`读取key: ${key}, value: ${value}`)
      return value
    },
     set: function defineSet(newVal) {
      console.log(`修改key: ${key}, value: ${newVal}`)
      value = newVal
    }
  })
}

function observe(data) {
  Object.keys(data).forEach(function(key) {
    defineReactive(data, key, data[key])
  })
}

let arr = [1, 2, 3]
observe(arr)
```

![WX20200325-112020@2x](/Users/changli/Downloads/WX20200325-112020@2x.png)

2. push方法

![WX20200325-112114@2x](/Users/changli/Downloads/WX20200325-112114@2x.png)

3. pop方法

   ![WX20200325-120949@2x](/Users/changli/Downloads/WX20200325-120949@2x.png)

4. shift方法

![WX20200325-112425@2x](/Users/changli/Downloads/WX20200325-112425@2x.png)

5. unshift方法

![WX20200325-115930@2x](/Users/changli/Downloads/WX20200325-115930@2x.png)

#### **总结：** 

数组其实就是对象，索引相当于key，元素是value。所以Object.definePropery可以侦听到初始数组下标对应的元素。

1. **通过索引访问或设置对应元素的值时，可以触发 getter 和 setter **

2. **push和unshift增加了索引，对于新增加的需要额外处理。**

3. **pop和shift删除了元素，删除并更新了索引，也会触发getter和setter**

![WX20200325-121625@2x](/Users/changli/Downloads/WX20200325-121625@2x.png)

![WX20200325-121655@2x](/Users/changli/Downloads/WX20200325-121655@2x.png)

![WX20200325-121751@2x](/Users/changli/Downloads/WX20200325-121751@2x.png)

![WX20200325-123210@2x](/Users/changli/Downloads/WX20200325-123210@2x.png)

![WX20200325-123232@2x](/Users/changli/Downloads/WX20200325-123232@2x.png)

通过拦截7中方法的“侦听”，有一点不足，直接通过索引更改数组元素不能被“侦听”。