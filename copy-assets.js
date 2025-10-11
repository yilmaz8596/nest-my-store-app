const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
  try {
    console.log('📦 Starting asset copy process...');

    const publicSrc = path.join(__dirname, 'public');
    const publicDest = path.join(__dirname, 'dist', 'public');
    const viewsSrc = path.join(__dirname, 'views');
    const viewsDest = path.join(__dirname, 'dist', 'views');

    console.log(`📂 Copying ${publicSrc} to ${publicDest}...`);
    await fs.copy(publicSrc, publicDest);
    console.log('✅ Public assets copied successfully');

    console.log(`📂 Copying ${viewsSrc} to ${viewsDest}...`);
    await fs.copy(viewsSrc, viewsDest);
    console.log('✅ Views copied successfully');

    // Verify the copies
    const publicExists = await fs.pathExists(publicDest);
    const viewsExists = await fs.pathExists(viewsDest);

    console.log(`✅ Verification: dist/public exists: ${publicExists}`);
    console.log(`✅ Verification: dist/views exists: ${viewsExists}`);

    if (publicExists && viewsExists) {
      const publicFiles = await fs.readdir(publicDest);
      const viewsFiles = await fs.readdir(viewsDest);
      console.log(`📋 Public files: ${publicFiles.join(', ')}`);
      console.log(`📋 Views files: ${viewsFiles.join(', ')}`);
    }

    console.log('🎉 Asset copy completed successfully!');
  } catch (error) {
    console.error('❌ Error copying assets:', error);
    process.exit(1);
  }
}

copyAssets();
