package org.example;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

public class Algo {

    public static void main(String[] args) {
    }

    static void uniqueInMatrixMap(int[][] arr){
        
    }

    // Codility Draw Table
    public static String codilityDrawTable(int[] A, int K, int index, String table) {
        if (A == null || A.length == 0 || K <= 0) {
            return "Invalid input";
        }
        int longest = getLongest(A);
        if (index >= A.length) {
            int widthLength = K;
            boolean isLastCell = (index - 1) % K == K - 1;
            boolean isJustNormalCellNotLast = (index % K < K - 1) && (index % K != 0);
            if (isJustNormalCellNotLast) {
                table += "\n";
            }
            table += "+";
            if (!isLastCell) {
                widthLength = index % K;
            }
            for (int j = 0; j < widthLength; j++) {
                for (int k = 0; k < longest; k++) {
                    table += "-";
                }
                table += "+";
            }
            table += "\n";
            return table;
        }
        if (index % K == 0) {
            table += "+";
            int width = A.length / K == 0 ? A.length % K : K;
            for (int j = 0; j < width; j++) {
                for (int k = 0; k < longest; k++) {
                    table += "-";
                }
                table += "+";
            }
            table += "\n";
            table += "|";
        }
        table += String.format("%" + longest + "d|", A[index]);
        if (index % K == K - 1) {
            table += "\n";
        }
        return codilityDrawTable(A, K, index + 1, table);
    }

    public static int getDigits(int n) {
        if (n < 10) {
            return 1;
        }
        return 1 + getDigits(n / 10);
    }

    public static int getLongest(int[] A) {
        int longest = 0;
        for (int n : A) {
            longest = Math.max(longest, getDigits(n));
        }
        return longest;
    }

