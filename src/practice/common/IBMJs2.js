const longestSubString = (str) => {
  const set = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < set.length; right++) {
    while (set.has(str[right])) {
      set.delete(str[left]);
      left++;
    }

    set.add(str[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
};

const isAnagram = (s, t) => {
  if (s.length !== t.length) return false;

  const map = new Map();

  for (let char of s) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  for (let char of t) {
    if (!map.har(char)) return false;
    map.set(char, map.get(char) - 1);
  }

  for (let val of map.values()) {
    if (val !== 0) return false;
  }

  return true;
};

const moveZero = (arr) => {
  let insertPos = 0;

  for (let i; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[insertPos], arr[i]] = [arr[i], arr[insertPos]];
      insertPos++;
    }
  }

  return arr;
};

const hashmapTest = (arr) => {
  const map = new map();

  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];

    if (map.has()) {
    }

    map.set(x, i);
  }
};

const slidingWindow = (str) => {
  let set = new Set();
  let left = 0;

  for (let right = 0; right < str.length; right++) {
    while (set.has(str[right])) {
      set.delete(str[left]);
      left++;
    }
    set.add(str[right]);
  }
};

const twoPointer1 = (str) => {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    right--;
    left++;
  }
};

const twoPointer2 = (arr) => {
  let insertPos = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      [arr[insertPos], arr[i]] = [arr[i], arr[insertPos]];
      insertPos++;
    }
  }
};

const kadane = (arr) => {
  let max = arr[0];
  let curr = arr[0];

  for (let i = 0; i < arr.length; i++) {}
};
