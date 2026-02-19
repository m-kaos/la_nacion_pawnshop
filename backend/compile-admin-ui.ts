import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';

async function compile() {
  try {
    await compileUiExtensions({
      outputPath: path.join(__dirname, 'admin-ui'),
      extensions: [],
      devMode: true,
    });
    console.log('✅ Admin UI compiled successfully!');
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error compiling Admin UI:', err);
    process.exit(1);
  }
}

compile();
