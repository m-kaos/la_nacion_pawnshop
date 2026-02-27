import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';

/**
 * Pre-compiles the Vendure Admin UI with all custom extensions.
 * Run this during Docker image build so the container starts without any
 * Angular compilation delay. Output: admin-ui/dist/browser/
 *
 * Usage: ts-node compile-admin-ui.ts
 */
async function compile() {
  try {
    await compileUiExtensions({
      outputPath: path.join(__dirname, 'admin-ui'),
      extensions: [
        {
          extensionPath: path.join(__dirname, 'src/plugins/pawnshop/ui'),
          ngModules: [
            {
              type: 'shared',
              ngModuleFileName: 'contratos-shared.module.ts',
              ngModuleName: 'ContratosSharedModule',
            },
            {
              type: 'lazy',
              route: 'contratos',
              ngModuleFileName: 'contratos.module.ts',
              ngModuleName: 'ContratosModule',
            },
            {
              type: 'lazy',
              route: 'articulos',
              ngModuleFileName: 'articulos.module.ts',
              ngModuleName: 'ArticulosModule',
            },
            {
              type: 'lazy',
              route: 'combos',
              ngModuleFileName: 'combos.module.ts',
              ngModuleName: 'CombosModule',
            },
          ],
        },
      ],
      devMode: false,
    });
    console.log('✅ Admin UI compiled successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error compiling Admin UI:', err);
    process.exit(1);
  }
}

compile();
