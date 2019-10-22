export function generateBoxes() {
  let result = getFinalSort(10);
  // let htmlStr = "";
  let arr = []
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      let pos = result[i][j];
      // console.log(pos + "\t");
      // htmlStr += `<li id="box${pos}"></li>`;
      arr.push({ pos })
    }
    // console.log("\n");
  }
  // return htmlStr;
  return arr;
}

export function getFinalSort(num) {
  let ary = [];
  for (let i = 0; i < 10; i++) {
    ary[i] = [];
  }
  let start = 1;

  for (let i = 1; i < 2 * num; i++) {
    if (i <= num) {
      let startPoint = i - 1;

      for (let j = 0; j < i; j++) {
        ary[startPoint--][j] = start++; // 方向都是从j=0的方向开始
      }
    } else {
      let foot = num - 1;
      let footEnd = i - num;

      for (let k = 0; k < 2 * num - i; k++) {
        if (num % 2 === 1) {
          // 考虑sqrt为奇数和偶数情况
          if (i % 2 === 1) {
            // sqrt为奇数，i则为偶数
            ary[foot--][footEnd++] = start++;
          } else {
            ary[footEnd++][foot--] = start++;
          }
        } else if (num % 2 === 0) {
          if (i % 2 === 0) {
            ary[foot--][footEnd++] = start++;
          } else {
            ary[footEnd++][foot--] = start++;
          }
        }
      }
    }
  }

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      // console.log(ary[i][j] + "\t");
    }
  }
  return ary;
}

// rgb to hex
export function rgbToHex(r, g, b) {
  let hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

// hex to rgb
export function hexToRgb(hex) {
  let rgb = [];
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
  }
  return rgb;
}

// 计算渐变过渡色
export function calcGradient(startColor, endColor, step) {
  // 将 hex 转换为rgb
  let sColor = hexToRgb(startColor),
    eColor = hexToRgb(endColor);

  // 计算R\G\B每一步的差值
  let rStep = (eColor[0] - sColor[0]) / step;
  let gStep = (eColor[1] - sColor[1]) / step;
  let bStep = (eColor[2] - sColor[2]) / step;

  let gradientColorArr = [];
  for (let i = 0; i < step; i++) {
    // 计算每一步的hex值
    gradientColorArr.push(
      rgbToHex(
        parseInt(rStep * i + sColor[0]),
        parseInt(gStep * i + sColor[1]),
        parseInt(bStep * i + sColor[2])
      )
    );
  }
  return gradientColorArr;
}