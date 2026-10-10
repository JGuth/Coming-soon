# Brand Assets Directory

This directory stores visual assets for **PipeBand.app**.

## Logo File Location
To provide a custom brand logo file:
1. Place your logo file in this directory named either:
   - `/public/assets/logo.svg` (recommended vector format)
   - `/public/assets/logo.png` (high-resolution transparent PNG, e.g. 512x512)
2. The application dynamically loads `/assets/logo.svg` or `/assets/logo.png` with automatic inline vector fallback if the file is missing or loading.
3. The logo is displayed in the navigation bar and hero section with preserved aspect ratio, transparency, and clarity.
