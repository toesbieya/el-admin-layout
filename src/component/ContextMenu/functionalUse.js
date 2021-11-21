import Vue from 'vue'
import ContextMenu from './index'

/**
 * 函数形式创建右键菜单
 * 注意！每次调用时都会创建一个新的实例，需要自行销毁上一次产生的实例
 *
 * @param items {{content:string,click:function}[]} 菜单数组
 * @param options {{left:number,top:number,minDistance?:number}} 配置项
 * @return {function} 关闭右键菜单的方法
 */
export default function(items, options) {
  const ctor = Vue.extend(ContextMenu)
  const instance = new ctor({ propsData: { value: true, items, ...options } })

  instance.$mount()
  instance.$once('input', value => {
    if (!value) {
      instance.$destroy()
      document.body.removeChild(instance.$el)
    }
  })
  document.body.appendChild(instance.$el)

  return () => instance.close()
}
