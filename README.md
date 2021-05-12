# 移动端 Vue 项目搭建

## 示例代码运行

```
npm install
npm run serve
```

## 单位 px 适配方案

### 1. 较旧版本

方法：利用 [lib-flexible](https://www.npmjs.com/package/lib-flexible) 和 [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem) 插件

lib-flexible 会自动在 html 的 head 中添加一个 `meta name="viewport"` 的标签，同时会自动设置 html 的 font-size 为屏幕宽度除以 10，也就是 1rem 等于 html 根节点的 font-size。假如设计稿的宽度是 750px，此时 1rem 应该等于 75px。假如量的某个元素的宽度是 150px，那么在 css 里面定义这个元素的宽度就是 `width: 2rem`。但是当分辨率大于某个特定值时，它便不再生效。

### 2. 通用版本

方法：利用 [postcss-px-to-viewport](https://www.npmjs.com/package/postcss-px-to-viewport) 插件

插件 postcss-px-to-viewport 可以直接将 px 转换成视口单位 vw。PostCSS 严格来说不是一款 CSS 预处理器，而是一个用 JavaScript 工具和插件转换 CSS 代码的工具。它的工作模式是接收样式源代码并交由编译插件处理，最后输出 CSS 内容。因此只需要配置好参数即可进行转换。

> Vue CLI 内部使用了 PostCSS。  
> 你可以通过 .postcssrc 或任何 postcss-load-config 支持的配置源来配置 PostCSS。也可以通过 vue.config.js 中的 css.loaderOptions.postcss 配置 postcss-loader。
> [Vue CLI 原文](https://cli.vuejs.org/zh/guide/css.html#postcss)

第一种配置：*.postcssrc*文件

```js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 375, // UI设计稿的宽度
      unitPrecision: 5, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false, // 是否处理横屏情况
    },
  },
};
```

第二种配置：*vue.config.js*文件

```js
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            unitToConvert: 'px',
            viewportWidth: 350,
            unitPrecision: 5,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/],
            include: undefined,
            landscape: false,
            landscapeUnit: 'vw',
            landscapeWidth: 568,
          }),
        ],
      },
    },
  },
};
```
