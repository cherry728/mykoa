
---
Vue**生命周期流程**
<!-- more -->


声明$parent, $root, $children, $refs, $slot, $createElement()

**beforeCreate**

inject

**数据响应式化**

provide

**created**

$el

**beforeMount**

**new** **Watcher**() => 调用updateComponent()

_render() 【**Compiler**生成vnode树】=> render方法在执行中，读取数据，通过get方法收集依赖**Dep**

_update() ：

1. 判断是初始化还是更新，此时的$el是真实dom 。
2. patch($el)是初始化：
   1. oldVnode是根节点（真实dom）
   2. vnode是render函数刚刚创建的虚拟dom 
   3. createElm给vnode绑定真实dom（vnode.elm => 真实dom）
   4. 插入parentElm.insert(vnode.elm)

**Mounted**

如有更新，先get，然后set，通过依赖进行通知，调用update方法，启动一个**微任务**

**beforeUpdate**

**Watcher.run**

_render() => _update() => patch => patchVnode

patch（有prevVnode是更新）

1. 更改数据，执行_render()，得到vnode
2. oldVnode的elm是真实dom

patchVnode: 从根节点开始，获取两棵树的children，updateChildren（4个指针，4个节点，指针后移，同级比较，深度优先，比根节点然后比孩子，到text节点之间node.textContent = newText）