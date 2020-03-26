const path = require("path");
const webpack = require("webpack");
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//
// const glob = require('glob');
//
// function getEntries(pattern) {
//   const entries = {};
//
//   glob.sync(pattern).forEach((file) => {
//     entries[file.replace('src/', '')] = path.join(__dirname, file);
//   });
//
//   return entries;
// }
//
// let library = {
//   // entry: getEntries('src/libs/**/*.js'),
//   entry: getEntries('src/libs/*.js'),
//   module: {
//     loaders: [
//       {
//         test: /^\.\/src\/libs\/.*\.js$/,
//         loader: "file?name=[name].[ext]&outputPath=./dist"
//       }
//     ]
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name]',
//   }
// }

// 지원하지 않는 브라우져에 대응하기 위해 BiscuitViewer를 따로 빌드한다.
// 최신브라우져 용이므로 BiscuitViewer는 babel을 쓰지않는다.
// (IE에 맞춰보려 했으나 각종 폴리필은 되는데 마지막 테스트에 알수없는 정규식에러로그가 떠서 IE같이 쓰기 포기)
// index는 공용이므로 babel를 쓴다. 이떄 check-ie모듈을 가져왔는데 이역시 최신브라우져코딩이라
// babel옵션에 check-ie도 트랜스파일하도록 설정했다.



let babelOption = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["last 2 versions", "ie >= 11"]
        }
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-classes",
    "@babel/plugin-transform-async-to-generator",
    "@babel/plugin-transform-arrow-functions"
  ]
  // "exclude": /node_modules/
  // "include": [
  //   path.resolve('src/'),
  //   path.resolve('node_modules/load-script2/'),
  //   path.resolve('node_modules/yt-player/'),
  //   path.resolve('node_modules/three/')
  // ],
  // "exclude": /node_modules\/(?!(yt-player|three|load-script2)).+/
}




const ConcatSource = require("webpack-sources").ConcatSource;
const ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");

class WrapperPlugin {

	/**
	 * @param {Object} args
	 * @param {string | Function} [args.header]  Text that will be prepended to an output file.
	 * @param {string | Function} [args.footer] Text that will be appended to an output file.
	 * @param {string | RegExp} [args.test] Tested against output file names to check if they should be affected by this
	 * plugin.
	 * @param {boolean} [args.afterOptimizations=false] Indicating whether this plugin should be activated before
	 * (`false`) or after (`true`) the optimization stage. Example use case: Set this to true if you want to avoid
	 * minification from affecting the text added by this plugin.
	 */
	constructor(args) {
		if (typeof args !== 'object') {
			throw new TypeError('Argument "args" must be an object.');
		}

		this.header = args.hasOwnProperty('header') ? args.header : '';
		this.footer = args.hasOwnProperty('footer') ? args.footer : '';
		this.afterOptimizations = args.hasOwnProperty('afterOptimizations') ? !!args.afterOptimizations : false;
		this.test = args.hasOwnProperty('test') ? args.test : '';
	}

	apply(compiler) {
		const header = this.header;
		const footer = this.footer;
		const tester = {test: this.test};

		compiler.hooks.compilation.tap('WrapperPlugin', (compilation) => {
			if (this.afterOptimizations) {
				compilation.hooks.afterOptimizeChunkAssets.tap('WrapperPlugin', (chunks) => {
					wrapChunks(compilation, chunks, footer, header);
				});
			} else {
				compilation.hooks.optimizeChunkAssets.tapAsync('WrapperPlugin', (chunks, done) => {
					wrapChunks(compilation, chunks, footer, header);
					done();
				})
			}
		});

		function wrapFile(compilation, fileName, chunkHash) {
			const headerContent = (typeof header === 'function') ? header(fileName, chunkHash) : header;
			const footerContent = (typeof footer === 'function') ? footer(fileName, chunkHash) : footer;

			compilation.assets[fileName] = new ConcatSource(
					String(headerContent),
					compilation.assets[fileName],
					String(footerContent));
		}

		function wrapChunks(compilation, chunks) {
			chunks.forEach(chunk => {
				const args = {
					hash: compilation.hash,
					chunkhash: chunk.hash
				};
				chunk.files.forEach(fileName => {
					if (ModuleFilenameHelpers.matchObject(tester, fileName)) {
						wrapFile(compilation, fileName, args);
					}
				});
			});
		}
	}
}

function createExternalModuleConfig(name, filename, config){
  let libraryName = name;
  let pfh = `(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
      module.exports = factory();
    else if(typeof define === 'function' && define.amd)
      define([], factory);
    else if(typeof exports === 'object')
      exports['MyLibrary'] = factory().default;
    else{
      root['MyLibrary'] = factory().default;
    }
  })(typeof self !== 'undefined' ? self : this, function() {
    return `.replace(/MyLibrary/g, libraryName);
  let pff = `\n})`;

  if(!config.plugins){
    config.plugins = [];
  }
  config.plugins.unshift(
    new WrapperPlugin({
      test: /\.js$/,
      header: pfh,
      footer: pff
    })
  );

  config.output.library = libraryName;
  config.output.libraryTarget = "window";
  config.output.filename = filename;//"./pptx.global.js"

  return config;
}

