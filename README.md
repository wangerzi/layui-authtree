# 扩展 layui 的权限树 authtree

layui自身提供一个tree树形菜单，但是并不适用于权限控制中，比如：选择用户组的权限（树形结构），需要使用form表单提交用户所选权限数据。

项目中遇到了此类需求，所以特意封装了一个扩展用于渲染此类操作。

>  特别注意：权限树的渲染目标需要在 .layui-form .layui-item下，否则将无法渲染出样式。

> 环境提示：预览环境需要部署在服务器下，不然无法异步获取权限树的数据

## 功能演示：

![功能演示](http://thyrsi.com/t6/375/1537686725x-1566680256.gif)

## 期望收集

- [x] 全选-全不选功能
- [x] 显示到某层的功能（展开全部/收起全部）
- [x] 最新添加/最新取消节点
- [ ] 样例添加搜索功能
- [x] 普通列表转权限树功能
- [ ] 权限树以适合单选框的形式转义(半完成)
- [x] 配置新增“取消级联选中”功能
- [x] 树节点双击打开/关闭
- [x] 支持对勾选的进行展开，而不是整个树
- [ ] 新增toolbar，用于扩展权限控制的操作

## 快速上手

> 由于插件规模扩大和功能的增加，导致插件上手难度有一定的增加。但如果只使用核心功能，其实没有必要去研究插件的所有方法，故在此把此插件解决核心需求的方法展示出来。

#### 第一步：为权限树提供容器

> 注意：`id="LAY-auth-tree-index"` 是整颗树的容器，需要包含在 `form.layui-form > div.layui-form-item > div.layui-input-block` 中，否则依照 layui 的规则无法渲染多选框

```html
<form class="layui-form">
    <div class="layui-form-item">
        <label class="layui-form-label">角色名称</label>
        <div class="layui-input-block">
            <input class="layui-input" type="text" name="name" placeholder="请输入角色名称" />
        </div>
    </div>
    <div class="layui-form-item">
        <label class="layui-form-label">选择权限</label>
        <div class="layui-input-block">
            <div id="LAY-auth-tree-index"></div>
        </div>
    </div>
    <div class="layui-form-item">
        <div class="layui-input-block">
            <button class="layui-btn" type="submit" lay-submit lay-filter="LAY-auth-tree-submit">提交</button>
            <button class="layui-btn layui-btn-primary" type="reset">重置</button>
        </div>
    </div>
</form>
```

#### 第二步：下载源码并引入插件

如果使用 `layuiadmin`,则只需要将插件放到 `controller/`下,然后 `layui.use` 即可,或者可以放在 `lib/extend` 中,只不过需要改 `config.js`

```javascript
layui.config({
	base: 'extends/',
}).extend({
	authtree: 'authtree',
});
```

#### 第三步：异步获取权限数据并渲染

render 传递的第一个参数，即为树的目标容器，这也是以后操作这颗树的重要标志

listConvert 是 authtree 提供的内置函数，可以将普通的列表数据转换为 权限树需要的数据结构，如有此需求请查看该函数对应文档

```javascript
layui.use(['jquery', 'authtree', 'form', 'layer'], function(){
	var $ = layui.jquery;
	var authtree = layui.authtree;
	var form = layui.form;
	var layer = layui.layer;
	// 一般来说，权限数据是异步传递过来的
	$.ajax({
		url: 'tree.json',
		dataType: 'json',
		success: function(data){
            var trees = data.data.trees;
            // 如果后台返回的不是树结构，请使用 authtree.listConvert 转换
            authtree.render('#LAY-auth-tree-index', trees, {
				inputname: 'authids[]', 
				layfilter: 'lay-check-auth', 
				autowidth: true,
			});
        }
    });
});
```

至此，一个最基础的权限树就已经完成了，如果想实现演示GIF内的各种扩展功能，请继续往下看，并参考源码。

## 数据库设计和后台程序参考

正在完善中....

## 函数列表

| 函数名                      | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| **render(dst, trees, opt)** | 初始化一棵权限树                                             |
| **listConvert(list, opt)**  | 将普通列表无限递归转换为树（opt参数可配置项，请参考下方参数配置） |
| getMaxDept(dst)             | 获取树的最大深度                                             |
| **checkAll(dst)**           | 全选所有节点                                                 |
| **uncheckAll(dst)**         | 取消选中所有节点                                             |
| showAll(dst)                | 显示整颗树                                                   |
| closeAll(dst)               | 关闭整颗树                                                   |
| toggleAll(dst)              | 树的显示/关闭切换                                            |
| showDept(dst, dept)         | 显示此树到第 dept 层                                         |
| closeDept(dst, dept)        | 第 dept 层之后全部关闭                                       |
| getLeaf(dst)                | 获取叶子节点（form.on()需延迟获取）                          |
| getAll(dst)                 | 获取所有节点数据（form.on()需延迟获取）                      |
| getLastChecked(dst)         | 最新选中节点数据（之前未选-现在选中）（form.on()需延迟获取） |
| getChecked(dst)             | 获取所有选中节点的数据（form.on()需延迟获取）                |
| getLastNotChecked(dst)      | 最新取消（之前选中-现在未选）（form.on()需延迟获取）         |
| getNotChecked(dst)          | 获取未选中数据（form.on()需延迟获取）                        |

## 参数配置

##### render 参数配置

render()函数是本插件的核心方法，调用 `render(dst, trees, opt)` 函数时，opt 中可以传递的参数如下

| 参数名          | 描述                                                         | 默认      |
| --------------- | ------------------------------------------------------------ | --------- |
| **inputname**   | 上传上去的 input 表单的name                                  | menuids[] |
| openchecked     | 自动显示选中的节点                                           | false     |
| layfilter       | input 元素的 layfilter，可通过 authtree.on('change(layfilter)') 监听 | checkauth |
| openall         | 是否初始化显示全部                                           | false     |
| **dblshow**     | 双击展开节点                                                 | false     |
| dbltimeout      | 双击展开节点延迟(最好不要超过300，不然单击延迟会比较高)      | 180       |
| **autochecked** | 选中节点后,是否自动选中直属父级并且选中所有子节点            | true      |
| **autoclose**   | 取消节点选中后,是否自动取消父级选中(当兄弟节点均为选中时)    | true      |

> **自动选中父级节点和自动取消父级选中 具体描述：**
>
> 自动选中父级节点：开启后，选中某节点，会将其上层所有未选中父节点设为选中，并且将其下层所有节点设为选中；取消选中某节点，其所有子节点均取消。
>
> 自动取消父级节点：开启后，取消选中某一子节点，当其兄弟节点均处于未选中状态，自动取消父级节点
>
>
>
> 两种状态一般同时开启，或者同时关闭，不然可能体验有点奇怪

##### listConvert 参数配置

listConvert 是用于转换列表和树结构的方法，参数比较灵活，调用 `listConvert(list, opt)` 时，opt可传入参数如下

| 参数名         | 描述                                       | 默认值  |
| -------------- | ------------------------------------------ | ------- |
| **primaryKey** | 主键                                       | id      |
| **parentKey**  | 父级id对应键                               | pid     |
| nameKey        | 节点标题对应的key                          | name    |
| valueKey       | 节点值对应的key                            | id      |
| **checkedKey** | 节点是否选中的字段（支持 String 和 Array） | checked |

> **关于 checkedKey 参数的设计：**
>
> 权限树的初始化选中是为 “编辑权限” 这个场景开发的，编辑权限的时候，从 角色-权限表 读取某个角色对应的权限信息，所以读取出来的结果是某个角色的权限id列表。
>
> 判断节点是否应该处于选中状态，就是判断这个节点的id 是否在 查找出来的权限id列表中，基于这个想法，我把 checkedKey 设计为可传入 字符/数组，用以简化后台数据处理流程。
>
> 如果 checkedKey 为字符串，则直接将 list 中对应**checkedKey**对应字段隐射到 节点的 checked 字段中去；如果为数组，则会判断**valueKey**对应字段是否在 **checkedKey** 数组里边。

##### 后台编辑权限API代码示例（PHP）

```php
<?php
$role_id = $_GET['role_id'];
$auth_list = .....;// 获取数据库中 权限表数据
$role_auth_list = ....;// 获取数据库中某个角色的 角色-权限表数据

$data = [
    'code' => 0,
    'msg'  => '获取成功',
    'data' => [
        'list' => $auth_list,
        'checkedId' => array_column($role_auth_list, 'authid'),
    ],
];
echo json_encode($data);
```

##### API返回数据示例

```json
{
  "code": 0,
  "msg": "获取成功",
  "data": {
    "list": [
      { "id": 1, "name": "用户管理", "pid": 0 },
      { "id": 2, "name": "用户组管理", "pid": 0 },
      { "id": 3, "name": "角色管理", "pid": 2 },
      { "id": 4, "name": "添加角色", "pid":  3},
      { "id": 5, "name": "角色列表", "pid": 3 },
      { "id": 6, "name": "管理员管理", "pid": 0 },
      { "id": 7, "name": "添加管理员", "pid": 6 },
      { "id": 8, "name": "管理员列表", "pid": 6 }
    ],
    "checkedId": [ 1,  2, 3, 4 ]
  }
}
```

##### 前端使用样例

这里注意 `startPid` 参数的数据类型需要和列表返回的一致，`id` 和 `pid` 的数据类型需一致，如果列表返回的id数据均为字符串，则 startPid 应该为 `'0'`

```javascript
var trees = authtree.listConvert(res.data.list, {
    primaryKey: 'id'
    ,startPid: 0
    ,parentKey: 'pid'
    ,nameKey: 'name'
    ,valueKey: 'id'
    ,checkedKey: res.data.checkedId
});
```

## 监听事件

| 事件名称   | 描述                                               | 样例                                 |
| ---------- | -------------------------------------------------- | ------------------------------------ |
| change     | 监听节点树节点选中状态改变(包括全选等)             | authtree.on('change(layfilter)')     |
| checkAll   | 监听全选(目前仅限手动操作的全选)                   | authtree.on('checkAll(layfilter)')   |
| uncheckAll | 监听全不选(目前仅限手动操作的全不选)               | authtree.on('uncheckAll(layfilter)') |
| deptChange | 监听层数改变（包括点击、展开、关闭、全部展开关闭） | authtree.on('deptChange(layfilter)') |

## 功能概览：

1. 支持无限级渲染结构树
2. 点击深层次节点，父级节点中没有被选中的节点会被自动选中
3. 单独点击父节点，子节点会全部 选中/去选中
4. 支持默认选中（适用于编辑权限）
5. 支持自定义表单名称（上传数据的name）
6. 支持自定义lay-filter用于监听权限树选中(v0.2新增)
7. 支持获取选中叶子结点信息(v0.2新增)
8. 自适应标签名字长度配置(v0.5新增)
9. 支持各种方式花样获取数据（v1.0 新增，具体参考函数表）
10. 支持普通列表转树(v1.1 支持)
11. 支持自动展开所有选中节点(v1.1 支持)
12. 支持列表转树(v1.1 支持)
13. 支持双击展开子节点(v1.1 支持)

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
layui.use(['jquery', 'authtree', 'form', 'layer'], function(){
	var $ = layui.jquery;
	var authtree = layui.authtree;
	var form = layui.form;
	var layer = layui.layer;
	// 初始化
	$.ajax({
		url: 'tree.json',
		dataType: 'json',
		success: function(data){
			// 渲染时传入渲染目标ID，树形结构数据（具体结构看样例，checked表示默认选中），以及input表单的名字
			authtree.render('#LAY-auth-tree-index', data.data.trees, {
				inputname: 'authids[]', 
				layfilter: 'lay-check-auth', 
				// openall: true,
				autowidth: true,
			});

			// PS:使用 form.on() 会引起了事件冒泡延迟的BUG，需要 setTimeout()，并且无法监听全选/全不选
			form.on('checkbox(lay-check-auth)', function(data){
				// 注意这里：需要等待事件冒泡完成，不然获取叶子节点不准确。
				setTimeout(function(){
					console.log('监听 form 触发事件数据', data);
					// 获取选中的叶子节点
					var leaf = authtree.getLeaf('#LAY-auth-tree-index');
					console.log('leaf', leaf);
					// 获取最新选中
					var lastChecked = authtree.getLastChecked('#LAY-auth-tree-index');
					console.log('lastChecked', lastChecked);
					// 获取最新取消
					var lastNotChecked = authtree.getLastNotChecked('#LAY-auth-tree-index');
					console.log('lastNotChecked', lastNotChecked);
				}, 100);
			});
			// 使用 authtree.on() 不会有冒泡延迟
			authtree.on('change(lay-check-auth)', function(data) {
				console.log('监听 authtree 触发事件数据', data);
				// 获取所有节点
				var all = authtree.getAll('#LAY-auth-tree-index');
				console.log('all', all);
				// 获取所有已选中节点
				var checked = authtree.getChecked('#LAY-auth-tree-index');
				console.log('checked', checked);
				// 获取所有未选中节点
				var notchecked = authtree.getNotChecked('#LAY-auth-tree-index');
				console.log('notchecked', notchecked);
				// 获取选中的叶子节点
				var leaf = authtree.getLeaf('#LAY-auth-tree-index');
				console.log('leaf', leaf);
				// 获取最新选中
				var lastChecked = authtree.getLastChecked('#LAY-auth-tree-index');
				console.log('lastChecked', lastChecked);
				// 获取最新取消
				var lastNotChecked = authtree.getLastNotChecked('#LAY-auth-tree-index');
				console.log('lastNotChecked', lastNotChecked);
			});
			authtree.on('deptChange(lay-check-auth)', function(data) {
				console.log('监听到显示层数改变',data);
			});
		}
	});
	form.on('submit(LAY-auth-tree-submit)', function(obj){
		var authids = authtree.getAll('#LAY-auth-tree-index');
		console.log('Choosed authids is', authids);
		obj.field.authids = authids;
		$.ajax({
			url: 'tree.json',
			dataType: 'json',
			data: obj.field,
			success: function(res){
				layer.alert('提交成功！');
			}
		});
		return false;
	});
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

2018-09-23 v1.1 新增自动展开所有选中节点,列表转树,支持双击展开子节点等方法,消除BUG

2018-09-23 v1.0 正式版，方法效率优化以及新增监听事件，消除各种BUG

2018-09-19 v1.0 预览版，完善权限树的方法，新增方法请见函数列表和演示样例

2018-09-06 v0.5 新增authwidth参数用于适应节点名称宽度，默认true

2018-05-03 v0.4 新增获取全部数据、全部已选数据、全部未选数据方法，修复编码问题。

2018-05-03 v.03 新增默认展开全部的配置项(openall)，并将部分配置项作为可选参数通过对象传递。

2018-03-30 v0.2 修复一级菜单没有子菜单时，显示错位的问题，支持获取叶子结点数据，支持自定义lay-filter

2018-03-24 v0.1 最初版本

## 特别感谢

##### layui社区:

感谢 [Xiao情子](https://fly.layui.com/u/13405224/)、[挽手说梦话](https://fly.layui.com/u/15279936/)、[呆呆17](https://fly.layui.com/u/21441168/)、[空痕影](https://fly.layui.com/u/24549336/)、[mmmmargin](https://fly.layui.com/u/16231488/)、[Son](https://fly.layui.com/u/10266648/)、[夏诺](https://fly.layui.com/u/7003752/)、[尧仙子](https://fly.layui.com/u/7185864/)、[徐俊](https://fly.layui.com/u/6566280/)、[IBean](https://fly.layui.com/u/4473336/) 等童鞋提供的建议

##### github:

感谢 [adminpass](https://github.com/adminpass) 、[MrZhouL](https://github.com/MrZhouL) 等人提供的建议