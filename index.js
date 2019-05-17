// 需要查看相关DEMO的时候，搜索相关函数即可，比如：全选则搜索 checkAll，列表转树搜索 listConvert
layui.config({
  base: 'layui_exts/',
}).extend({
  authtree: 'authtree',
});

// 获取最大深度样例
function getMaxDept(dst){
  layui.use(['jquery', 'layer', 'authtree'], function(){
    var layer = layui.layer;
    var authtree = layui.authtree;

    layer.alert('树'+dst+'的最大深度为：'+authtree.getMaxDept(dst));
  });
}
// 全选样例
function checkAll(dst){
  layui.use(['jquery', 'layer', 'authtree'], function(){
    var layer = layui.layer;
    var authtree = layui.authtree;

    authtree.checkAll(dst);
  });
}
// 全不选样例
function uncheckAll(dst){
  layui.use(['jquery', 'layer', 'authtree'], function(){
    var layer = layui.layer;
    var authtree = layui.authtree;

    authtree.uncheckAll(dst);
  });
}
// 显示全部
function showAll(dst){
  layui.use(['jquery', 'layer', 'authtree'], function(){
    var layer = layui.layer;
    var authtree = layui.authtree;

    authtree.showAll(dst);
  });
}
// 隐藏全部
function closeAll(dst){
  layui.use(['jquery', 'layer', 'authtree'], function(){
    var layer = layui.layer;
    var authtree = layui.authtree;

    authtree.closeAll(dst);
  });
}
// 获取节点状态
function getNodeStatus(dst){
  layui.use(['jquery', 'layer', 'authtree', 'laytpl'], function(){
    var layer = layui.layer;
    var $ = layui.jquery;
    var authtree = layui.authtree;
    var laytpl = layui.laytpl;

    // 获取所有节点
    var all = authtree.getAll(dst);
    // 获取所有已选中节点
    var checked = authtree.getChecked(dst);
    // 获取所有未选中节点
    var notchecked = authtree.getNotChecked(dst);
    // 获取选中的叶子节点
    var leaf = authtree.getLeaf(dst);
    // 获取最新选中
    var lastChecked = authtree.getLastChecked(dst);
    // 获取最新取消
    var lastNotChecked = authtree.getLastNotChecked(dst);

    var data = [
      {func: 'getAll', desc: '获取所有节点', data: all},
      {func: 'getChecked', desc: '获取所有已选中节点', data: checked},
      {func: 'getNotChecked', desc: '获取所有未选中节点', data: notchecked},
      {func: 'getLeaf', desc: '获取选中的叶子节点', data: leaf},
      {func: 'getLastChecked', desc: '获取最新选中', data: lastChecked},
      {func: 'getLastNotChecked', desc: '获取最新取消', data: lastNotChecked},
    ];

    var string =  laytpl($('#LAY-auth-tree-nodes').html()).render({
      data: data,
    });
    layer.open({
      title: '节点状态'
      ,content: string
      ,area: '800px'
      ,tipsMore: true
    });
    $('body').unbind('click').on('click', '.LAY-auth-tree-show-detail', function(){
      layer.open({
        type: 1,
        title: $(this).data('title')+'-节点详情',
        content: '['+$(this).data('content')+']',
        tipsMore: true
      });
    });
  });
}
// 显示到某层
function showDept(dst) {
  layui.use(['layer', 'authtree', 'jquery'], function(){
    var jquery = layui.jquery;
    var layer = layui.layer;
    var authtree = layui.authtree;

    layer.prompt({title: '显示到某层'}, function(value, index, elem) {
      authtree.showDept(dst, value);
      layer.close(index);
    });
  });
}
// 关闭某层以后的所有层
function closeDept(dst) {
  layui.use(['layer', 'authtree', 'jquery'], function(){
    var jquery = layui.jquery;
    var layer = layui.layer;
    var authtree = layui.authtree;

    layer.prompt({title: '关闭某层以后的所有层'}, function(value, index, elem) {
      authtree.closeDept(dst, value);
      layer.close(index);
    });
  });
}
// 树转下拉树
function treeConvertSelect(url) {
  layui.use(['layer', 'authtree', 'jquery', 'form', 'code', 'laytpl'], function(){
    var $ = layui.jquery;
    var layer = layui.layer;
    var authtree = layui.authtree;
    var form = layui.form;
    var laytpl = layui.laytpl;

    layer.open({
      title: '树转下拉树演示'
      ,content: '<div id="LAY-auth-tree-convert-select-dom"></div>'
      ,area: ['800px', '400px']
      ,tipsMore: true
      ,success: function() {
        $.ajax({
          url: url,
          dataType: 'json',
          success: function(res){
            // 更多传入参数及其具体意义请查看文档
            var selectList = authtree.treeConvertSelect(res.data.trees, {
              childKey: 'list',
              // checkedKey: ['glygl-tjgly'],
            });
            console.log(selectList);
            // 渲染单选框
            var string =  laytpl($('#LAY-auth-tree-convert-select').html()).render({
              // 为了 layFilter 的唯一性，使用模板渲染的方式传递
              layFilter: 'LAY-auth-tree-convert-select-input',
              list: selectList,
              code: JSON.stringify(res, null, 2),
            });
            $('#LAY-auth-tree-convert-select-dom').html(string);
            layui.code({
              title: '返回的树状数据'
            });
            form.render('select');
            // 使用form.on('select(LAY-FILTER)')监听选中
            form.on('select(LAY-auth-tree-convert-select-input)', function(data){
              console.log('选中信息', data);
            });
          },
          error: function(xml, errstr, err) {
            layer.alert(errstr+'，获取样例数据失败，请检查是否部署在本地服务器中！');
          }
        });
      }
    });
  });
}
function hideChooseSelect(url) {
  layui.use(['layer', 'laytpl', 'authtree', 'jquery', 'form', 'code'], function(){
    var $ = layui.jquery;
    var layer = layui.layer;
    var authtree = layui.authtree;
    var form = layui.form;
    var laytpl = layui.laytpl;


    $.ajax({
      url: url,
      dataType: 'json',
      success: function(res){
        var trees = res.data.trees;
        var content = laytpl($('#LAY-auth-tree-hide-choose').html()).render({
          // 为了 渲染ID 的唯一性，使用模板渲染的方式传递
          hideChooseDomId: 'LAY-auth-tree-hide-choose-dom',
        });

        // 弹框展示
        layer.open({
          title: '隐藏左侧操作演示'
          ,content: content
          ,area: ['800px', '400px']
          ,tipsMore: true
          ,success: function() {
            layui.code({
            });
            // 如果页面中多个树共存，需要注意 layfilter 需要不一样，否则触发事件会混乱
            authtree.render('#LAY-auth-tree-hide-choose-dom', trees, {
              layfilter: 'LAY-auth-tree-hide-choose-input',
              openall: true,
              theme: 'auth-skin-default',
              hidechoose: true,// 关键配置
              autowidth: true,
            });
          }
        });
      },
      error: function(xml, errstr, err) {
        layer.alert(errstr+'，获取样例数据失败，请检查是否部署在本地服务器中！');
      }
    });

  });
}
// 转换列表
function listConvert(url) {
  layui.use(['layer', 'laytpl', 'authtree', 'jquery', 'form', 'code'], function(){
    var $ = layui.jquery;
    var layer = layui.layer;
    var authtree = layui.authtree;
    var form = layui.form;
    var laytpl = layui.laytpl;


    $.ajax({
      url: url,
      dataType: 'json',
      success: function(res){
        // 支持自定义递归字段、数组权限判断等
        // 深坑注意：如果API返回的数据是字符串，那么 startPid 的数据类型也需要是字符串
        var trees = authtree.listConvert(res.data.list, {
          primaryKey: 'alias'
          ,startPid: '0'
          ,parentKey: 'palias'
          ,nameKey: 'name'
          ,valueKey: 'alias'
          ,checkedKey: res.data.checkedAlias
          ,disabledKey: res.data.disabledAlias
        });
        var content = laytpl($('#LAY-auth-tree-list-convert').html()).render({
          // 为了 渲染ID 的唯一性，使用模板渲染的方式传递
          layId: 'LAY-auth-list-convert-index',
          code: JSON.stringify(res, null, 2),
          codeAns: JSON.stringify(trees, null, 2)
        });

        // 弹框展示
        layer.open({
          title: '列表转树演示'
          ,content: content
          ,area: ['800px', '400px']
          ,tipsMore: true
          ,success: function() {
            layui.code({
            });
            // 如果页面中多个树共存，需要注意 layfilter 需要不一样，否则触发事件会混乱
            authtree.render('#LAY-auth-list-convert-index', trees, {
              inputname: 'authids[]',
              layfilter: 'LAY-auth-list-convert-input',
              theme: 'auth-skin-default',
              // openall: true,
              autowidth: true,
            });
          }
        });
      },
      error: function(xml, errstr, err) {
        layer.alert(errstr+'，获取样例数据失败，请检查是否部署在本地服务器中！');
      }
    });

  });
}
/**
 * 加群交流弹窗
 * @return {[type]} [description]
 */
