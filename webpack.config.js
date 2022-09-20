const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'inline-source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },
  entry: { bundle: path.resolve(__dirname, 'src/index.ts') },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: 'static/[name][ext][query]',
  },

  module: {
    rules: [
      // <-- Html compiler -->
      { test: /\.html$/i, loader: 'html-loader' },
      // <-- CSS and SASS compiler -->
      {
        test: /\.(c|sc|sa)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },
          'sass-loader',
        ],
      },
      // <-- Babel compiler -->
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
      //  <--TypeScript compiler -->
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      // <-- Fonts compiler -->
      {
        test: /\.(woff|woff2|ttf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[name][ext]',
        },
      },
      // <-- Images compiler -->
      {
        test: /\.(png|jp(e*)g|svg|gif|webp)$/,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name][ext]',
        },
      },
      // <-- Other files compiler -->
      // {
      //   test: /\.(txt|xml|ico)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: '[name][ext]',
      //   },
      // },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Бухгалтерские услуги для бизнеса онлайн. Web-сервис Liloo',
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name][contenthash].css',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: '' }],
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
};
