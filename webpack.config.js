const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const themeColors = require('./src/utils/theme-colors.json');

// CSS-variable keys used by the loading screen's first-paint theme script.
// Only these keys are extracted from the JSON and passed to the HTML template.
const loadingScreenCssVarKeys = [
  'primary',
  'primaryForeground',
  'background',
  'foreground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'secondary',
  'secondaryForeground',
  'muted',
  'mutedForeground',
  'accent',
  'accentForeground',
  'destructive',
  'destructiveForeground',
  'border',
  'input',
  'ring',
  'header',
  'headerForeground',
  'loading',
  'loadingForeground',
  'sidebar',
  'sidebarForeground',
];

const loadingScreenThemes = JSON.stringify(
  Object.fromEntries(
    Object.entries(themeColors).map(([key, colors]) => {
      const subset = {};
      for (const k of loadingScreenCssVarKeys) {
        if (colors[k]) subset[k] = colors[k];
      }
      return [key, subset];
    })
  )
);

module.exports = (env, argv) => {
  const isProduction =
    (argv && argv.mode === 'production') || process.env.NODE_ENV === 'production';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      clean: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single',
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    externals: {
      'use-sync-external-store': 'use-sync-external-store',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        templateParameters: {
          isProduction: isProduction,
          loadingScreenThemes: loadingScreenThemes,
        },
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({ NODE_ENV: isProduction ? 'production' : 'development' }),
      }),
    ],
    performance: { hints: false },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
  };
};