function groupAdd() {
  layui.use(['laytpl', 'layer', 'jquery'], function(){
    var laytpl = layui.laytpl;
    var layer = layui.layer;
    var $ = layui.jquery;

    var content = laytpl($('#LAY-auth-tree-group-add').html()).render({});
    layer.open({
      title: "加群交流"
      ,area: ['300px', '450px']
      ,content: content
    });
  });
}
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
        inputname: 'ids[]'
        ,layfilter: 'lay-check-auth'
        // ,dblshow: true
        // ,dbltimeout: 180
        // ,autoclose: false
        // ,autochecked: false
        // ,openchecked: false
        // ,openall: true
        // ,hidechoose: true
        // ,checkType: 'radio'
        // ,checkedKey: 'checked'
        // ,disabledKey: 'disabled'
        // ,checkSkin: 'primary'
        ,'theme': 'auth-skin-default'
        // ,'themePath': 'themes/'
        ,autowidth: true
      });

      // PS:使用 form.on() 会引起了事件冒泡延迟的BUG，需要 setTimeout()，并且无法监听全选/全不选
      // PS:如果开启双击展开配置，form.on()会记录两次点击事件，authtree.on()不会
      /*			form.on('checkbox(lay-check-auth)', function(data){
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
      */			// 使用 authtree.on() 不会有冒泡延迟
      authtree.on('change(lay-check-auth)', function(data) {
        console.log('监听 authtree 触发事件数据', data);
        // 获取所有节点
        var all = authtree.getAll('#LAY-auth-tree-index');
        // 获取所有已选中节点
        var checked = authtree.getChecked('#LAY-auth-tree-index');
        // 获取所有未选中节点
        var notchecked = authtree.getNotChecked('#LAY-auth-tree-index');
        // 获取选中的叶子节点
        var leaf = authtree.getLeaf('#LAY-auth-tree-index');
        // 获取最新选中
        var lastChecked = authtree.getLastChecked('#LAY-auth-tree-index');
        // 获取最新取消
        var lastNotChecked = authtree.getLastNotChecked('#LAY-auth-tree-index');
        console.log(
          'all', all,"\n",
          'checked', checked,"\n",
          'notchecked', notchecked,"\n",
          'leaf', leaf,"\n",
          'lastChecked', lastChecked,"\n",
          'lastNotChecked', lastNotChecked,"\n"
        );
      });
      authtree.on('deptChange(lay-check-auth)', function(data) {
        console.log('监听到显示层数改变',data);
      });
      authtree.on('dblclick(lay-check-auth)', function(data) {
        console.log('监听到双击事件',data);
      });
    },
    error: function(xml, errstr, err) {
      layer.alert(errstr+'，获取样例数据失败，请检查是否部署在本地服务器中！');
    }
  });
  // 表单提交样例
  form.on('submit(LAY-auth-tree-submit)', function(obj){
    var authids = authtree.getChecked('#LAY-auth-tree-index');
    console.log('Choosed authids is', authids);
    // obj.field.authids = authids;
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
