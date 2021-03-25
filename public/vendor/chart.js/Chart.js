/*!

 * Chart.js v2.8.0

 * https://www.chartjs.org

 * (c) 2019 Chart.js Contributors

 * Released under the MIT License

 */
(function (global, factory) {

typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(function() { try { return require('moment'); } catch(e) { } }()) :

typeof define === 'function' && define.amd ? define(['require'], function(require) { return factory(function() { try { return require('moment'); } catch(e) { } }()); }) :

(global.Chart = factory(global.moment));

}(this, (function (moment) { 'use strict';

moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;

/* MIT license */

var conversions = {

  rgb2hsl: rgb2hsl,

  rgb2hsv: rgb2hsv,

  rgb2hwb: rgb2hwb,

  rgb2cmyk: rgb2cmyk,

  rgb2keyword: rgb2keyword,

  rgb2xyz: rgb2xyz,

  rgb2lab: rgb2lab,

  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,

  hsl2hsv: hsl2hsv,

  hsl2hwb: hsl2hwb,

  hsl2cmyk: hsl2cmyk,

  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,

  hsv2hsl: hsv2hsl,

  hsv2hwb: hsv2hwb,

  hsv2cmyk: hsv2cmyk,

  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,

  hwb2hsl: hwb2hsl,

  hwb2hsv: hwb2hsv,

  hwb2cmyk: hwb2cmyk,

  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,

  cmyk2hsl: cmyk2hsl,

  cmyk2hsv: cmyk2hsv,

  cmyk2hwb: cmyk2hwb,

  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,

  keyword2hsl: keyword2hsl,

  keyword2hsv: keyword2hsv,

  keyword2hwb: keyword2hwb,

  keyword2cmyk: keyword2cmyk,

  keyword2lab: keyword2lab,

  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,

  xyz2lab: xyz2lab,

  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,

  lab2rgb: lab2rgb,

  lab2lch: lab2lch,

  lch2lab: lch2lab,

  lch2xyz: lch2xyz,

  lch2rgb: lch2rgb

};

function rgb2hsl(rgb) {

  var r = rgb[0]/255,

      g = rgb[1]/255,

      b = rgb[2]/255,

      min = Math.min(r, g, b),

      max = Math.max(r, g, b),

      delta = max - min,

      h, s, l;

  if (max == min)

    h = 0;

  else if (r == max)

    h = (g - b) / delta;

  else if (g == max)

    h = 2 + (b - r) / delta;

  else if (b == max)

    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)

    h += 360;

  l = (min + max) / 2;

  if (max == min)

    s = 0;

  else if (l <= 0.5)

    s = delta / (max + min);

  else

    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];

}

function rgb2hsv(rgb) {

  var r = rgb[0],

      g = rgb[1],

      b = rgb[2],

      min = Math.min(r, g, b),

      max = Math.max(r, g, b),

      delta = max - min,

      h, s, v;

  if (max == 0)

    s = 0;

  else

    s = (delta/max * 1000)/10;

  if (max == min)

    h = 0;

  else if (r == max)

    h = (g - b) / delta;

  else if (g == max)

    h = 2 + (b - r) / delta;

  else if (b == max)

    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)

    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];

}

function rgb2hwb(rgb) {

  var r = rgb[0],

      g = rgb[1],

      b = rgb[2],

      h = rgb2hsl(rgb)[0],

      w = 1/255 * Math.min(r, Math.min(g, b)),

      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];

}

function rgb2cmyk(rgb) {

  var r = rgb[0] / 255,

      g = rgb[1] / 255,

      b = rgb[2] / 255,

      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);

  c = (1 - r - k) / (1 - k) || 0;

  m = (1 - g - k) / (1 - k) || 0;

  y = (1 - b - k) / (1 - k) || 0;

  return [c * 100, m * 100, y * 100, k * 100];

}

function rgb2keyword(rgb) {

  return reverseKeywords[JSON.stringify(rgb)];

}

function rgb2xyz(rgb) {

  var r = rgb[0] / 255,

      g = rgb[1] / 255,

      b = rgb[2] / 255;

  // assume sRGB

  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);

  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);

  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);

  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);

  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];

}

function rgb2lab(rgb) {

  var xyz = rgb2xyz(rgb),

        x = xyz[0],

        y = xyz[1],

        z = xyz[2],

        l, a, b;

  x /= 95.047;

  y /= 100;

  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);

  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);

  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;

  a = 500 * (x - y);

  b = 200 * (y - z);

  return [l, a, b];

}

function rgb2lch(args) {

  return lab2lch(rgb2lab(args));

}

function hsl2rgb(hsl) {

  var h = hsl[0] / 360,

      s = hsl[1] / 100,

      l = hsl[2] / 100,

      t1, t2, t3, rgb, val;

  if (s == 0) {

    val = l * 255;

    return [val, val, val];

  }

  if (l < 0.5)

    t2 = l * (1 + s);

  else

    t2 = l + s - l * s;

  t1 = 2 * l - t2;

  rgb = [0, 0, 0];

  for (var i = 0; i < 3; i++) {

    t3 = h + 1 / 3 * - (i - 1);

    t3 < 0 && t3++;

    t3 > 1 && t3--;

    if (6 * t3 < 1)

      val = t1 + (t2 - t1) * 6 * t3;

    else if (2 * t3 < 1)

      val = t2;

    else if (3 * t3 < 2)

      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;

    else

      val = t1;

    rgb[i] = val * 255;

  }

  return rgb;

}

function hsl2hsv(hsl) {

  var h = hsl[0],

      s = hsl[1] / 100,

      l = hsl[2] / 100,

      sv, v;

  if(l === 0) {

      // no need to do calc on black

      // also avoids divide by 0 error

      return [0, 0, 0];

  }

  l *= 2;

  s *= (l <= 1) ? l : 2 - l;

  v = (l + s) / 2;

  sv = (2 * s) / (l + s);

  return [h, sv * 100, v * 100];

}

function hsl2hwb(args) {

  return rgb2hwb(hsl2rgb(args));

}

function hsl2cmyk(args) {

  return rgb2cmyk(hsl2rgb(args));

}

function hsl2keyword(args) {

  return rgb2keyword(hsl2rgb(args));

}

function hsv2rgb(hsv) {

  var h = hsv[0] / 60,

      s = hsv[1] / 100,

      v = hsv[2] / 100,

      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),

      p = 255 * v * (1 - s),

      q = 255 * v * (1 - (s * f)),

      t = 255 * v * (1 - (s * (1 - f))),

      v = 255 * v;

  switch(hi) {

    case 0:

      return [v, t, p];

    case 1:

      return [q, v, p];

    case 2:

      return [p, v, t];

    case 3:

      return [p, q, v];

    case 4:

      return [t, p, v];

    case 5:

      return [v, p, q];

  }

}

