# 扩展 layui 的权限树 authtree

layui自身提供一个tree树形菜单，但是并不适用于权限控制中，比如：选择用户组的权限（树形结构），需要使用form表单提交用户所选权限数据。

项目中遇到了此类需求，所以特意封装了一个扩展用于渲染此类操作。

>  特别注意：权限树的渲染目标需要在 .layui-form .layui-item下，否则将无法渲染出样式。

## 功能演示：

![功能演示](http://cdn.layui.com/upload/2018_3/11634672_1521798883089_97713.gif)

## 功能概览：

1. 支持无限级渲染结构树
2. 点击深层次节点，父级节点中没有被选中的节点会被自动选中
3. 单独点击父节点，子节点会全部 选中/去选中
4. 支持默认选中（适用于编辑权限）
5. 支持自定义表单名称（上传数据的name）
6. 支持自定义lay-filter用于监听权限树选中(v0.2新增)
7. 支持获取选中叶子结点信息(v0.2新增)

## 使用方法：

> 注意：此扩展需先引入layui.js方可正常使用。demo详见index.html

##### js使用样例：

```javascript
// 注：extends/为authtree.js的存放路径
layui.config({
	base: 'extends/',
}).extend({
	authtree: 'authtree',
});
// 一般是异步调用
layui.use(['jquery', 'authtree', 'form'], function(){
	var $ = layui.jquery;
	var authtree = layui.authtree;
	var form = layui.form;
	$.ajax({
		url: 'tree.json',
		dataType: 'json',
		success: function(data){
			// 渲染时传入渲染目标ID，树形结构数据（具体结构看样例，checked表示默认选中），以及input表单的名字
			authtree.render('#LAY-auth-tree-index', data.data.trees, {inputname: 'authids[]', layfilter: 'lay-check-auth', openall: false});

			// 监听自定义lay-filter选中状态，PS:layui现在不支持多次监听，所以扩展里边只能改变触发逻辑，然后引起了事件冒泡延迟的BUG，要是谁有好的建议可以反馈我
			form.on('checkbox(lay-check-auth)', function(data){
                // 获取所有节点
				var all = authtree.getAll('#LAY-auth-tree-index');
				console.log('all', all);
				// 获取所有已选中节点
				var checked = authtree.getChecked('#LAY-auth-tree-index');
				console.log('checked', checked);
				// 获取所有未选中节点
				var notchecked = authtree.getNotChecked('#LAY-auth-tree-index');
				console.log('notchecked', notchecked);
				// 注意这里：需要等待事件冒泡完成，不然获取叶子节点不准确。
				setTimeout(function(){
					// 获取选中的叶子节点
					var leaf = authtree.getLeaf('#LAY-auth-tree-index');
					console.log(leaf);
				}, 100);
			});
		}
	})
});
```

##### 权限树返回样例：

> name是节点名称，value是需要上传的值（如：菜单id），checked控制是否默认选中，list内部是子节点。

```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "trees":[
    	{"name": "用户管理", "value": "xsgl", "checked": true, "list": [
    		{"name": "用户组", "value": "xsgl-basic", "checked": true, "list": [
    			{"name": "本站用户", "value": "xsgl-basic-xsxm", "checked": true, "list": [
    				{"name": "用户列表", "value": "xsgl-basic-xsxm-readonly", "checked": true},
    				{"name": "新增用户", "value": "xsgl-basic-xsxm-editable", "checked": false}
    			]},
                {"name": "第三方用户", "value": "xsgl-basic-xsxm", "checked": true, "list": [
                    {"name": "用户列表", "value": "xsgl-basic-xsxm-readonly", "checked": true}
                ]}
    		]}
    	]},
    	{"name": "用户组管理", "value": "sbgl", "checked": true, "list": [
    		{"name": "角色管理", "value": "sbgl-sbsjlb", "checked": true, "list":[
    			{"name": "添加角色", "value": "sbgl-sbsjlb-dj", "checked": true},
    			{"name": "角色列表", "value": "sbgl-sbsjlb-yl", "checked": false}
    		]},
            {"name": "管理员管理", "value": "sbgl-sbsjlb", "checked": true, "list":[
                {"name": "添加管理员", "value": "sbgl-sbsjlb-dj", "checked": true},
                {"name": "管理员列表", "value": "sbgl-sbsjlb-yl", "checked": false}
            ]}
    	]}
    ]
  }
}
```

##### Demo说明：

index.html			页面文件+JS处理文件

tree.json			模拟权限树数据

extends/authtree.js	权限树扩展

layui/				官网下载的layui

## 更新记录：

2018-05-03 v0.4 新增获取全部数据、全部已选数据、全部未选数据方法，修复编码问题。

2018-05-03 v.03 新增默认展开全部的配置项(openall)，并将部分配置项作为可选参数通过对象传递。

2018-03-30 v0.2 修复一级菜单没有子菜单时，显示错位的问题，支持获取叶子结点数据，支持自定义lay-filter

2018-03-24 v0.1 最初版本