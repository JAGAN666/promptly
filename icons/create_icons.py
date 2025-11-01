#!/usr/bin/env python3
"""
Quick icon generator for ArgumentArmor
Creates simple PNG icons with a shield emoji/symbol
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os

    def create_icon(size, filename):
        # Create image with gradient background
        img = Image.new('RGB', (size, size), color=(102, 126, 234))
        draw = ImageDraw.Draw(img)

        # Draw a circle background
        margin = size // 8
        draw.ellipse([margin, margin, size-margin, size-margin], fill=(102, 126, 234))

        # Draw shield shape (simplified)
        shield_margin = size // 4
        shield_top = size // 4
        shield_bottom = size * 3 // 4
        shield_left = size // 3
        shield_right = size * 2 // 3

        # Shield points
        points = [
            (size // 2, shield_top),  # top center
            (shield_left, shield_top + 10),  # top left
            (shield_left, shield_bottom - 20),  # bottom left
            (size // 2, shield_bottom),  # bottom point
            (shield_right, shield_bottom - 20),  # bottom right
            (shield_right, shield_top + 10),  # top right
        ]

        draw.polygon(points, fill='white')

        # Draw checkmark
        check_scale = size // 32
        check_points = [
            (size // 2 - 8 * check_scale, size // 2),
            (size // 2 - 2 * check_scale, size // 2 + 6 * check_scale),
            (size // 2 + 10 * check_scale, size // 2 - 6 * check_scale),
        ]
        draw.line(check_points, fill=(102, 126, 234), width=max(2, size // 20))

        # Save
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filepath = os.path.join(script_dir, filename)
        img.save(filepath, 'PNG')
        print(f'Created {filename}')

    # Generate all icon sizes
    sizes = [16, 32, 48, 128]
    for size in sizes:
        create_icon(size, f'icon{size}.png')

    print('All icons created successfully!')

except ImportError:
    print('PIL/Pillow not installed. Installing...')
    import subprocess
    import sys
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'Pillow'])
    print('Please run this script again.')