function hsv2hsl(hsv) {

  var h = hsv[0],

      s = hsv[1] / 100,

      v = hsv[2] / 100,

      sl, l;

  l = (2 - s) * v;

  sl = s * v;

  sl /= (l <= 1) ? l : 2 - l;

  sl = sl || 0;

  l /= 2;

  return [h, sl * 100, l * 100];

}

function hsv2hwb(args) {

  return rgb2hwb(hsv2rgb(args))

}

function hsv2cmyk(args) {

  return rgb2cmyk(hsv2rgb(args));

}

function hsv2keyword(args) {

  return rgb2keyword(hsv2rgb(args));

}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb

function hwb2rgb(hwb) {

  var h = hwb[0] / 360,

      wh = hwb[1] / 100,

      bl = hwb[2] / 100,

      ratio = wh + bl,

      i, v, f, n;

  // wh + bl cant be > 1

  if (ratio > 1) {

    wh /= ratio;

    bl /= ratio;

  }

  i = Math.floor(6 * h);

  v = 1 - bl;

  f = 6 * h - i;

  if ((i & 0x01) != 0) {

    f = 1 - f;

  }

  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {

    default:

    case 6:

    case 0: r = v; g = n; b = wh; break;

    case 1: r = n; g = v; b = wh; break;

    case 2: r = wh; g = v; b = n; break;

    case 3: r = wh; g = n; b = v; break;

    case 4: r = n; g = wh; b = v; break;

    case 5: r = v; g = wh; b = n; break;

  }

  return [r * 255, g * 255, b * 255];

}

function hwb2hsl(args) {

  return rgb2hsl(hwb2rgb(args));

}

function hwb2hsv(args) {

  return rgb2hsv(hwb2rgb(args));

}

function hwb2cmyk(args) {

  return rgb2cmyk(hwb2rgb(args));

}

function hwb2keyword(args) {

  return rgb2keyword(hwb2rgb(args));

}

function cmyk2rgb(cmyk) {

  var c = cmyk[0] / 100,

      m = cmyk[1] / 100,

      y = cmyk[2] / 100,

      k = cmyk[3] / 100,

      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);

  g = 1 - Math.min(1, m * (1 - k) + k);

  b = 1 - Math.min(1, y * (1 - k) + k);

  return [r * 255, g * 255, b * 255];

}

function cmyk2hsl(args) {

  return rgb2hsl(cmyk2rgb(args));

}

function cmyk2hsv(args) {

  return rgb2hsv(cmyk2rgb(args));

}

function cmyk2hwb(args) {

  return rgb2hwb(cmyk2rgb(args));

}

function cmyk2keyword(args) {

  return rgb2keyword(cmyk2rgb(args));

}

function xyz2rgb(xyz) {

  var x = xyz[0] / 100,

      y = xyz[1] / 100,

      z = xyz[2] / 100,

      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);

  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);

  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB

  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)

    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)

    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)

    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);

  g = Math.min(Math.max(0, g), 1);

  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];

}

function xyz2lab(xyz) {

  var x = xyz[0],

      y = xyz[1],

      z = xyz[2],

      l, a, b;

  x /= 95.047;

  y /= 100;

  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);

  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);

  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;

  a = 500 * (x - y);

  b = 200 * (y - z);

  return [l, a, b];

}

function xyz2lch(args) {

  return lab2lch(xyz2lab(args));

}

function lab2xyz(lab) {

  var l = lab[0],

      a = lab[1],

      b = lab[2],

      x, y, z, y2;

  if (l <= 8) {

    y = (l * 100) / 903.3;

    y2 = (7.787 * (y / 100)) + (16 / 116);

  } else {

    y = 100 * Math.pow((l + 16) / 116, 3);

    y2 = Math.pow(y / 100, 1/3);

  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];

}

function lab2lch(lab) {

  var l = lab[0],

      a = lab[1],

      b = lab[2],

      hr, h, c;

  hr = Math.atan2(b, a);

  h = hr * 360 / 2 / Math.PI;

  if (h < 0) {

    h += 360;

  }

  c = Math.sqrt(a * a + b * b);

  return [l, c, h];

}

function lab2rgb(args) {

  return xyz2rgb(lab2xyz(args));

}

function lch2lab(lch) {

  var l = lch[0],

      c = lch[1],

      h = lch[2],

      a, b, hr;

  hr = h / 360 * 2 * Math.PI;

  a = c * Math.cos(hr);

  b = c * Math.sin(hr);

  return [l, a, b];

}

function lch2xyz(args) {

  return lab2xyz(lch2lab(args));

}

function lch2rgb(args) {

  return lab2rgb(lch2lab(args));

}

function keyword2rgb(keyword) {

  return cssKeywords[keyword];

}

function keyword2hsl(args) {

  return rgb2hsl(keyword2rgb(args));

}

function keyword2hsv(args) {

  return rgb2hsv(keyword2rgb(args));

}

function keyword2hwb(args) {

  return rgb2hwb(keyword2rgb(args));

}

function keyword2cmyk(args) {

  return rgb2cmyk(keyword2rgb(args));

}

function keyword2lab(args) {

  return rgb2lab(keyword2rgb(args));

}

function keyword2xyz(args) {

  return rgb2xyz(keyword2rgb(args));

}

