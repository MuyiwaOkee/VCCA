import { floor, log10 } from "mathjs";

 // gets divisor and suffix to reduce visual scale of datapoints on the graph. 
export const GetSuffix = (minValue: number) => {
    const exponent = floor(log10(minValue))

    const divisor = 10 ** exponent;
    
    let suffix = ''
    switch (divisor) {
      case 10:
        suffix = '(tens)'
        break;

      case 100:
        suffix = '(hundreds)'
        break;

      case 1000:
        suffix = '(thousands)'
        break;

      case 10000:
        suffix = '(ten-thousands)'
        break;

      case 100000:
        suffix = '(hundred-thousands)'
        break;

      case 1000000:
        suffix = '(millions)'
        break;
    
      default:
        break;
    }

    return { divisor, suffix }
  }