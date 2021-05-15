# 移动端 Vue 项目搭建

## 单位 px 适配方案

### 1. 两个插件方案

方法：利用 [lib-flexible](https://www.npmjs.com/package/lib-flexible) 和 [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem) 插件

#### lib-flexible

通过 lib-flexible 的 flexible.js 文件可知，它的基本原理是动态获取屏幕的宽度，在屏幕尺寸发生变化时改变根元素的 font-size 值，从而让 rem 单位有适配屏幕的功能。

主要流程有：

1. 动态改写 `<meta>` 文档级元数据元素标签，其中标签属性键值对有

- name="viewport" 告诉浏览器如何规范的渲染 Web 页面
- content="width=device-width 使用字符串 width-device 表示设备宽度
- initial-scale=1 设置页面的初始缩放值 100%
- maximum-scale=1 允许用户的最大缩放值 100%
- minimum-scale=1 允许用户的最小缩放值 100%
- user-scalable=no 不允许用户进行缩放

2. 通过 JS 获取屏幕的宽度：`docEl.getBoundingClientRect().width`
3. 给 `<html>` 根元素动态设置 data-dpr 和 font-size 属性
4. 监听页面 resize 和 pageshow 事件，动态更改根元素的 font-size 值
5. 因为单位 rem 是相当于根元素的字体大小，所以页面中的元素可以通过使用 rem 单位实现屏幕的适配效果
6. 另外，通过 `window['lib']` 进行缓存，同时对外暴露出 rem2px 和 px2rem 方法。

由此，插件主要帮我们自动设置 html 的 font-size 为屏幕宽度除以 10，也就是 1rem 等于 html 根节点的 font-size。在日常开发中，假如我们的设计稿（即用户屏幕）的宽度是 750px，此时 1rem 应该等于 75px。当某个元素的宽度是 150px，那么我们在 css 里面定义这个元素 `width: 2rem` 就可以了。值得注意的是，当分辨率大于某个特定值时，它便不再生效。

更详细的内容请参考[使用 Flexible 实现手淘 H5 页面的终端适配](https://github.com/amfe/article/issues/17)

#### postcss-pxtorem

借助 lib-flexible 插件，可以将屏幕宽度进行等比例计算和添加根节点字体大小，其实已经完成了单位 px 适配了。但是往往我们希望可以自动将 px 单位转化为 rem 单位，因为很多设计图都是 px 单位（其实也不一定，很多切图设计稿都支持切换 px/pt/dp/rem 等单位）。

总之如果我们希望开发时以 px 为单位，让插件自动帮我们转换为 rem 单位，从而与根节点的 font-size 产生联系，就需要用到另外一些方法：

1. 编辑器插件，以肉眼可见的方式，直接将输入的 px 单位转为成 rem 单位。不推荐，开发容易但是维护困难。
2. 使用 Sass、Less 以及 PostCSS 这样的 CSS 处理器，在编译时自动转换。

postcss-pxtorem 就是一种 PostCSS 插件，它的配置如下

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

其中 PostCSS 插件还有 postcss-px2rem，这两个插件的作用是一样的，只不过配置具体细节有差异。

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

#### 方案不足之处

1. 需要两个插件配合使用，或者需要额外工具转换设计稿单位
2. 本质上 rem 单位是相对于 html 元素字体的一个相对单位，用来布局可能有副作用

> 由于 viewport 单位得到众多浏览器的兼容，lib-flexible 这个过渡方案已经可以放弃使用，不管是现在的版本还是以前的版本，都存有一定的问题。建议大家开始使用 viewport 来替代此方案。

### 2. 一个插件方案（推荐）

方法：利用 [postcss-px-to-viewport](https://www.npmjs.com/package/postcss-px-to-viewport) 插件

插件 postcss-px-to-viewport 就是利用 viewport 来替代 lib-flexible 方法。它可以直接将 px 转换成视口单位 vw 从而实现适配。

顺便说一下，PostCSS 严格来说不是一款 CSS 预处理器，而是一个用 JavaScript 工具和插件转换 CSS 代码的工具。它的工作模式是接收样式源代码并交由编译插件处理，最后输出 CSS 内容。因此只需要配置好参数即可进行转换。

> Vue CLI 内部使用了 PostCSS。  
> 你可以通过 .postcssrc 或任何 postcss-load-config 支持的配置源来配置 PostCSS。也可以通过 vue.config.js 中的 css.loaderOptions.postcss 配置 postcss-loader。
> [Vue CLI 原文](https://cli.vuejs.org/zh/guide/css.html#postcss)

第一种配置：`.postcssrc`文件

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

第二种配置：`vue.config.js`文件

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

### 3. 手动实现方案

既然知道了前面的原理，那么就可以不借助插件，手动写简单版本的适配方案。下面以设计稿为 750px 为依据。

```scss
@function px2vw($val) {
  @return ($val/750) * 100vw;
}
html {
  font-size: px2vw(100);
}
```

上面利用了 sass 的自定义函数（Function Directives），函数 px2vw 将任意 px 单位转化为相对单位 vw。因此，我们可以将 html 的字体大小设置为 `px2vw(100)`，意思是在文档子元素中，每单位 rem 代表 100px。

举个例子，假如我们的设计稿有宽 200px 高 140px 的元素，那么我们只要设置 `width: 2rem` 和 `height: 1.4rem` 即可，就能达到适配屏幕的目的了。

值得注意的是，可能随着屏幕的放大，字体也会跟着放大，我们希望有一个最小字体和最大字体，那么就可以添加媒体查询。

```scss
@function px2vw($val) {
  @return ($val/750) * 100vw;
}
html {
  font-size: px2vw(100);
  @media screen and (min-width: 320px) {
    font-size: 64px;
  }
  @media screen and (max-width: 540px) {
    font-size: 108px;
  }
}
```

方案的缺点，在开发设计时还是有一个 px 到 rem 的换算过程，除非用上面说到的编辑器插件或者 CSS 处理器。
