/**
 * Find the first non-repeating character in a string
 * input: "aabccdeff", output: "b"
 */

const findNonRepeat = (str) => {
  const map = new Map();

  // Step 1: count frequency
  for (let char of str) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  // Step 2: find first non-repeating
  for (let char of str) {
    if (map.get(char) === 1) {
      return char;
    }
  }

  return null;
};

/**
 * Longest substring without repeating charactersv
 * input: "abcabcbb", output: 3 ("abc")
 */

const longestSubString = (str) => {
  const set = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < str.length; right++) {
    while (set.has(str[right])) {
      set.delete(str[left]);
      left++;
    }

    set.add(str[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
};

/**
 * Flatten a nested array
 * [1, [2, [3, 4]], 5] → [1, 2, 3, 4, 5]
 */

const flatten = (arr) => {
  const newArr = [];

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      newArr.push(...flatten(item)); // 🔥 fix
    } else {
      newArr.push(item);
    }
  });

  return newArr;
};

/**
 * Given an array, return indices of two numbers that add up to target
 * nums = [2, 7, 11, 15], target = 9  output = [0, 1]
 */

const twoSum = (nums, target) => {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }
};

/**
 * Check if two strings are anagrams
 * "listen", "silent" → true , "rat", "car" → false
 */

const isAnagram = (s, t) => {
  if (s.length !== t.length) return false;

  const map = new Map();

  // count s
  for (let char of s) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  // subtract using t
  for (let char of t) {
    if (!map.has(char)) return false;
    map.set(char, map.get(char) - 1);
  }

  // check all zero
  for (let val of map.values()) {
    if (val !== 0) return false;
  }

  return true;
};

/**
 * Move all zeros to end (maintain order)
 * [0,1,0,3,12] → [1,3,12,0,0]
 */

const moveZero = (arr) => {
  let zeroArr = [];
  let filteredArr = [];
  arr.forEach((item) => {
    if (item === 0) {
      zeroArr.push(item);
    } else {
      filteredArr.push(item);
    }
  });

  return [...filteredArr, ...zeroArr];
};
