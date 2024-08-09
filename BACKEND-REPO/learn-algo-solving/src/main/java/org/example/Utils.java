package org.example;

import java.util.HashMap;
import java.util.Random;

public class Utils {

    public static int[] genRandDupArr(int N) {
        Random random = new Random();
        HashMap<Integer, Integer> map = new HashMap<>();
        int[] array = new int[N];
        for (int i = 0; i < N; i++) {
            int value = random.nextInt(Integer.MAX_VALUE);
            int frequency = map.getOrDefault(value, 0);
            map.put(value, frequency + 1);
            array[i] = value;
        }
        return array;
    }
}
