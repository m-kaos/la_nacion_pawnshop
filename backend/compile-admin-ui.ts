import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';

async function compile() {
  try {
    await compileUiExtensions({
      outputPath: path.join(__dirname, 'admin-ui'),
      extensions: [
        {
          extensionPath: path.join(__dirname, 'src/plugins/pawnshop/ui'),
          ngModules: [
            {
              type: 'lazy',
              route: 'contratos',
              ngModuleFileName: 'contratos.module.ts',
              ngModuleName: 'ContratosModule',
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
