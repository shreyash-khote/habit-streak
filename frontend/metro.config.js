// Reverted to default expo metro config to avoid Windows path bug
const { getDefaultConfig } = require("expo/metro-config");
module.exports = getDefaultConfig(__dirname);
