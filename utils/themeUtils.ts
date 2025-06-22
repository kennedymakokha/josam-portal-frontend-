// utils/themeUtils.ts
export function getTextColorForBackground(bgColor: string): 'black' | 'white' {
    if (!bgColor) return 'black';
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 186 ? 'black' : 'white';
  }
  