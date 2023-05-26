const rgbToHsb = (r: any, g: any, b: any) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const v = Math.max(r, g, b),
    n = v - Math.min(r, g, b);
  const h =
    n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
  return { h: 60 * (h < 0 ? h + 6 : h), s: v && (n / v) * 100, b: v * 100};
};

const hsbToRgb = (h: any, s: any, b: any) => {
  s /= 100;
  b /= 100;
  const k = (n: any) => (n + h / 60) % 6;
  const f = (n: any) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return { r: 255 * f(5), g: 255 * f(3), b: 255 * f(1)};
};

const hexToRgb = (hex: any) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m: any, r: any, g: any, b: any) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

// const rgbToHex = (rgb: any) => {
//  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
//  return (rgb && rgb.length === 4) ? "#" +
//   ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
//   ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
//   ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
// }

const rgbToHex = (r: any, g: any, b: any) =>
  ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

const lightenDarkenColor = (col: any, amt: any) => {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col,16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if  (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if  (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound?"#":"") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}

const checksRGB = (color: any) => {
  if (color <= 0.03928) {
    return (color / 12.92);
  } else {
    return (Math.pow(((color + 0.055)/1.055), 2.4));
  }
}

const getColorObject = (color: any) => {
  const colorObj = {
    r: checksRGB(color.r/255),
    g: checksRGB(color.g/255),
    b: checksRGB(color.b/255)
  };
  return colorObj;
};

const calculateRatio = (color1: any, color2: any) => {
  const colorOneObject = getColorObject(color1);
  const colorTwoObject = getColorObject(color2);
  const colorOneL = ((0.2126 * colorOneObject.r) + (0.7152 * colorOneObject.g) + (0.0722 * colorOneObject.b));
  const colorTwoL = ((0.2126 * colorTwoObject.r) + (0.7152 * colorTwoObject.g) + (0.0722 * colorTwoObject.b));
  if (colorOneL > colorTwoL) {
      return ((colorOneL + 0.05)/(colorTwoL + 0.05));
  } else {
      return ((colorTwoL + 0.05)/(colorOneL + 0.05));
  }
}


export { calculateRatio, getColorObject, checksRGB, lightenDarkenColor, rgbToHex, hexToRgb, rgbToHsb, hsbToRgb }