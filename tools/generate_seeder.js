const fs = require('fs');

const json = JSON.parse(fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download/data/color_palette.json', 'utf8'));

let seederCode = `<?php

namespace Database\\Seeders;

use App\\Models\\ColorCollection;
use App\\Models\\PaintColor;
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Str;

class ColorPaletteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collectionsData = ` + JSON.stringify(json, null, 8) + `;

        foreach ($collectionsData as $colData) {
            $collection = ColorCollection::updateOrCreate(
                ['code' => $colData['code']],
                [
                    'name' => $colData['name'],
                    'slug' => $colData['slug'] ?? Str::slug($colData['name']),
                    'accent_hex' => $colData['accent_hex'] ?? '#C5A880',
                    'image' => $colData['image'] ?? null,
                    'description' => $colData['description'] ?? null,
                    'sort_order' => $colData['sort_order'] ?? 0,
                    'is_active' => true,
                ]
            );

            if (!empty($colData['colors'])) {
                foreach ($colData['colors'] as $order => $clr) {
                    PaintColor::updateOrCreate(
                        ['code' => $clr['code']],
                        [
                            'color_collection_id' => $collection->id,
                            'name_vi' => $clr['name_vi'],
                            'name_en' => $clr['name_en'] ?? null,
                            'hex_code' => $clr['hex'],
                            'sort_order' => $order + 1,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }
    }
}
`;

fs.writeFileSync('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/database/seeders/ColorPaletteSeeder.php', seederCode, 'utf8');
console.log('Generated ColorPaletteSeeder.php successfully!');