var cssKeywords = {

  aliceblue:  [240,248,255],

  antiquewhite: [250,235,215],

  aqua: [0,255,255],

  aquamarine: [127,255,212],

  azure:  [240,255,255],

  beige:  [245,245,220],

  bisque: [255,228,196],

  black:  [0,0,0],

  blanchedalmond: [255,235,205],

  blue: [0,0,255],

  blueviolet: [138,43,226],

  brown:  [165,42,42],

  burlywood:  [222,184,135],

  cadetblue:  [95,158,160],

  chartreuse: [127,255,0],

  chocolate:  [210,105,30],

  coral:  [255,127,80],

  cornflowerblue: [100,149,237],

  cornsilk: [255,248,220],

  crimson:  [220,20,60],

  cyan: [0,255,255],

  darkblue: [0,0,139],

  darkcyan: [0,139,139],

  darkgoldenrod:  [184,134,11],

  darkgray: [169,169,169],

  darkgreen:  [0,100,0],

  darkgrey: [169,169,169],

  darkkhaki:  [189,183,107],

  darkmagenta:  [139,0,139],

  darkolivegreen: [85,107,47],

  darkorange: [255,140,0],

  darkorchid: [153,50,204],

  darkred:  [139,0,0],

  darksalmon: [233,150,122],

  darkseagreen: [143,188,143],

  darkslateblue:  [72,61,139],

  darkslategray:  [47,79,79],

  darkslategrey:  [47,79,79],

  darkturquoise:  [0,206,209],

  darkviolet: [148,0,211],

  deeppink: [255,20,147],

  deepskyblue:  [0,191,255],

  dimgray:  [105,105,105],

  dimgrey:  [105,105,105],

  dodgerblue: [30,144,255],

  firebrick:  [178,34,34],

  floralwhite:  [255,250,240],

  forestgreen:  [34,139,34],

  fuchsia:  [255,0,255],

  gainsboro:  [220,220,220],

  ghostwhite: [248,248,255],

  gold: [255,215,0],

  goldenrod:  [218,165,32],

  gray: [128,128,128],

  green:  [0,128,0],

  greenyellow:  [173,255,47],

  grey: [128,128,128],

  honeydew: [240,255,240],

  hotpink:  [255,105,180],

  indianred:  [205,92,92],

  indigo: [75,0,130],

  ivory:  [255,255,240],

  khaki:  [240,230,140],

  lavender: [230,230,250],

  lavenderblush:  [255,240,245],

  lawngreen:  [124,252,0],

  lemonchiffon: [255,250,205],

  lightblue:  [173,216,230],

  lightcoral: [240,128,128],

  lightcyan:  [224,255,255],

  lightgoldenrodyellow: [250,250,210],

  lightgray:  [211,211,211],

  lightgreen: [144,238,144],

  lightgrey:  [211,211,211],

  lightpink:  [255,182,193],

  lightsalmon:  [255,160,122],

  lightseagreen:  [32,178,170],

  lightskyblue: [135,206,250],

  lightslategray: [119,136,153],

  lightslategrey: [119,136,153],

  lightsteelblue: [176,196,222],

  lightyellow:  [255,255,224],

  lime: [0,255,0],

  limegreen:  [50,205,50],

  linen:  [250,240,230],

  magenta:  [255,0,255],

  maroon: [128,0,0],

  mediumaquamarine: [102,205,170],

  mediumblue: [0,0,205],

  mediumorchid: [186,85,211],

  mediumpurple: [147,112,219],

  mediumseagreen: [60,179,113],

  mediumslateblue:  [123,104,238],

  mediumspringgreen:  [0,250,154],

  mediumturquoise:  [72,209,204],

  mediumvioletred:  [199,21,133],

  midnightblue: [25,25,112],

  mintcream:  [245,255,250],

  mistyrose:  [255,228,225],

  moccasin: [255,228,181],

  navajowhite:  [255,222,173],

  navy: [0,0,128],

  oldlace:  [253,245,230],

  olive:  [128,128,0],

  olivedrab:  [107,142,35],

  orange: [255,165,0],

  orangered:  [255,69,0],

  orchid: [218,112,214],

  palegoldenrod:  [238,232,170],

  palegreen:  [152,251,152],

  paleturquoise:  [175,238,238],

  palevioletred:  [219,112,147],

  papayawhip: [255,239,213],

  peachpuff:  [255,218,185],

  peru: [205,133,63],

  pink: [255,192,203],

  plum: [221,160,221],

  powderblue: [176,224,230],

  purple: [128,0,128],

  rebeccapurple: [102, 51, 153],

  red:  [255,0,0],

  rosybrown:  [188,143,143],

  royalblue:  [65,105,225],

  saddlebrown:  [139,69,19],

  salmon: [250,128,114],

  sandybrown: [244,164,96],

  seagreen: [46,139,87],

  seashell: [255,245,238],

  sienna: [160,82,45],

  silver: [192,192,192],

  skyblue:  [135,206,235],

  slateblue:  [106,90,205],

  slategray:  [112,128,144],

  slategrey:  [112,128,144],

  snow: [255,250,250],

  springgreen:  [0,255,127],

  steelblue:  [70,130,180],

  tan:  [210,180,140],

  teal: [0,128,128],

  thistle:  [216,191,216],

  tomato: [255,99,71],

  turquoise:  [64,224,208],

  violet: [238,130,238],

  wheat:  [245,222,179],

  white:  [255,255,255],

  whitesmoke: [245,245,245],

  yellow: [255,255,0],

  yellowgreen:  [154,205,50]

};

var reverseKeywords = {};

for (var key in cssKeywords) {

  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;

}

var convert = function() {

   return new Converter();

};

for (var func in conversions) {

  // export Raw versions

  convert[func + "Raw"] =  (function(func) {

    // accept array or plain args

    return function(arg) {

      if (typeof arg == "number")

        arg = Array.prototype.slice.call(arguments);

      return conversions[func](arg);

    }

  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),

      from = pair[1],

      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]

  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 

    return function(arg) {

      if (typeof arg == "number")

        arg = Array.prototype.slice.call(arguments);

      

      var val = conversions[func](arg);

      if (typeof val == "string" || val === undefined)

        return val; // keyword

      for (var i = 0; i < val.length; i++)

        val[i] = Math.round(val[i]);

      return val;

    }

  })(func);

}

/* Converter does lazy conversion and caching */

var Converter = function() {

   this.convs = {};

};

/* Either get the values for a space or

  set the values for a space, depending on args */

Converter.prototype.routeSpace = function(space, args) {

   var values = args[0];

   if (values === undefined) {

      // color.rgb()

      return this.getValues(space);

   }

   // color.rgb(10, 10, 10)

   if (typeof values == "number") {

      values = Array.prototype.slice.call(args);        

   }

   return this.setValues(space, values);

};

  

/* Set the values for a space, invalidating cache */

Converter.prototype.setValues = function(space, values) {

   this.space = space;

   this.convs = {};

   this.convs[space] = values;

   return this;

};

/* Get the values for a space. If there's already

  a conversion for the space, fetch it, otherwise

  compute it */

Converter.prototype.getValues = function(space) {

   var vals = this.convs[space];

   if (!vals) {

      var fspace = this.space,

          from = this.convs[fspace];

      vals = convert[fspace][space](from);

      this.convs[space] = vals;

   }

  return vals;

};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {

   Converter.prototype[space] = function(vals) {

      return this.routeSpace(space, arguments);

   };

});

var colorConvert = convert;

