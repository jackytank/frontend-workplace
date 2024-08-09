use std::collections::HashMap;

// https://leetcode.com/problems/fibonacci-number/
pub fn fib(n: i32) -> i32 {
    fn cal_fib(m: &mut HashMap<i32, i32>, n: i32) -> i32 {
        if n < 1 {
            return 0;
        }
        if n == 2 || n == 1 {
            return 1;
        }
        if let Some(&r) = m.get(&n) {
            return r;
        }
        let r = cal_fib(m, n - 1) + cal_fib(m, n - 2);
        m.insert(n, r);
        r
    }
    cal_fib(&mut HashMap::new(), n)
}
