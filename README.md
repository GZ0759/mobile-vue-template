# 移动端 Vue 项目搭建

## 示例代码运行

```
npm install
npm run serve
```

## 单位 px 适配方案

### 1. 两个插件方案

方法：利用 [lib-flexible](https://www.npmjs.com/package/lib-flexible) 和 [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem) 插件

#### lib-flexible 源码解析

1. 动态改写`<meta>`标签，结果大概为`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">`。
2. 给`<html>`元素添加 data-dpr 属性，并且动态改写 data-dpr 的值；给`<html>`元素添加 font-size 属性，并且动态改写 font-size 的值。因此，页面中的元素便可以通过 rem 单位实现屏幕的适配效果。
3. 监听页面 resize 和 pageshow 事件实时刷新。
4. 通过 `window['lib']` 进行缓存和暴露一些数值和方法。

自动设置 html 的 font-size 为屏幕宽度除以 10，也就是 1rem 等于 html 根节点的 font-size。举个例子，假如设计稿的宽度是 750px，此时 1rem 应该等于 75px。假如量的某个元素的宽度是 150px，那么我们在 css 里面定义这个元素 `width: 2rem` 就可以了。但是当分辨率大于某个特定值时，它便不再生效。

[使用 Flexible 实现手淘 H5 页面的终端适配](https://github.com/amfe/article/issues/17)

#### 将设计图的 px 单位转化为 rem 单位

lib-flexible 的原理是将屏幕宽度进行等比例计算和添加 html 根节点 font-size。那么，最后一步就是要我们将 px 转换为 rem 单位，从而与根节点的 font-size 产生联系。

1. 编辑器插件，直接将输入的 px 单位转为成 rem 单位。不推荐，开发容易维护困难。
2. 使用 Sass、Less 以及 PostCSS 这样的 CSS 处理器，其中 PostCSS 插件 有 postcss-px2rem 和 postcss-pxtorem。

_postcss-px2rem_ 插件配置

```js
var px2rem = require('postcss-px2rem');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader',
      },
    ],
  },
  postcss: function() {
    return [px2rem({ remUnit: 75 })];
  },
};
```

_postcss-pxtorem_ 插件配置

```js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 75, // 根元素字体大小
      propList: ['*'], // 需要做转化处理的属性，*表示全部
    },
  },
};
```

#### 不足之处

1. 需要两个插件配合使用，或者需要额外工具转换设计稿单位
2. 本质上 rem 是相对于 html 元素字体的一个相对单位，用来布局可能有副作用

> 由于 viewport 单位得到众多浏览器的兼容，lib-flexible 这个过渡方案已经可以放弃使用，不管是现在的版本还是以前的版本，都存有一定的问题。建议大家开始使用 viewport 来替代此方案。

### 2. 一个插件方案（推荐）

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
