const path = require("path");
const webpack = require("webpack");

const { CheckerPlugin } = require("awesome-typescript-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_PATH = process.env.BASE_PATH || "/";

function buildConfig(env, argv) {
    const mode = argv.mode || "production";
    console.log(`Mode: ${mode}`);
    console.log(`Base Path: ${BASE_PATH}`);
    return {
        mode,
        devtool: "eval",
        entry: "./src/index.tsx",
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            publicPath: BASE_PATH
        },
        module: {
            rules: [
                {
                    test: /\.(ttf|otf|eot|woff)$/i,
                    use: ["file-loader"]
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: ["file-loader"]
                },
                {
                    test: /\.md$/i,
                    use: ["smart-markdown-loader"]
                },
                {
                    test: /\.tsx?$/,
                    loader: "awesome-typescript-loader"
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: mode === "development"
                            }
                        },

                        // Translates CSS into CommonJS
                        "css-loader",
                        "resolve-url-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.css$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: mode === "development"
                            }
                        },

                        // Translates CSS into CommonJS
                        "css-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".jsx"],
            alias: {
                "react-dom": "@hot-loader/react-dom"
            }
        },
        plugins: [
            new CheckerPlugin(),
            new HtmlWebpackPlugin({ template: "./src/index.html" }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // all options are optional
                filename: mode === "development" ? "[name].css" : "[name].[hash].css",
                chunkFilename: mode === "development" ? "[id].css" : "[id].[hash].css",
                ignoreOrder: false // Enable to remove warnings about conflicting order,
            }),
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(mode),
                "process.env.BASE_PATH": JSON.stringify(BASE_PATH)
            })
        ],
        devServer: {
            hot: true,
            publicPath: BASE_PATH
        }
    };
}

module.exports = buildConfig;
