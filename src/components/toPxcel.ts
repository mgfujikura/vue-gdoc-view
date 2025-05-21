const unitRegex = /([^\d]+$)/;
const numberRegex = /^\d+(\.\d+)$/;

class ToPxError extends Error {}

const toPx = (value: number | string, baseSize: number | undefined): number => {
  if (typeof value === 'number') {
    return value;
  }
  const found = value.match(unitRegex);
  if (found === null) {
    // 単位無し
    if (numberRegex.test(value)) {
      return parseFloat(value); // 数字のみの場合はpxと判断
    } else {
      throw new ToPxError(`invalid valid: ${value}`);
    }
  }
  const unit = found[0];
  const num = parseFloat(value.substring(0, value.length - unit.length));
  switch (unit) {
    case 'px':
      return num;
    case '%':
      if (baseSize === undefined) {
        throw new Error(`no parent size: ${value}`);
      }
      return (baseSize * num) / 100;
    case 'vh':
      return (window.document.querySelector('html')!.clientHeight * num) / 100;
    case 'vw':
      return (window.document.querySelector('html')!.clientWidth * num) / 100;
    case 'vmax': {
      const html = window.document.querySelector('html')!;
      const max = Math.max(html.clientHeight, html.clientWidth);
      return (max * num) / 100;
    }
    case 'vmin': {
      const html = window.document.querySelector('html')!;
      const min = Math.min(html.clientHeight, html.clientWidth);
      return (min * num) / 100;
    }
    default:
      throw new Error(`not supported unit: ${value}`);
  }
};
export default toPx;
