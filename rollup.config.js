// @ts-check

import { ESLint } from 'eslint'
import ts from 'typescript'
import typescript from 'rollup-plugin-typescript2'
import esmproxy, { ExpressBuilder } from '@rollup/plugin-proxy'

const backend = ['back/logged.ts', 'back/unlogged.ts']

const external = ['bcrypt', 'postgres', 'cors', 'debug']

/** @type {(import('rollup').RollupOptions)[]} */
const config = [
  {
    input: backend,
    output: {
      format: 'esm',
      dir: 'server/routers',
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
        tsconfig: 'back/tsconfig.json',
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
    input: 'back/index.ts',
    output: {
      format: 'esm',
      dir: 'rest',
      sourcemap: true
    },
    plugins: [
      esmproxy({
        entrypoint: backend,
        builder: ExpressBuilder({
          baseUrl: 'http://localhost:4000/api',
          logEndpoints: true
        })
      }),
      typescript({
        tsconfig: 'back/tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            declaration: true
          }
        }
        // transformers: [
        //   () => ({
        //     before(context) {
        //       // eslint-disable-next-line valid-jsdoc
        //       /** @param {import('typescript').Node} node node */
        //       function visitor(node) {
        //         console.info('', ts.SyntaxKind[node.kind])
        //         if (ts.isFunctionDeclaration(node)) {
        //           console.info('', node.name.text)
        //           const maybeThisParameter = node.parameters[0]
        //           if (
        //             maybeThisParameter &&
        //             ts.isIdentifier(maybeThisParameter.name) &&
        //             maybeThisParameter.name.text === 'this'
        //           ) {
        //             console.info('UPDATE', maybeThisParameter, node.name.text)
        //             return context.factory.updateFunctionDeclaration(
        //               node,
        //               node.decorators,
        //               node.modifiers,
        //               node.asteriskToken,
        //               node.name,
        //               node.typeParameters,
        //               node.parameters.filter(p => p !== maybeThisParameter),
        //               node.type,
        //               node.body
        //             )
        //           }
        //         }
        //         return node
        //       }
        //       return source => ts.visitEachChild(source, visitor, context)
        //     }
        //   })
        // ]
      }),
      ((eslint, formatter = eslint.loadFormatter('stylish')) => ({
        name: 'lint-bundle',
        async writeBundle({ dir }, bundle) {
          let results = await eslint.lintFiles(
            Object.keys(bundle)
              .filter(x => x.endsWith('.js'))
              .map(x => `${dir}/${x}`)
          )
          await ESLint.outputFixes(results)
          results = ESLint.getErrorResults(results)
          console.log((await formatter).format(results))
          if (results.length) throw new Error('Some ESLint errors occured')
        }
      }))(new ESLint({ fix: true, useEslintrc: true }))
    ]
  },
  {
    input: 'server/index.ts',
    output: {
      format: 'cjs',
      dir: 'server/dist',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: 'server/tsconfig.json'
      })
    ],
    external: ['path', 'express', 'express-session', ...external]
  }
]

export default config
