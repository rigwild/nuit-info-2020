// @ts-check

// import { ESLint } from 'eslint'
// import ts from 'typescript'
import typescript from "rollup-plugin-typescript2";
import esmproxy, { ExpressBuilder } from "@rollup/plugin-proxy";

const backend = ["back/products.ts", "back/activities.ts", "back/report.ts"];

const external = ["bcrypt", "postgres", "cors", "debug"];

/** @type {(import('rollup').RollupOptions)[]} */
const config = [
  {
    input: backend,
    output: {
      format: "esm",
      dir: "server/routers",
      sourcemap: true
    },
    plugins: [
      esmproxy({
        entrypoint: backend,
        builder: ExpressBuilder({
          logEndpoints: true
        })
      }),
      typescript({
        tsconfig: "back/tsconfig.json",
        tsconfigOverride: {
          compilerOptions: {
            declaration: false
          }
        }
      })
    ],
    external
  },
  {
    input: "back/index.ts",
    output: {
      format: "esm",
      dir: "src/rest",
      sourcemap: true
    },
    plugins: [
      esmproxy({
        entrypoint: backend,
        builder: ExpressBuilder({
          baseUrl: "http://localhost:4000/api",
          logEndpoints: true
        })
      }),
      typescript({
        tsconfig: "back/tsconfig.json",
        tsconfigOverride: {
          compilerOptions: {
            declaration: true
          }
        }
      }),

    ]
  },
  {
    input: "server/index.ts",
    output: {
      format: "cjs",
      dir: "server/dist",
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: "server/tsconfig.json"
      })
    ],
    external: ["path", "express", "express-session", ...external]
  }
];

export default config;