var colorName = {

	"aliceblue": [240, 248, 255],	"antiquewhite": [250, 235, 215],

	"aqua": [0, 255, 255],

	"aquamarine": [127, 255, 212],

	"azure": [240, 255, 255],

	"beige": [245, 245, 220],

	"bisque": [255, 228, 196],

	"black": [0, 0, 0],

	"blanchedalmond": [255, 235, 205],

	"blue": [0, 0, 255],

	"blueviolet": [138, 43, 226],

	"brown": [165, 42, 42],

	"burlywood": [222, 184, 135],

	"cadetblue": [95, 158, 160],

	"chartreuse": [127, 255, 0],

	"chocolate": [210, 105, 30],

	"coral": [255, 127, 80],

	"cornflowerblue": [100, 149, 237],

	"cornsilk": [255, 248, 220],

	"crimson": [220, 20, 60],

	"cyan": [0, 255, 255],

	"darkblue": [0, 0, 139],

	"darkcyan": [0, 139, 139],

	"darkgoldenrod": [184, 134, 11],

	"darkgray": [169, 169, 169],

	"darkgreen": [0, 100, 0],

	"darkgrey": [169, 169, 169],

	"darkkhaki": [189, 183, 107],

	"darkmagenta": [139, 0, 139],

	"darkolivegreen": [85, 107, 47],

	"darkorange": [255, 140, 0],

	"darkorchid": [153, 50, 204],

	"darkred": [139, 0, 0],

	"darksalmon": [233, 150, 122],

	"darkseagreen": [143, 188, 143],

	"darkslateblue": [72, 61, 139],

	"darkslategray": [47, 79, 79],

	"darkslategrey": [47, 79, 79],

	"darkturquoise": [0, 206, 209],

	"darkviolet": [148, 0, 211],

	"deeppink": [255, 20, 147],

	"deepskyblue": [0, 191, 255],

	"dimgray": [105, 105, 105],

	"dimgrey": [105, 105, 105],

	"dodgerblue": [30, 144, 255],

	"firebrick": [178, 34, 34],

	"floralwhite": [255, 250, 240],

	"forestgreen": [34, 139, 34],

	"fuchsia": [255, 0, 255],

	"gainsboro": [220, 220, 220],

	"ghostwhite": [248, 248, 255],

	"gold": [255, 215, 0],

	"goldenrod": [218, 165, 32],

	"gray": [128, 128, 128],

	"green": [0, 128, 0],

	"greenyellow": [173, 255, 47],

	"grey": [128, 128, 128],

	"honeydew": [240, 255, 240],

	"hotpink": [255, 105, 180],

	"indianred": [205, 92, 92],

	"indigo": [75, 0, 130],

	"ivory": [255, 255, 240],

	"khaki": [240, 230, 140],

	"lavender": [230, 230, 250],

	"lavenderblush": [255, 240, 245],

	"lawngreen": [124, 252, 0],

	"lemonchiffon": [255, 250, 205],

	"lightblue": [173, 216, 230],

	"lightcoral": [240, 128, 128],

	"lightcyan": [224, 255, 255],

	"lightgoldenrodyellow": [250, 250, 210],

	"lightgray": [211, 211, 211],

	"lightgreen": [144, 238, 144],

	"lightgrey": [211, 211, 211],

	"lightpink": [255, 182, 193],

	"lightsalmon": [255, 160, 122],

	"lightseagreen": [32, 178, 170],

	"lightskyblue": [135, 206, 250],

	"lightslategray": [119, 136, 153],

	"lightslategrey": [119, 136, 153],

	"lightsteelblue": [176, 196, 222],

	"lightyellow": [255, 255, 224],

	"lime": [0, 255, 0],

	"limegreen": [50, 205, 50],

	"linen": [250, 240, 230],

	"magenta": [255, 0, 255],

	"maroon": [128, 0, 0],

	"mediumaquamarine": [102, 205, 170],

	"mediumblue": [0, 0, 205],

	"mediumorchid": [186, 85, 211],

	"mediumpurple": [147, 112, 219],

	"mediumseagreen": [60, 179, 113],

	"mediumslateblue": [123, 104, 238],

	"mediumspringgreen": [0, 250, 154],

	"mediumturquoise": [72, 209, 204],

	"mediumvioletred": [199, 21, 133],

	"midnightblue": [25, 25, 112],

	"mintcream": [245, 255, 250],

	"mistyrose": [255, 228, 225],

	"moccasin": [255, 228, 181],

	"navajowhite": [255, 222, 173],

	"navy": [0, 0, 128],

	"oldlace": [253, 245, 230],

	"olive": [128, 128, 0],

	"olivedrab": [107, 142, 35],

	"orange": [255, 165, 0],

	"orangered": [255, 69, 0],

	"orchid": [218, 112, 214],

	"palegoldenrod": [238, 232, 170],

	"palegreen": [152, 251, 152],

	"paleturquoise": [175, 238, 238],

	"palevioletred": [219, 112, 147],

	"papayawhip": [255, 239, 213],

	"peachpuff": [255, 218, 185],

	"peru": [205, 133, 63],

	"pink": [255, 192, 203],

	"plum": [221, 160, 221],

	"powderblue": [176, 224, 230],

	"purple": [128, 0, 128],

	"rebeccapurple": [102, 51, 153],

	"red": [255, 0, 0],

	"rosybrown": [188, 143, 143],

	"royalblue": [65, 105, 225],

	"saddlebrown": [139, 69, 19],

	"salmon": [250, 128, 114],

	"sandybrown": [244, 164, 96],

	"seagreen": [46, 139, 87],

	"seashell": [255, 245, 238],

	"sienna": [160, 82, 45],

	"silver": [192, 192, 192],

	"skyblue": [135, 206, 235],

	"slateblue": [106, 90, 205],

	"slategray": [112, 128, 144],

	"slategrey": [112, 128, 144],

	"snow": [255, 250, 250],

	"springgreen": [0, 255, 127],

	"steelblue": [70, 130, 180],

	"tan": [210, 180, 140],

	"teal": [0, 128, 128],

	"thistle": [216, 191, 216],

	"tomato": [255, 99, 71],

	"turquoise": [64, 224, 208],

	"violet": [238, 130, 238],

	"wheat": [245, 222, 179],

	"white": [255, 255, 255],

	"whitesmoke": [245, 245, 245],

	"yellow": [255, 255, 0],

	"yellowgreen": [154, 205, 50]

};

/* MIT license */

var colorString = {

   getRgba: getRgba,

   getHsla: getHsla,

   getRgb: getRgb,

   getHsl: getHsl,

   getHwb: getHwb,

   getAlpha: getAlpha,

   hexString: hexString,

   rgbString: rgbString,

   rgbaString: rgbaString,

   percentString: percentString,

   percentaString: percentaString,

   hslString: hslString,

   hslaString: hslaString,

   hwbString: hwbString,

   keyword: keyword

};

