function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    let res: number[] = [];
    nums.forEach((n, i) => {
        const complement = target - n;
        if (map.has(complement)) {
            res = [map.get(complement)!, i];
        }
        map.set(n, i);
    });
    return res;
}

function threeSum(nums: number[]): number[][] {
    const target = 0;
    const res: number[][] = [];
    const seen = new Set<string>();
    nums.sort((a, b) => a - b);
    for (let i = 0; i < nums.length; ++i) {
        let l = i + 1;
        let r = nums.length - 1;
        while (l < r) {
            const sum = nums[l] + nums[r] + nums[i];
            if (sum === target) {
                const triplet = [nums[i], nums[l], nums[r]];
                const tripletStr = triplet.join(',');
                if (!seen.has(tripletStr)) {
                    res.push(triplet);
                    seen.add(tripletStr);
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
};

function longestCommonPrefix(strs: string[]): string {
    let ans: string[] = [];
    strs.sort();
    const first: string = strs[0];
    const last: string = strs[strs.length - 1];
    for (let i = 0; i < Math.min(first.length, last.length); i++) {
        const element = strs[i];
        if (first.charAt(i) !== last.charAt(i)) {
            return ans.join('');
        }
        ans.push(first.charAt(i));

    }
    return ans.join('');
};




// main
(() => {
    // console.log(twoSum([2, 7, 11, 15], 9));
    console.log(longestCommonPrefix(["flower", "flow", "flight"]));

})()

