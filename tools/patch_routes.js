const fs = require('fs');

// Patch admin.php
const adminFile = 'C:/Users/Admin/Documents/sơn myhouse/vmaxcore/routes/admin.php';
let adminRoutes = fs.readFileSync(adminFile, 'utf8');

const colorRoutes = `
    // QUẢN LÝ BẢNG MÀU SƠN (Color Palette Management)
    Route::prefix('color-palette')->name('color-palette.')->group(function () {
        Route::get('/', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'index'])->name('index');
        Route::post('/colors', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'store'])->name('colors.store');
        Route::put('/colors/{id}', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'update'])->name('colors.update');
        Route::delete('/colors/{id}', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'destroy'])->name('colors.destroy');
        Route::post('/colors/{id}/toggle', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'toggleStatus'])->name('colors.toggle');
        Route::post('/reorder', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'reorder'])->name('reorder');

        // Collections
        Route::post('/collections', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'storeCollection'])->name('collections.store');
        Route::put('/collections/{id}', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'updateCollection'])->name('collections.update');
        Route::delete('/collections/{id}', [\\App\Http\Controllers\\Admin\\ColorPaletteController::class, 'destroyCollection'])->name('collections.destroy');
    });
});
`;

if (!adminRoutes.includes('color-palette')) {
  // replace the last '});'
  const lastClose = adminRoutes.lastIndexOf('});');
  if (lastClose !== -1) {
    adminRoutes = adminRoutes.substring(0, lastClose) + colorRoutes;
    fs.writeFileSync(adminFile, adminRoutes, 'utf8');
    console.log('Appended color-palette routes to admin.php');
  }
} else {
  console.log('color-palette already in admin.php');
}

// Patch web.php
const webFile = 'C:/Users/Admin/Documents/sơn myhouse/vmaxcore/routes/web.php';
let webRoutes = fs.readFileSync(webFile, 'utf8');
if (!webRoutes.includes('api/color-collections')) {
  webRoutes += `\nRoute::get('/api/color-collections', [\\App\\Http\\Controllers\\Public\\ColorPaletteController::class, 'index'])->name('api.colors');\n`;
  fs.writeFileSync(webFile, webRoutes, 'utf8');
  console.log('Appended public API route to web.php');
} else {
  console.log('api/color-collections already in web.php');
}