function getRgba(string) {

   if (!string) {

      return;

   }

   var abbr =  /^#([a-fA-F0-9]{3,4})$/i,

       hex =  /^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i,

       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,

       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,

       keyword = /(\w+)/;

   var rgb = [0, 0, 0],

       a = 1,

       match = string.match(abbr),

       hexAlpha = "";

   if (match) {

      match = match[1];

      hexAlpha = match[3];

      for (var i = 0; i < rgb.length; i++) {

         rgb[i] = parseInt(match[i] + match[i], 16);

      }

      if (hexAlpha) {

         a = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;

      }
     }

   else if (match = string.match(hex)) {

      hexAlpha = match[2];

      match = match[1];

      for (var i = 0; i < rgb.length; i++) {

         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);

      }

      if (hexAlpha) {

         a = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;

      }

   }

   else if (match = string.match(rgba)) {

      for (var i = 0; i < rgb.length; i++) {

         rgb[i] = parseInt(match[i + 1]);

      }

      a = parseFloat(match[4]);

   }

   else if (match = string.match(per)) {

      for (var i = 0; i < rgb.length; i++) {

         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);

      }

      a = parseFloat(match[4]);

   }

   else if (match = string.match(keyword)) {

      if (match[1] == "transparent") {

         return [0, 0, 0, 0];

      }

      rgb = colorName[match[1]];

      if (!rgb) {

         return;

      }

   }

   for (var i = 0; i < rgb.length; i++) {

      rgb[i] = scale(rgb[i], 0, 255);

   }

   if (!a && a != 0) {

      a = 1;

   }

   else {

      a = scale(a, 0, 1);

   }

   rgb[3] = a;

   return rgb;

}

function getHsla(string) {

   if (!string) {

      return;

   }

   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;

   var match = string.match(hsl);

   if (match) {

      var alpha = parseFloat(match[4]);

      var h = scale(parseInt(match[1]), 0, 360),

          s = scale(parseFloat(match[2]), 0, 100),

          l = scale(parseFloat(match[3]), 0, 100),

          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);

      return [h, s, l, a];

   }

}

function getHwb(string) {

   if (!string) {

      return;

   }

   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;

   var match = string.match(hwb);

   if (match) {

    var alpha = parseFloat(match[4]);

      var h = scale(parseInt(match[1]), 0, 360),

          w = scale(parseFloat(match[2]), 0, 100),

          b = scale(parseFloat(match[3]), 0, 100),

          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);

      return [h, w, b, a];

   }

}

function getRgb(string) {

   var rgba = getRgba(string);

   return rgba && rgba.slice(0, 3);

}

function getHsl(string) {

  var hsla = getHsla(string);

  return hsla && hsla.slice(0, 3);

}

function getAlpha(string) {

   var vals = getRgba(string);

   if (vals) {

      return vals[3];

   }

   else if (vals = getHsla(string)) {

      return vals[3];

   }

   else if (vals = getHwb(string)) {

      return vals[3];

   }

}

// generators

function hexString(rgba, a) {

   var a = (a !== undefined && rgba.length === 3) ? a : rgba[3];

   return "#" + hexDouble(rgba[0]) 

              + hexDouble(rgba[1])

              + hexDouble(rgba[2])

              + (

                 (a >= 0 && a < 1)

                 ? hexDouble(Math.round(a * 255))

                 : ""

              );

}

function rgbString(rgba, alpha) {

   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {

      return rgbaString(rgba, alpha);

   }

   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";

}

function rgbaString(rgba, alpha) {

   if (alpha === undefined) {

      alpha = (rgba[3] !== undefined ? rgba[3] : 1);

   }

   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]

           + ", " + alpha + ")";

}

function percentString(rgba, alpha) {

   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {

      return percentaString(rgba, alpha);

   }

   var r = Math.round(rgba[0]/255 * 100),

       g = Math.round(rgba[1]/255 * 100),

       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";

}

function percentaString(rgba, alpha) {

   var r = Math.round(rgba[0]/255 * 100),

       g = Math.round(rgba[1]/255 * 100),

       b = Math.round(rgba[2]/255 * 100);

   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";

}

function hslString(hsla, alpha) {

   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {

      return hslaString(hsla, alpha);

   }

   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";

}

function hslaString(hsla, alpha) {

   if (alpha === undefined) {

      alpha = (hsla[3] !== undefined ? hsla[3] : 1);

   }

   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "

           + alpha + ")";

}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax

// (hwb have alpha optional & 1 is default value)

function hwbString(hwb, alpha) {

   if (alpha === undefined) {

      alpha = (hwb[3] !== undefined ? hwb[3] : 1);

   }

   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"

           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";

}

function keyword(rgb) {

  return reverseNames[rgb.slice(0, 3)];

}

// helpers

function scale(num, min, max) {

   return Math.min(Math.max(min, num), max);

}

function hexDouble(num) {

  var str = num.toString(16).toUpperCase();

  return (str.length < 2) ? "0" + str : str;

}

//create a list of reverse color names

var reverseNames = {};

for (var name in colorName) {

   reverseNames[colorName[name]] = name;

}

/* MIT license */

var Color = function (obj) {

	if (obj instanceof Color) {

		return obj;

	}

	if (!(this instanceof Color)) {

		return new Color(obj);

	}

	this.valid = false;

	this.values = {

		rgb: [0, 0, 0],

		hsl: [0, 0, 0],

		hsv: [0, 0, 0],

		hwb: [0, 0, 0],

		cmyk: [0, 0, 0, 0],

		alpha: 1

	};

	// parse Color() argument

	var vals;

	if (typeof obj === 'string') {

		vals = colorString.getRgba(obj);

		if (vals) {

			this.setValues('rgb', vals);

		} else if (vals = colorString.getHsla(obj)) {

			this.setValues('hsl', vals);

		} else if (vals = colorString.getHwb(obj)) {

			this.setValues('hwb', vals);

		}

	} else if (typeof obj === 'object') {

		vals = obj;

		if (vals.r !== undefined || vals.red !== undefined) {

			this.setValues('rgb', vals);

		} else if (vals.l !== undefined || vals.lightness !== undefined) {

			this.setValues('hsl', vals);

		} else if (vals.v !== undefined || vals.value !== undefined) {

			this.setValues('hsv', vals);

		} else if (vals.w !== undefined || vals.whiteness !== undefined) {

			this.setValues('hwb', vals);

		} else if (vals.c !== undefined || vals.cyan !== undefined) {

			this.setValues('cmyk', vals);

		}

	}

};

