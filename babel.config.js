module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/navigation': './src/navigation',
            '@/screens': './src/screens',
            '@/store': './src/store',
            '@/utils': './src/utils',
            '@/assets': './assets',
            '@/components': './src/components',
            '@/constants': './constants',
            '@/hooks': './hooks',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
