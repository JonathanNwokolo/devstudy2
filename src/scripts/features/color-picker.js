/** Seletor de cores interativo (#colorPicker em index.html e css.html). */

export function initColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    const colorResult = document.getElementById('colorResult');
    const colorCodes = document.getElementById('colorCodes');
    
    if (!colorPicker || !colorResult || !colorCodes) return;
    
    function updateColor() {
        const color = colorPicker.value;
        
        // Atualiza o preview
        colorResult.style.background = color;
        const darkInk = '#191922';
        const lightInk = '#ffffff';
        colorResult.style.color = contrastRatio(color, darkInk) >= contrastRatio(color, lightInk) ? darkInk : lightInk;
        
        // Converte para diferentes formatos
        const rgb = hexToRgb(color);
        const hsl = hexToHsl(color);
        
        colorCodes.innerHTML = `
            <code>HEX: ${color}</code>
            <code>RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</code>
            <code>HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)</code>
        `;
    }
    
    colorPicker.addEventListener('input', updateColor);
    updateColor(); // Inicializa
}

// Helpers para cores
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    const r1 = r / 255;
    const g1 = g / 255;
    const b1 = b / 255;
    
    const max = Math.max(r1, g1, b1);
    const min = Math.min(r1, g1, b1);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
            case g1: h = ((b1 - r1) / d + 2) / 6; break;
            case b1: h = ((r1 - g1) / d + 4) / 6; break;
        }
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function contrastRatio(first, second) {
    const luminance = (hex) => {
        const { r, g, b } = hexToRgb(hex);
        const linear = [r, g, b].map((value) => {
            const channel = value / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    const a = luminance(first);
    const b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// ==========================================
