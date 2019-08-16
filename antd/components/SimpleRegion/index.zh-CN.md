---
title: SimpleGeographic
subtitle: 地区选择组件
---

全国省市区筛选的组件。

## API

### SimpleGeographic

参数 | 说明 | 类型 | 默认值 | 例子
----|------|-----|------|------
other | 因为使用antD的Cascader组件实现,所以可继承该组件所有属性及方法,但要写到本参数内 | object | - |  {onPopupVisibleChange:(visible)=>{}}
filtered | 过滤,可对省市区进行过滤  | object | - | {province:['山东省'],city:['济南市'],county:['历下区']}
onChange | 选择完成后的回调 | (value,selectedOptions)=>void | - | onChange={(data)=>{}}

#### filtered 中的字段

参数 | 说明 | 类型 | 默认值 | 例子
----|------|-----|------|------
province | 省列表  | string[] | - | ['山东省']
city | 市列表  | string[] | - | ['济南市']
county | 区列表  | string[] | - | ['历下区']



### SimpleGeographic.SimpleRegionTown

参数 | 说明 | 类型 | 默认值 | 例子
----|------|-----|------|------
other | 因为使用antD的Select组件实现,所以可继承该组件所有属性及方法,但要写到本参数内 | object | - |  {allowClear:false}
county | 区对象 | object | - |  {code:370102,name:'历下区'}
onChange | 选择完成后的回调 | (value,selectedOptions)=>void | - | onChange={(data)=>{}}

#### county 中的字段

参数 | 说明 | 类型 | 默认值 | 例子
----|------|-----|------|------
code | 区code  | number | - | 370102
name | 区名称  | string | - | 历下区