    // https://leetcode.com/problems/contains-duplicate-ii/
    static boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> m = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (m.containsKey(nums[i])) {
                int x = m.get(nums[i]);
                int y = Math.abs(x - i);
                if ((x == nums[i]) && (y <= k))
                    return true;
            } else {
                m.put(nums[i], i);
            }
        }
        return false;
        // var s = new HashSet<Integer>(nums.length / 2);
        // int c = 0;
        // for (int i = 0; i < nums.length; i++) {
        // if (s.contains(nums[i])) {
        // int x = Math.abs(c - i);
        // if (x <= k && (s. == nums[i])) return true;
        // c = i;
        // continue;
        // }
        // s.add(nums[i]);
        // }
        // return false;
    }

    // https://leetcode.com/problems/contains-duplicate/
    static boolean containsDuplicateHashMap(int[] nums) {
        Map<Integer, Integer> m = new HashMap<>();
        for (int e : nums) {
            if (m.containsKey(e)) {
                int x = m.get(e);
                m.put(e, ++x);
                if (x == 1)
                    return true;
            } else {
                m.put(e, 0);
            }
        }
        return false;
    }

    // https://leetcode.com/problems/contains-duplicate/
    static boolean containsDuplicateXOR(int[] nums) {
        Arrays.sort(nums);
        for (int i = 0; i < nums.length - 1; i++) {
            if ((nums[i] ^ nums[i + 1]) == 0)
                return true;
        }
        return false;
    }

    // https://leetcode.com/problems/remove-element/description/?envType=study-plan-v2&envId=top-interview-150
    public static int removeElement(int[] nums, int val) {
        // [3,2,2,3], 3 ==> 2, nums = [2,2,_,_]
        // [0,1,2,2,3,0,4,2], 2 ==> 5, nums = [0,1,4,0,3,_,_,_]
        int c = 0;
        for (int i = 0; i < nums.length; ++i) {
            if (nums[i] != val) {
                nums[c++] = nums[i];
            }
        }
        return c;
    }

    // https://leetcode.com/problems/rotate-array/description/?envType=study-plan-v2&envId=top-interview-150
    public static void rotate(int[] nums, int k) {
        int n = nums.length;
        int[] tmp = new int[n];
        for (int i = 0; i < n; i++) {
            int p = (i + k) % n;
            tmp[p] = nums[i];
        }
        System.arraycopy(tmp, 0, nums, 0, n);
    }

    public int[] maxCounters(int N, int[] A) {
        return null;
    }

    // https://leetcode.com/problems/search-insert-position/description/?envType=study-plan-v2&envId=top-interview-150
    static int searchInsert(int[] A, int target) {
        // using binary search
        int l = 0;
        int r = A.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (A[m] == target)
                return m;
            else if (A[m] > target)
                r = m - 1;
            else
                l = m + 1;
        }
        return l;
    }

    // https://leetcode.com/problems/is-subsequence/description/
    static boolean isSubsequenceTwoPointer(String s, String t) {
        // s = "abc"
        // t = "ahbgdc"
        int tCnt = 0;
        int sCnt = 0;
        while (tCnt < t.length() && sCnt < s.length()) {
            char charT = t.charAt(tCnt);
            char charS = s.charAt(sCnt);
            if (charT == charS) {
                sCnt++;
            }
            tCnt++;
        }
        return s.length() == sCnt;
    }

    static int missingInteger(int[] A) {
        // [1, 3, 6, 4, 1, 2] ==> 5
        // [1, 2, 3] ==> 4
        // [-1, -3] ==> 1
        Set<Integer> set = new LinkedHashSet<>();
        for (int e : A) {
            set.add(e);
        }
        for (int i = 1; i <= A.length; i++) {
            if (!set.contains(i))
                return i;
        }
        return A.length + 1;
    }

    static int frogJmp(int X, int Y, int D) {
        double res = Math.ceil((double) (Y - X) / D);
        return (int) res;
    }

    static int permMissingElem(int[] A) {
        int len = A.length + 1;
        long sumAll = len * (len + 1L) / 2;
        long sum = 0L;
        for (int i : A) {
            sum += i;
        }
        return (int) (sumAll - sum);
    }

    static int oddOccurrencesInArrayXOR(int[] A) {
        int num = 0;
        for (int i = 0; i < A.length; i++) {
            num ^= A[i];
        }
        return num;
    }

    static int oddOccurrencesInArray(int[] A) {
        // [9 ,3, 9, 3, 9, 7, 9] ==> 7
        int len = A.length;
        int res = 0;
        if (len % 2 == 0 || len < 1 || len > 1000000)
            return res;
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < A.length; ++i) {
            if (map.containsKey(A[i])) {
                int cnt = map.get(A[i]);
                cnt++;
                map.put(A[i], cnt);
            } else {
                map.put(A[i], 1);
            }
        }
        for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
            if (map.get(entry.getKey()) % 2 != 0) {
                return entry.getKey();
            }
        }
        return res;
    }

    static int[] cyclicRotationDeque(int[] A, int K) {
        if (K % A.length == 0)
            return A;
        Deque<Integer> deque = new ArrayDeque<>();
        if (K > A.length) {
            K = K - A.length;
        }
        for (int n : A) {
            deque.addLast(n);
        }
        for (int i = 0; i < K; i++) {
            Integer first = deque.removeLast();
            deque.addFirst(first);
        }
        return deque.stream().mapToInt(Integer::intValue).toArray();
    }

    static int[] cyclicRotation(int[] A, int K) {
        // A = [3, 8, 9, 7, 6], K = 1 ==> [6, 3, 8, 9, 7]
        // A = [3, 8, 9, 7, 6], K = 2 ==> [7, 6, 3, 8, 9]
        // A = [3, 8, 9, 7, 6], K = 3 ==> [9, 7, 6, 3, 8]
        int[] res = new int[A.length];
        for (int i = 0; i < A.length; i++) {
            // check The Caesar Cipher
            int newPos = (i + K) % A.length;
            res[newPos] = A[i];
        }
        return res;
    }

    public static int binaryGap(int N) {
        // 10000010001
        // [1..2,147,483,647]
        String bin = Integer.toString(N, 2);
        int res = 0;
        int tmpRes = 0;
        for (int i = 0; i < bin.length(); i++) {
            if (bin.charAt(i) == '0') {
                tmpRes++;
            } else {
                res = Math.max(res, tmpRes);
                tmpRes = 0;
            }
        }
        return res;
    }

    // https://leetcode.com/problems/longest-consecutive-sequence/
    public static int longestConsecutive(int[] nums) {
        int max = 0;
        Map<Integer, Integer> map = new HashMap<>();
        Arrays.stream(nums).forEach(num -> map.put(num, 1));
        for (int num : nums) {
            int next = num + 1;
            int count = 0;
            if (map.containsKey(next))
                continue;
            while (map.containsKey(num - ++count))
                ;
            max = Math.max(max, count);
        }
        return max;
    }

    // Working...
    // https://leetcode.com/problems/container-with-most-water/?envType=study-plan-v2&envId=top-interview-150
    public static int maxArea(int[] height) {
        return 0;
    }

    // https://leetcode.com/problems/3sum/?envType=study-plan-v2&envId=top-interview-150
    public static List<List<Integer>> threeSum(int[] nums) {
        int target = 0;
        List<List<Integer>> res = new ArrayList<>();
        Set<List<Integer>> seen = new HashSet<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; ++i) {
            int l = i + 1;
            int r = nums.length - 1;
            while (l < r) {
                int sum = nums[l] + nums[r] + nums[i];
                if (sum == target) {
                    var triplet = Arrays.asList(nums[i], nums[l], nums[r]);
                    if (!seen.contains(triplet)) {
                        res.add(triplet);
                        seen.add(triplet);
                    }
                    ++l;
                    --r;
                } else if (sum < 0) {
                    ++l;
                } else {
                    --r;
                }
            }
        }
        return res;
    }

    // https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/?envType=study-plan-v2&envId=top-interview-150
    public static int[] twoSumSortedArray(int[] numbers, int target) {
        int l = 0;
        int r = numbers.length - 1;
        int[] res = new int[2];
        int sum = 0;
        while (l < r) {
            sum = numbers[l] + numbers[r];
            if (sum == target) {
                res[0] = l + 1;
                res[1] = r + 1;
                break;
            } else if (sum < target) {
                l++;
            } else {
                r--;
            }
        }
        return res;
    }

    // https://leetcode.com/problems/isomorphic-strings/description/?envType=study-plan-v2&envId=top-interview-150
    public static boolean isIsomorphic(String s, String t) {
        var map1 = new int[127];
        var map2 = new int[127];
        for (int i = 0; i < s.length(); i++) {
            if (map1[s.charAt(i)] != map2[t.charAt(i)])
                return false;
            map1[s.charAt(i)] = i + 1;
            map2[t.charAt(i)] = i + 1;
        }
        return true;
    }

    // https://leetcode.com/problems/is-subsequence/?envType=study-plan-v2&envId=top-interview-150
    public static boolean isSubsequence(String s, String t) {
        if (s.isEmpty())
            return true;
        Deque<Character> stack = new ConcurrentLinkedDeque<>();
        for (int i = s.length() - 1; i >= 0; i--) {
            stack.push(s.charAt(i));
        }
        for (int i = 0; i < t.length(); i++) {
            if (!stack.isEmpty() && (stack.peek() == t.charAt(i))) {
                stack.pop();
            }
        }
        return stack.isEmpty();
    }

    // https://leetcode.com/problems/majority-element/?envType=study-plan-v2&envId=top-interview-150
    public static int majorityElement(int[] nums) {
        if (nums.length == 1)
            return nums[0];
        Map<Integer, Integer> map = new HashMap<>();
        int minTime = nums.length / 2;
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i])) {
                int val = map.get(nums[i]);
                map.put(nums[i], val + 1);
                if (val + 1 > minTime)
                    return nums[i];
            } else {
                map.put(nums[i], 1);
            }
        }
        return 0;
    }

    // https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
    public static int maxProfit(int[] prices) {
        int least = Integer.MAX_VALUE;
        int overralProfit = 0;
        int profitSoldToday = 0;
        for (int i = 0; i < prices.length; i++) {
            if (least > prices[i]) {
                least = prices[i];
            }
            profitSoldToday = prices[i] - least;
            if (overralProfit < profitSoldToday) {
                overralProfit = profitSoldToday;
            }
        }
        return overralProfit;
    }

    // https://leetcode.com/problems/detect-capital/
    public static boolean detectCapitalUse(String word) {
        String lowerStr = word.toLowerCase();
        boolean allAreNot = lowerStr.equals(word);
        boolean allAre = word.toUpperCase().equals(word);
        boolean onlyFirst = Character.isUpperCase(word.charAt(0)) && word.substring(1).equals(lowerStr.substring(1));
        return allAreNot || allAre || onlyFirst;
    }

    // https://leetcode.com/problems/longest-palindrome/
    public static int longestPalindrome(String s) {
        if (s.length() == 2 && (s.charAt(0) == s.charAt(1)))
            return 2;
        Map<Character, Integer> map = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            if (map.containsKey(s.charAt(i))) {
                map.remove(s.charAt(i));
            } else {
                map.put(s.charAt(i), i);
            }
        }
        int res = s.length() - map.size();
        if (s.length() == res)
            return res;
        return res % 2 == 0 ? res + 1 : res;
    }

    // https://leetcode.com/problems/valid-palindrome/
    public static boolean isPalindrome(String s) {
        if (s.isEmpty())
            return false;
        String str = s.chars().filter(Character::isLetterOrDigit).mapToObj(x -> Character.toLowerCase((char) x))
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append).toString();
        int l = 0;
        int r = str.length() - 1;
        while (l < r) {
            if (str.charAt(l) == str.charAt(r)) {
                l++;
                r--;
            } else {
                return false;
            }
        }
        return true;
    }

    // https://leetcode.com/problems/plus-one/
    public static int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        digits = new int[digits.length + 1];
        digits[0] = 1;
        return digits;
    }

    // https://leetcode.com/problems/longest-common-prefix/
    public static String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) {
            return "";
        }
        if (strs.length == 1) {
            return strs[0];
        }
        String curStr = strs[0];
        for (int i = 1; i < strs.length; i++) {
            for (int j = 0; j < curStr.length(); j++) {
                if (strs[i].length() == 0) {
                    curStr = "";
                    break;
                }
                if (curStr.charAt(j) != strs[i].charAt(j)) {
                    curStr = curStr.substring(0, j);
                    break;
                }
                if (j == strs[i].length() - 1) {
                    curStr = curStr.substring(0, j + 1);
                    break;
                }
            }
        }
        return curStr;
    }

    // https://leetcode.com/problems/contains-duplicate/
    public static boolean containsDuplicate(int[] nums) {
        if (nums.length == 1) {
            return false;
        }
        if (nums.length == 2 && nums[0] != nums[1]) {
            return false;
        }
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if (set.contains(nums[i])) {
                return true;
            }
            set.add(nums[i]);
        }
        return nums.length != set.size();
    }

    // https://leetcode.com/problems/missing-number/
    public static int missingNumber(int[] nums) {
        // int sum = 0;
        // int sumExpect = 0;
        // boolean existNum_0 = false;
        // for (int i = 0; i < nums.length; i++) {
        // sumExpect += i + 1;
        // sum += nums[i];
        // if (nums[i] == 0)
        // existNum_0 = true;
        // }
        // if (!existNum_0)
        // return 0;
        // return sumExpect - sum;
        int len = nums.length;
        int sumAll = len * (len + 1) / 2;
        for (int i : nums) {
            sumAll -= i;
        }
        return sumAll;
    }

    // https://leetcode.com/problems/binary-search/
    public static int binarySearch(int[] nums, int target) {
        int l = 0;
        int r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) {
                return m;
            } else if (nums[m] < target) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
        return -1;
    }

    // https://leetcode.com/problems/length-of-last-word/
    public static int lengthOfLastWord(String s) {
        String[] arr = s.split(" ");
        return arr[arr.length - 1].length();
    }

    // https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
    public int strStr(String haystack, String needle) {
        char firstCharNeedle = needle.charAt(0);
        if (haystack.length() < needle.length())
            return -1;
        for (int i = 0; i < haystack.length(); i++) {
            int count = 0;
            if (i + needle.length() > haystack.length())
                return -1;
            if (haystack.charAt(i) == firstCharNeedle) {
                for (int j = 1; j < needle.length(); j++) {
                    if (haystack.charAt(i + j) == needle.charAt(j)) {
                        count++;
                    }
                }
                if (count == needle.length() - 1)
                    return i;
            }
        }
        return -1;
    }

    // https://leetcode.com/problems/valid-parentheses/
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char cur = s.charAt(i);
            if (!stack.isEmpty()) {
                char last = stack.lastElement();
                if ((cur == last + 1) || (cur == last + 2)) {
                    stack.pop();
                    continue;
                }
            }
            stack.push(cur);
        }
        return stack.isEmpty();
    }

    // https://leetcode.com/problems/roman-to-integer/
    public int romanToInt(String s) {
        int res = 0;
        int prev = 0;
        int num = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            switch (s.charAt(i)) {
                case 'I':
                    num = 1;
                    break;
                case 'V':
                    num = 5;
                    break;
                case 'X':
                    num = 10;
                    break;
                case 'L':
                    num = 50;
                    break;
                case 'C':
                    num = 100;
                    break;
                case 'D':
                    num = 500;
                    break;
                case 'M':
                    num = 1000;
                    break;
                default:
                    break;
            }
            if (num < prev) {
                res -= num;
            } else {
                res += num;
            }
            prev = num;
        }
        return res;
    }

    // https://leetcode.com/problems/group-anagrams/
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs.length == 1) {
            if (strs[0].isEmpty()) {
                return Arrays.asList(Arrays.asList(""));
            }
            return Arrays.asList(Arrays.asList(strs[0]));
        }
        Map<String, ArrayList<String>> map = new HashMap<>();
        List<List<String>> ans = new ArrayList<>();
        for (int i = 0; i < strs.length; i++) {
            char[] chars = strs[i].toCharArray();
            Arrays.sort(chars);
            String sortedStr = new String(chars);
            if (map.containsKey(sortedStr)) {
                map.get(sortedStr).add(strs[i]);
            }
            if (!map.containsKey(sortedStr)) {
                ArrayList<String> groupList = new ArrayList<>();
                groupList.add(strs[i]);
                map.put(sortedStr, groupList);
            }
        }
        for (Map.Entry<String, ArrayList<String>> entry : map.entrySet()) {
            ans.add(entry.getValue());
        }
        return ans;
    }

    // https://leetcode.com/problems/valid-anagram/
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        final int UNICODE_LENGTH = 512;
        int[] res = new int[UNICODE_LENGTH]; // 256 for ascii, 512 for unicode
        for (int i = 0; i < s.length(); i++) {
            res[s.charAt(i)]++;
            res[t.charAt(i)]--;
        }
        for (int i = 0; i < UNICODE_LENGTH; i++) {
            if (res[i] != 0) {
                return false;
            }
        }
        return true;
    }

    // https://leetcode.com/problems/two-sum/
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(target - nums[i])) {
                return new int[] { map.get(target - nums[i]), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

}