let test = {
  node: {
   fs: "empty"
  },
  devServer: {
    contentBase: './dist',
    port: 9000,
    open: 'chrome'
    // host: '0.0.0.0'
  },
  //mode: "development", //"production", "none"
  entry: {
    //"@babel/polyfill",
    test: ["@babel/polyfill", "./src/scripts/test.ts"],
    // BiscuitViewer: ["./src/scripts/BiscuitViewer.ts"],
    // Util: ["./src/scripts/Util.ts"]
    // AudioPlayer: ["./src/scripts/AudioPlayer.ts"]
  },

  // entry: "./src/app.ts",
  resolve: {
    extensions: [".js", ".ts"],//, ".json"]
    modules: [
      path.resolve('src/'),
      'node_modules'
    ]
  },

  // optimization: {
  //   runtimeChunk: true,
  //   splitChunks: {
  //     name: "vendor",
  //     chunks: "initial"
  //   }
  // }

  // 벤더 묶음
  // optimization: {
  //   //runtimeChunk: true,
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /node_modules/,
  //         name: 'venders',
  //         chunks: 'initial',
  //         enforce: true
  //         //minChunks: 1,
  //         //minSize: 0
  //       }
  //     }
  //   }
  // },

  // for production\
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         chunks: 'initial',
  //         name: 'BiscuitViewer',
  //         enforce: true,
  //       }
  //     }
  //   }
  // },

  //for dev
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'all',
  //     // cacheGroups: {
  //     //   styles: {
  //     //     name: 'styles',
  //     //     test: /\.css$/,
  //     //     chunks: 'all',
  //     //     enforce: true,
  //     //   },
  //     // },
  //   }
  // },

  // 모든 벤더 분리
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'all',
  //     maxInitialRequests: Infinity,
  //     minSize: 0,
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name(module) {
  //           // get the name. E.g. node_modules/packageName/not/this/part.js
  //           // or node_modules/packageName
  //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
  //
  //           // npm package names are URL-safe, but some servers don't like @ symbols
  //           return `npm.${packageName.replace('@', '')}`;
  //         },
  //       },
  //     },
  //   },
  // },


  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         name: 'venders',
  //         chunks: 'all',
  //         minChunks: 1,
  //         minSize: 0
  //       }
  //     }
  //   }
  // },
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     exclude: /node_modules/,
    //     use: [
    //       {
    //         loader: "babel-loader"
    //       }
    //     ]
    //   }
    // ]
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  cache: true,
  devtool: "source-map",
  // target: "node-webkit",
  output: {
    // library: "./[name].js",
    // libraryTarget: "commonjs",
    path: path.join(__dirname, "dist"),
    // publicPath: 'dist/',
    filename: "./[name].[contenthash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      // excludeChunks: ["Util", "BiscuitViewer"],
      // chunks: ['app'],
      template: path.join(__dirname, "src/test.html")
    })
  ]
};

let viewer = createExternalModuleConfig("V3D", "./v3d.js", {
  mode: "production", //"production",// "none"
  //"@babel/polyfill",
  entry: ["@babel/polyfill", "./src/scripts/index.ts"],
  resolve: {
    extensions: [".js", ".ts"],
    modules: [
      path.resolve('src/'),
      'node_modules'
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 9000,
    open: 'chrome'
    // host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  cache: true,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: 'dist/'
  },
  plugins: []
})

let cameraMovePlugin = createExternalModuleConfig("CameraMovePlugin", "./cameraMovePlugin.js", {
  mode: "production", //"production",// "none"
  //"@babel/polyfill",
  entry: ["@babel/polyfill", "./src/scripts/plugins/CameraMovePlugin.ts"],
  resolve: {
    extensions: [".js", ".ts"],
    modules: [
      path.resolve('src/'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  cache: true,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: 'dist/'
  },
  plugins: []
})

let sliderPlugin = createExternalModuleConfig("SliderPlugin", "./sliderPlugin.js", {
  mode: "production", //"production",// "none"
  //"@babel/polyfill",
  entry: ["@babel/polyfill", "./src/scripts/plugins/SliderPlugin.ts"],
  resolve: {
    extensions: [".js", ".ts"],
    modules: [
      path.resolve('src/'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  cache: true,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: 'dist/'
  },
  plugins: []
})

let fpsControlPlugin = createExternalModuleConfig("FpsControlPlugin", "./fpsControlPlugin.js", {
  mode: "production", //"production",// "none"
  //"@babel/polyfill",
  entry: ["@babel/polyfill", "./src/scripts/plugins/FpsControlPlugin.ts"],
  resolve: {
    extensions: [".js", ".ts"],
    modules: [
      path.resolve('src/'),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader?cachedirectory",
            options: babelOption
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  cache: true,
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: 'dist/'
  },
  plugins: []
})

let plugins = [cameraMovePlugin, sliderPlugin, fpsControlPlugin];




// module.exports = app;
module.exports = (env, argv)=>{
  let list = [];
  let doBuildInDevelopmentMode = false;
  if (doBuildInDevelopmentMode || argv.mode === 'production') {
    list.push(viewer);
  }else{
    list.push(test, viewer);
  }
  list.push(...plugins);

  return list;
};