Color.prototype = {

	isValid: function () {

		return this.valid;

	},

	rgb: function () {

		return this.setSpace('rgb', arguments);

	},

	hsl: function () {

		return this.setSpace('hsl', arguments);

	},

	hsv: function () {

		return this.setSpace('hsv', arguments);

	},

	hwb: function () {

		return this.setSpace('hwb', arguments);

	},

	cmyk: function () {

		return this.setSpace('cmyk', arguments);

	},

	rgbArray: function () {

		return this.values.rgb;

	},

	hslArray: function () {

		return this.values.hsl;

	},

	hsvArray: function () {

		return this.values.hsv;

	},

	hwbArray: function () {

		var values = this.values;

		if (values.alpha !== 1) {

			return values.hwb.concat([values.alpha]);

		}

		return values.hwb;

	},

	cmykArray: function () {

		return this.values.cmyk;

	},

	rgbaArray: function () {

		var values = this.values;

		return values.rgb.concat([values.alpha]);

	},

	hslaArray: function () {

		var values = this.values;

		return values.hsl.concat([values.alpha]);

	},

	alpha: function (val) {

		if (val === undefined) {

			return this.values.alpha;

		}

		this.setValues('alpha', val);

		return this;

	},

	red: function (val) {

		return this.setChannel('rgb', 0, val);

	},

	green: function (val) {

		return this.setChannel('rgb', 1, val);

	},

	blue: function (val) {

		return this.setChannel('rgb', 2, val);

	},

	hue: function (val) {

		if (val) {

			val %= 360;

			val = val < 0 ? 360 + val : val;

		}

		return this.setChannel('hsl', 0, val);

	},

	saturation: function (val) {

		return this.setChannel('hsl', 1, val);

	},

	lightness: function (val) {

		return this.setChannel('hsl', 2, val);

	},

	saturationv: function (val) {

		return this.setChannel('hsv', 1, val);

	},

	whiteness: function (val) {

		return this.setChannel('hwb', 1, val);

	},

	blackness: function (val) {

		return this.setChannel('hwb', 2, val);

	},

	value: function (val) {

		return this.setChannel('hsv', 2, val);

	},

	cyan: function (val) {

		return this.setChannel('cmyk', 0, val);

	},

	magenta: function (val) {

		return this.setChannel('cmyk', 1, val);

	},

	yellow: function (val) {

		return this.setChannel('cmyk', 2, val);

	},

	black: function (val) {

		return this.setChannel('cmyk', 3, val);

	},

	hexString: function () {

		return colorString.hexString(this.values.rgb);

	},

	rgbString: function () {

		return colorString.rgbString(this.values.rgb, this.values.alpha);

	},

	rgbaString: function () {

		return colorString.rgbaString(this.values.rgb, this.values.alpha);

	},

	percentString: function () {

		return colorString.percentString(this.values.rgb, this.values.alpha);

	},

	hslString: function () {

		return colorString.hslString(this.values.hsl, this.values.alpha);

	},

	hslaString: function () {

		return colorString.hslaString(this.values.hsl, this.values.alpha);

	},

	hwbString: function () {

		return colorString.hwbString(this.values.hwb, this.values.alpha);

	},

	keyword: function () {

		return colorString.keyword(this.values.rgb, this.values.alpha);

	},

	rgbNumber: function () {

		var rgb = this.values.rgb;

		return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];

	},

	luminosity: function () {

		// http://www.w3.org/TR/WCAG20/#relativeluminancedef

		var rgb = this.values.rgb;

		var lum = [];

		for (var i = 0; i < rgb.length; i++) {

			var chan = rgb[i] / 255;

			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);

		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];

	},

	contrast: function (color2) {

		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef

		var lum1 = this.luminosity();

		var lum2 = color2.luminosity();

		if (lum1 > lum2) {

			return (lum1 + 0.05) / (lum2 + 0.05);

		}

		return (lum2 + 0.05) / (lum1 + 0.05);

	},

	level: function (color2) {

		var contrastRatio = this.contrast(color2);

		if (contrastRatio >= 7.1) {

			return 'AAA';

		}

		return (contrastRatio >= 4.5) ? 'AA' : '';

	},

	dark: function () {

		// YIQ equation from http://24ways.org/2010/calculating-color-contrast

		var rgb = this.values.rgb;

		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

		return yiq < 128;

	},

	light: function () {

		return !this.dark();

	},

	negate: function () {

		var rgb = [];

		for (var i = 0; i < 3; i++) {

			rgb[i] = 255 - this.values.rgb[i];

		}

		this.setValues('rgb', rgb);

		return this;

	},

	lighten: function (ratio) {

		var hsl = this.values.hsl;

		hsl[2] += hsl[2] * ratio;

		this.setValues('hsl', hsl);

		return this;

	},

	darken: function (ratio) {

		var hsl = this.values.hsl;

		hsl[2] -= hsl[2] * ratio;

		this.setValues('hsl', hsl);

		return this;

	},

	saturate: function (ratio) {

		var hsl = this.values.hsl;

		hsl[1] += hsl[1] * ratio;

		this.setValues('hsl', hsl);

		return this;

	},

	desaturate: function (ratio) {

		var hsl = this.values.hsl;

		hsl[1] -= hsl[1] * ratio;

		this.setValues('hsl', hsl);

		return this;

	},

	whiten: function (ratio) {

		var hwb = this.values.hwb;

		hwb[1] += hwb[1] * ratio;

		this.setValues('hwb', hwb);

		return this;

	},

	blacken: function (ratio) {

		var hwb = this.values.hwb;

		hwb[2] += hwb[2] * ratio;

		this.setValues('hwb', hwb);

		return this;

	},

	greyscale: function () {

		var rgb = this.values.rgb;

		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale

		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;

		this.setValues('rgb', [val, val, val]);

		return this;

	},

	clearer: function (ratio) {

		var alpha = this.values.alpha;

		this.setValues('alpha', alpha - (alpha * ratio));

		return this;

	},

	opaquer: function (ratio) {

		var alpha = this.values.alpha;

		this.setValues('alpha', alpha + (alpha * ratio));

		return this;

	},

	rotate: function (degrees) {

		var hsl = this.values.hsl;

		var hue = (hsl[0] + degrees) % 360;

		hsl[0] = hue < 0 ? 360 + hue : hue;

		this.setValues('hsl', hsl);

		return this;

	},

	/**

	 * Ported from sass implementation in C

	 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209

	 */

	mix: function (mixinColor, weight) {

		var color1 = this;

		var color2 = mixinColor;

		var p = weight === undefined ? 0.5 : weight;

		var w = 2 * p - 1;

		var a = color1.alpha() - color2.alpha();

		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;

		var w2 = 1 - w1;

		return this

			.rgb(

				w1 * color1.red() + w2 * color2.red(),

				w1 * color1.green() + w2 * color2.green(),

				w1 * color1.blue() + w2 * color2.blue()

			)

			.alpha(color1.alpha() * p + color2.alpha() * (1 - p));

	},

	toJSON: function () {

		return this.rgb();

	},

	clone: function () {

		// NOTE(SB): using node-clone creates a dependency to Buffer when using browserify,

		// making the final build way to big to embed in Chart.js. So let's do it manually,

		// assuming that values to clone are 1 dimension arrays containing only numbers,

		// except 'alpha' which is a number.

		var result = new Color();

		var source = this.values;

		var target = result.values;

		var value, type;

		for (var prop in source) {

			if (source.hasOwnProperty(prop)) {

				value = source[prop];

				type = ({}).toString.call(value);

				if (type === '[object Array]') {

					target[prop] = value.slice(0);

				} else if (type === '[object Number]') {

					target[prop] = value;

				} else {

					console.error('unexpected color value:', value);

				}

			}

		}

		return result;

	}

};

