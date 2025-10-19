const { getDefaultConfig } = require('expo/metro-config');

// Set the app root for Expo Router before getting the config
process.env.EXPO_ROUTER_APP_ROOT = './app';

const config = getDefaultConfig(__dirname);

// Ensure the resolver can handle the app directory
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;