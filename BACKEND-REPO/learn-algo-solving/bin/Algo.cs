using System.Text;

namespace Learning
{
    public class LeetCode
    {
        public static void LeetCodeMain()
        {

        }

        public static int MinLengthUsingStack(string s)
        {
            Stack<char> stack = new Stack<char>();
            foreach (var item in s.ToCharArray())
            {
                if (stack.Count != 0 && (((char)stack.Peek() == 'A' && item == 'B') || ((char)stack.Peek() == 'C' && item == 'D')))
                {
                    stack.Pop();
                }
                else
                {
                    stack.Push(item);
                }
            }
            return stack.Count;
        }

        // https://leetcode.com/problems/minimum-string-length-after-removing-substrings/
        public static int MinLength(string s)
        {
            int i = 0;
            while (i < s.Length - 1)
            {
                // take 2 current characters
                string cur = s.Substring(i, 2);
                if (cur.Equals("AB") || cur.Equals("CD"))
                {
                    s = s.Remove(i, 2);
                    i = 0;
                    continue;
                }
                i++;
            }
            return s.Length;
        }

        // https://leetcode.com/problems/longest-consecutive-sequence/
        public static int LongestConsecutive(int[] nums)
        {
            return 0;
        }

        // https://leetcode.com/problems/length-of-last-word/
        public static int LengthOfLastWord(string s)
        {
            string[] arrStr = s.Split(" ");
            for (int i = arrStr.Length - 1; i >= 0; i--)
            {
                if (!string.IsNullOrWhiteSpace(arrStr[i]))
                {
                    return arrStr[i].Length;
                }
            }
            return 0;
        }

        // https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
        public static int StrStr(string haystack, string needle)
        {
            return haystack.IndexOf(needle);
        }

        // https://leetcode.com/problems/valid-parentheses/
        public static bool IsValid(string s)
        {
            Stack<char> stack = new Stack<char>();
            for (int i = 0; i < s.Length; i++)
            {
                char cur = s[i];
                if (stack.Count >= 1)
                {
                    char last = (char)stack.Peek();
                    if ((cur == last + 1) || (cur == last + 2))
                    {
                        stack.Pop();
                        continue;
                    }
                }
                stack.Push(cur);
            }
            return stack.Count == 0;
        }

        // https://leetcode.com/problems/roman-to-integer/
        static int RomanToInt(string s)
        {
            int num = 0, prev = 0, ans = 0;
            for (int i = s.Length - 1; i >= 0; i--)
            {
                switch (s[i])
                {
                    case 'I': num = 1; break;
                    case 'V': num = 5; break;
                    case 'X': num = 10; break;
                    case 'L': num = 50; break;
                    case 'C': num = 100; break;
                    case 'D': num = 500; break;
                    case 'M': num = 1000; break;
                }
                if (num < prev)
                {
                    ans -= num;
                }
                else
                {
                    ans += num;
                }
                prev = num;
            }
            return ans;
        }

        // https://leetcode.com/problems/group-anagrams/
        static IList<IList<string>> GroupAnagrams(string[] strs)
        {
            Dictionary<string, List<string>> map = new Dictionary<string, List<string>>();
            IList<IList<string>> res = new List<IList<string>>();
            for (int i = 0; i < strs.Length; i++)
            {
                char[] charArr = strs[i].ToCharArray();
                Array.Sort(charArr);
                string sortedStr = new string(charArr);
                if (map.ContainsKey(sortedStr))
                {
                    map[sortedStr].Add(strs[i]);
                }
                if (!map.ContainsKey(sortedStr))
                {
                    List<string> newList = new List<string>() { strs[i] };
                    map[sortedStr] = newList;
                }
            }
            foreach (KeyValuePair<string, List<string>> item in map)
            {
                res.Add(item.Value);
            }
            return res;
        }

        // https://leetcode.com/problems/two-sum/
        static bool IsAnargram(string s, string t)
        {
            if (s.Length != t.Length)
            {
                return false;
            }
            int UNICODE_LEN = 512;
            int[] res = new int[UNICODE_LEN];
            for (int i = 0; i < s.Length; i++)
            {
                res[s[i]]++;
                res[t[i]]--;
            }
            for (int i = 0; i < UNICODE_LEN; i++)
            {
                if (res[i] != 0)
                {
                    return false;
                }
            }
            return true;
        }

        // https://leetcode.com/problems/two-sum/
        static int[]? twoSum(int[] nums, int target)
        {
            Dictionary<int, int> map = new Dictionary<int, int>();
            for (int i = 0; i < nums.Length; i++)
            {
                if (map.ContainsKey(target - nums[i]))
                {
                    return new int[] { map[target - nums[i]], i };
                }
            }
            return new int[0];
        }


    }
}