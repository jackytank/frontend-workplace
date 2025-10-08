package creational_pattern.java;

public class Singleton {
    public static void main(String[] args) {
        var singleton1 = ClassSingleton.getInstance();
        var singleton2 = ClassSingleton.getInstance();
        System.out.println(singleton1 == singleton2); // true
    }
}

final class ClassSingleton {
    private static ClassSingleton INSTANCE;
    private String info = "Initital shits";

    private ClassSingleton() {
        // prevent instantition
    }

    public static ClassSingleton getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new ClassSingleton();
        }
        return INSTANCE;
    }

    public String getInfo() {
        return info;
    }

}