Color.prototype.spaces = {

	rgb: ['red', 'green', 'blue'],

	hsl: ['hue', 'saturation', 'lightness'],

	hsv: ['hue', 'saturation', 'value'],

	hwb: ['hue', 'whiteness', 'blackness'],

	cmyk: ['cyan', 'magenta', 'yellow', 'black']

};

Color.prototype.maxes = {

	rgb: [255, 255, 255],

	hsl: [360, 100, 100],

	hsv: [360, 100, 100],

	hwb: [360, 100, 100],

	cmyk: [100, 100, 100, 100]

};

Color.prototype.getValues = function (space) {

	var values = this.values;

	var vals = {};

	for (var i = 0; i < space.length; i++) {

		vals[space.charAt(i)] = values[space][i];

	}

	if (values.alpha !== 1) {

		vals.a = values.alpha;

	}

	// {r: 255, g: 255, b: 255, a: 0.4}

	return vals;

};

Color.prototype.setValues = function (space, vals) {

	var values = this.values;

	var spaces = this.spaces;

	var maxes = this.maxes;

	var alpha = 1;

	var i;

	this.valid = true;

	if (space === 'alpha') {

		alpha = vals;

	} else if (vals.length) {

		// [10, 10, 10]

		values[space] = vals.slice(0, space.length);

		alpha = vals[space.length];

	} else if (vals[space.charAt(0)] !== undefined) {

		// {r: 10, g: 10, b: 10}

		for (i = 0; i < space.length; i++) {

			values[space][i] = vals[space.charAt(i)];

		}

		alpha = vals.a;

	} else if (vals[spaces[space][0]] !== undefined) {

		// {red: 10, green: 10, blue: 10}

		var chans = spaces[space];

		for (i = 0; i < space.length; i++) {

			values[space][i] = vals[chans[i]];

		}

		alpha = vals.alpha;

	}

	values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));

	if (space === 'alpha') {

		return false;

	}

	var capped;

	// cap values of the space prior converting all values

	for (i = 0; i < space.length; i++) {

		capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));

		values[space][i] = Math.round(capped);

	}

	// convert to all the other color spaces

	for (var sname in spaces) {

		if (sname !== space) {

			values[sname] = colorConvert[space][sname](values[space]);

		}

	}

	return true;

};

Color.prototype.setSpace = function (space, args) {

	var vals = args[0];

	if (vals === undefined) {

		// color.rgb()

		return this.getValues(space);

	}

	// color.rgb(10, 10, 10)

	if (typeof vals === 'number') {

		vals = Array.prototype.slice.call(args);

	}

	this.setValues(space, vals);

	return this;

};

Color.prototype.setChannel = function (space, index, val) {

	var svalues = this.values[space];

	if (val === undefined) {

		// color.red()

		return svalues[index];

	} else if (val === svalues[index]) {

		// color.red(color.red())

		return this;

	}

	// color.red(100)

	svalues[index] = val;

	this.setValues(space, svalues);

	return this;

};

if (typeof window !== 'undefined') {

	window.Color = Color;

}

var chartjsColor = Color;

/**

 * @namespace Chart.helpers

 */

