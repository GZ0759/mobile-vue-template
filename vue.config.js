// 可直接在根目录上创建 .postcssrc.js 文件

// module.exports = {
//     css: {
//       loaderOptions: {
//         postcss: {
//           plugins: [
//             require('postcss-px-to-viewport')({
//               unitToConvert: 'px',
//               viewportWidth: 350,
//               unitPrecision: 5,
//               propList: ['*'],
//               viewportUnit: 'vw',
//               fontViewportUnit: 'vw',
//               selectorBlackList: [],
//               minPixelValue: 1,
//               mediaQuery: false,
//               replace: true,
//               exclude: [/node_modules/],
//               include: undefined,
//               landscape: false,
//               landscapeUnit: 'vw',
//               landscapeWidth: 568,
//             }),
//           ],
//         },
//       },
//     },
//   };