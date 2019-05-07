# 参与主题定制

## 主题开发规范

- 主题的名称均按照 `auth-skin-自定义名称` 的规则进行，禁止中文，因为会造成部分服务器加载失败，比如 `auth-skin-bob`、`auth-skin-shark`、`auth-skin-deepblue`
- 主题的文件均放在 `layui_exts/tree_themes/` 目录下，主题的名称与CSS的名称需要完全一致，否则主题文件自动加载会失效，比如名称叫做 `auth-skin-bob`，样式文件路径为 `layui_exts/tree_themes/auth-skin-bob`
- 每个主题样式必须指定作用域，作用域均为 `.auth-skin-自定义名称`，比如 `auth-skin-bob主题`需要改造字体颜色为 #666 即可写为 `.auth-skin-bob .auth-status > div > span {color: #666;}`
- 每个主题需要适配左侧有单选/多选框以及隐藏的情况，两者的区别在于顶级作用域多了一个 `.auth-tree-hidechoose` 类，比如 `.auth-skin-bob.auth-tree-hidechoose .auth-status {color: #666}`
- 主题开发完毕后可以在GitHub上提 Pull Request，或者私聊 admin@wj2015.com，我会更新到文档中以供用户选择

## 主题开发DOM介绍

```html

```

## 主题开发套路

第一步，复制