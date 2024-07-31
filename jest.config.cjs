module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "/node_modules/(?!auto-bind)"
    ]
};
