const throttle = (fn, delay) => {
  let lastTime = 0;
  let timer = null;

  return function (...args) {
    const now = new Date.now();
    const remaining = delay - (now - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = now;
      }, remaining);
    }
  };
};

const findNonRepeat = (value) => {
  value.split("").forEach((val, index, arry) => {
    if (arry[index + 1] && val === arry[index + 1]) {
      return;
    } else {
      return val;
    }
  });
};