var helpers = {

	/**

	 * An empty function that can be used, for example, for optional callback.

	 */

	noop: function() {},

	/**

	 * Returns a unique id, sequentially generated from a global variable.

	 * @returns {number}

	 * @function

	 */

	uid: (function() {

		var id = 0;

		return function() {

			return id++;

		};

	}()),

	/**

	 * Returns true if `value` is neither null nor undefined, else returns false.

	 * @param {*} value - The value to test.

	 * @returns {boolean}

	 * @since 2.7.0

	 */

	isNullOrUndef: function(value) {

		return value === null || typeof value === 'undefined';

	},

	/**

	 * Returns true if `value` is an array (including typed arrays), else returns false.

	 * @param {*} value - The value to test.

	 * @returns {boolean}

	 * @function

	 */

	isArray: function(value) {

		if (Array.isArray && Array.isArray(value)) {

			return true;

		}

		var type = Object.prototype.toString.call(value);

		if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {

			return true;

		}

		return false;

	},

	/**

	 * Returns true if `value` is an object (excluding null), else returns false.

	 * @param {*} value - The value to test.

	 * @returns {boolean}

	 * @since 2.7.0

	 */

	isObject: function(value) {

		return value !== null && Object.prototype.toString.call(value) === '[object Object]';

	},

	/**

	 * Returns true if `value` is a finite number, else returns false

	 * @param {*} value  - The value to test.

	 * @returns {boolean}

	 */

	isFinite: function(value) {

		return (typeof value === 'number' || value instanceof Number) && isFinite(value);

	},

	/**

	 * Returns `value` if defined, else returns `defaultValue`.

	 * @param {*} value - The value to return if defined.

	 * @param {*} defaultValue - The value to return if `value` is undefined.

	 * @returns {*}

	 */

	valueOrDefault: function(value, defaultValue) {

		return typeof value === 'undefined' ? defaultValue : value;

	},

	/**

	 * Returns value at the given `index` in array if defined, else returns `defaultValue`.

	 * @param {Array} value - The array to lookup for value at `index`.

	 * @param {number} index - The index in `value` to lookup for value.

	 * @param {*} defaultValue - The value to return if `value[index]` is undefined.

	 * @returns {*}

	 */

	valueAtIndexOrDefault: function(value, index, defaultValue) {

		return helpers.valueOrDefault(helpers.isArray(value) ? value[index] : value, defaultValue);

	},

	/**

	 * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the

	 * value returned by `fn`. If `fn` is not a function, this method returns undefined.

	 * @param {function} fn - The function to call.

	 * @param {Array|undefined|null} args - The arguments with which `fn` should be called.

	 * @param {object} [thisArg] - The value of `this` provided for the call to `fn`.

	 * @returns {*}

	 */

	callback: function(fn, args, thisArg) {

		if (fn && typeof fn.call === 'function') {

			return fn.apply(thisArg, args);

		}

	},

	/**

	 * Note(SB) for performance sake, this method should only be used when loopable type

	 * is unknown or in none intensive code (not called often and small loopable). Else

	 * it's preferable to use a regular for() loop and save extra function calls.

	 * @param {object|Array} loopable - The object or array to be iterated.

	 * @param {function} fn - The function to call for each item.

	 * @param {object} [thisArg] - The value of `this` provided for the call to `fn`.

	 * @param {boolean} [reverse] - If true, iterates backward on the loopable.

	 */

	each: function(loopable, fn, thisArg, reverse) {

		var i, len, keys;

		if (helpers.isArray(loopable)) {

			len = loopable.length;

			if (reverse) {

				for (i = len - 1; i >= 0; i--) {

					fn.call(thisArg, loopable[i], i);

				}

			} else {

				for (i = 0; i < len; i++) {

					fn.call(thisArg, loopable[i], i);

				}

			}

		} else if (helpers.isObject(loopable)) {

			keys = Object.keys(loopable);

			len = keys.length;

			for (i = 0; i < len; i++) {

				fn.call(thisArg, loopable[keys[i]], keys[i]);

			}

		}

	},

	/**

	 * Returns true if the `a0` and `a1` arrays have the same content, else returns false.

	 * @see https://stackoverflow.com/a/14853974

	 * @param {Array} a0 - The array to compare

	 * @param {Array} a1 - The array to compare

	 * @returns {boolean}

	 */

	arrayEquals: function(a0, a1) {

		var i, ilen, v0, v1;

		if (!a0 || !a1 || a0.length !== a1.length) {

			return false;

		}

		for (i = 0, ilen = a0.length; i < ilen; ++i) {

			v0 = a0[i];

			v1 = a1[i];

			if (v0 instanceof Array && v1 instanceof Array) {

				if (!helpers.arrayEquals(v0, v1)) {

					return false;

				}

			} else if (v0 !== v1) {

				// NOTE: two different object instances will never be equal: {x:20} != {x:20}

				return false;

			}

		}

		return true;

	},

	/**

	 * Returns a deep copy of `source` without keeping references on objects and arrays.

	 * @param {*} source - The value to clone.

	 * @returns {*}

	 */

	clone: function(source) {

		if (helpers.isArray(source)) {

			return source.map(helpers.clone);

		}

		if (helpers.isObject(source)) {

			var target = {};

			var keys = Object.keys(source);

			var klen = keys.length;

			var k = 0;

			for (; k < klen; ++k) {

				target[keys[k]] = helpers.clone(source[keys[k]]);

			}

			return target;

		}

		return source;

	},

	/**

	 * The default merger when Chart.helpers.merge is called without merger option.

	 * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.

	 * @private

	 */

	_merger: function(key, target, source, options) {

		var tval = target[key];

		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {

			helpers.merge(tval, sval, options);

		} else {

			target[key] = helpers.clone(sval);

		}

	},

	/**

	 * Merges source[key] in target[key] only if target[key] is undefined.

	 * @private

	 */

	_mergerIf: function(key, target, source) {

		var tval = target[key];

		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {

			helpers.mergeIf(tval, sval);

		} else if (!target.hasOwnProperty(key)) {

			target[key] = helpers.clone(sval);

		}

	},

	/**

	 * Recursively deep copies `source` properties into `target` with the given `options`.

	 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.

	 * @param {object} target - The target object in which all sources are merged into.

	 * @param {object|object[]} source - Object(s) to merge into `target`.

	 * @param {object} [options] - Merging options:

	 * @param {function} [options.merger] - The merge method (key, target, source, options)

	 * @returns {object} The `target` object.

	 */

	merge: function(target, source, options) {

		var sources = helpers.isArray(source) ? source : [source];

		var ilen = sources.length;

		var merge, i, keys, klen, k;

		if (!helpers.isObject(target)) {

			return target;

		}

		options = options || {};

		merge = options.merger || helpers._merger;

		for (i = 0; i < ilen; ++i) {

			source = sources[i];

			if (!helpers.isObject(source)) {

				continue;

			}

			keys = Object.keys(source);

			for (k = 0, klen = keys.length; k < klen; ++k) {

				merge(keys[k], target, source, options);

			}

		}

		return target;

	},

	/**

	 * Recursively deep copies `source` properties into `target` *only* if not defined in target.

	 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.

	 * @param {object} target - The target object in which all sources are merged into.

	 * @param {object|object[]} source - Object(s) to merge into `target`.

	 * @returns {object} The `target` object.

	 */

	mergeIf: function(target, source) {

		return helpers.merge(target, source, {merger: helpers._mergerIf});

	},

	/**

	 * Applies the contents of two or more objects together into the first object.

	 * @param {object} target - The target object in which all objects are merged into.

	 * @param {object} arg1 - Object containing additional properties to merge in target.

	 * @param {object} argN - Additional objects containing properties to merge in target.

	 * @returns {object} The `target` object.

	 */

	extend: function(target) {

		var setFn = function(value, key) {

			target[key] = value;

		};

		for (var i = 1, ilen = arguments.length; i < ilen; ++i) {

			helpers.each(arguments[i], setFn);

		}

		return target;

	},

	/**

	 * Basic javascript inheritance based on the model created in Backbone.js

	 */

	inherits: function(extensions) {

		var me = this;

		var ChartElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() {

			return me.apply(this, arguments);

		};

		var Surrogate = function() {

			this.constructor = ChartElement;

		};

		Surrogate.prototype = me.prototype;

		ChartElement.prototype = new Surrogate();

		ChartElement.extend = helpers.inherits;

		if (extensions) {

			helpers.extend(ChartElement.prototype, extensions);

		}

		ChartElement.__super__ = me.prototype;

		return ChartElement;

	}

};

var helpers_core = helpers;

// DEPRECATIONS

/**

 * Provided for backward compatibility, use Chart.helpers.callback instead.

 * @function Chart.helpers.callCallback

 * @deprecated since version 2.6.0

 * @todo remove at version 3

 * @private
