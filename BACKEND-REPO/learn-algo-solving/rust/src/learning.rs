use rand::Rng;
use std::{cmp::Ordering, io};

const NOT_A_NUMBER: &str = "Not a number!!";

pub fn ownership() {
    let mut hello = String::from("Hello");
    let world = " world";
    let mut hello_world = hello + world;
    hello_world.push_str("!");
    println!("{}", hello_world);
    for c in hello_world.chars() {
        print!("{}, ", c);
    }
    println!("");
    // we are in fact copying the pointer, length, and capacity,
    // which is a total of 3 machine words
    // Rust considers s1 to no longer be valid and, therefore,
    // Rust doesn’t need to free anything when s1 goes out of scope.
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("s1 = {}, s2 = {}", s1, s2);
    // Stack-Only Data: Copy, because Copy trait is implemented
    let x = 5;
    let y = x;
    println!("x = {}, y = {}", x, y);
    // Ownership and Functions
    fn takes_ownership(some_string: String) {
        println!("{}", some_string);
    }
    fn makes_copy(some_integer: i32) {
        println!("{}", some_integer);
    }
    let s = String::from("hello");
}

pub mod how_to_cp_rust {
    use std::io;

    pub fn main() {
        // let number1 = take_int();
        // let number2 = take_int();
        // println!("{}", number1 * number2);

        // let arr = take_vector();
        // let mut sum = 0;
        // for i in 0..arr.len() {
        //     sum += arr[i];
        // }
        // println!("{}", sum);
        // string_to_vec_char("hello");

        let str1 = take_string();
        println!("{:?}", str1);
        println!(
            "First and last characters of the string: {}, {}",
            str1[0],
            str1[str1.len() - 1]
        );
        println!("toString: {}", to_string(str1));
    }

    pub fn to_string(vec: Vec<char>) -> String {
        return vec.iter().collect::<String>();
    }

    pub fn take_string() -> Vec<char> {
        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();
        let vec: Vec<char> = input.trim().chars().collect();
        vec
    }

    pub fn string_to_vec_char(s: &str) -> Vec<char> {
        let v: Vec<char> = s.chars().collect();
        println!("{:?}", v);
        v
    }

    pub fn take_vector() -> Vec<usize> {
        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();
        let arr: Vec<usize> = input
            .trim()
            .split_whitespace()
            .map(|x| x.parse().unwrap())
            .collect();
        return arr;
    }

    pub fn take_int() -> usize {
        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();
        return input.trim().parse().unwrap();
    }
}

pub fn control_flow() {
    let number = {
        let a = 10;
        a * 3
    };
    if number < 30 {
        println!("number is less than 30");
    } else if number > 30 {
        println!("number is greater than 30");
    } else {
        println!("number is equal to 30");
    }
    // Using if in a let Statement
    let condition = true;
    let _number = if condition { 5 } else { 6 };
    let number = if condition {
        let n = 10 / 2;
        n * 3
    } else {
        5
    };
    println!("The value of number is: {}", number);
    // Repetition with Loops (loop, while, and for)
    let mut counter = 0;
    loop {
        counter += 1;
        println!("counter: {}", counter);
        if counter == 10 {
            break;
        }
    }
    counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("The result is: {}", result);
    // Loop Labels to Disambiguate Between Multiple Loops
    let mut count = 0;
    'counting_up: loop {
        println!("count: {count}");
        let mut remaining = 11;
        loop {
            println!("remaining: {remaining}");
            if remaining == 0 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }
        count += 1;
    }
    println!("End count: {count}");
    // Conditional Loops with while
    let mut number = 5;
    while number != 0 {
        println!("{number}s");
        number -= 1;
    }
    println!("LIFTOFF!!!");
    // Looping Through a Collection with for
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;
    while index < 5 {
        println!("the value is: {}", a[index]);
        index += 1;
    }
    for e in a {
        println!("the value is: {}", e);
    }
    for num in (1..5).rev() {
        println!("{}!", num);
    }
    println!("LIFTOFF!!!");
}

pub fn data_types() {
    fn five() -> i32 {
        5
    }
    // convert String to numeric types
    let guess: i32 = "  42 ".trim().parse().expect(NOT_A_NUMBER);
    // Floating-Point Types
    let x = 2.0; // f64
    let y: f32 = 3.0232323; // f32
    println!("x: {}, y: {}", x, y);
    println!("guess: {}", guess);
    // Numeric Operations
    let sum = 5 + 10;
    let difference = 95.5 - 4.3;
    let quotient = 56.7 / 32.2;
    let remainder = 43 % 5;
    println!(
        "sum: {}, difference: {}, quotient: {}, remainder: {}",
        sum, difference, quotient, remainder
    );
    // The Boolean Type
    let t = true;
    let f: bool = false; // with explicit type annotation
    println!("t: {}, f: {}", t, f);
    // The Character Type
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '❤';
    let face = '\u{1F600}';
    let string_emojis: &str = "😻🙀😹";
    println!(
        "c: {}, z: {}, heart_eyed_cat: {}, face: {}, stringEmojis: {}",
        c, z, heart_eyed_cat, face, string_emojis
    );
    // The Tuple Type
    let tup: (i32, f32, u8, char, &str) = (500, 3.32, 1, '😻', "😁👍");
    let (x, y, z, w, v) = tup;
    println!("x: {}, y: {}, z: {}, w: {}, v: {}", x, y, z, w, v);
    let five_hundred = tup.0;
    let three_point_two = tup.1;
    let one = tup.2;
    let cat = tup.3;
    let smile = tup.4;
    println!(
        "five_hundred: {}, three_point_two: {}, one: {}, cat: {}, smile: {}",
        five_hundred, three_point_two, one, cat, smile
    );
    // The Array Type
    let _a = [1, 2, 3, 4, 5];
    let _b: [f64; 3] = [3.14, 2.718, 1.618];
    let c = [" 32", " 64", " 128", " 256", " 512"];
    // same as [3, 3, 3, 3, 3]
    let _b = [3; 5];
    for i in 0..c.len() {
        let d: f64 = c[i].trim().parse().expect(NOT_A_NUMBER);
        if d == 256.0 {
            println!("Found 256.0");
            break;
        }
    }
    // Invalid array element access
    let a = [1, 2, 3, 4, 5];
    println!("Please enter an array index.");
    let idx = "   4";
    // io::stdin()
    //     .read_line(&mut idx)
    //     .expect("Failed to read line");
    let idx: usize = idx.trim().parse().expect(NOT_A_NUMBER);
    let element = a[idx];
    println!("The value of the element at index {} is: {}", idx, element);

    let y = {
        let x = 10;
        x + 1
    };
    println!("y: {}", y);

    let x = five();
    println!("x: {}", x);
}

pub fn variables_and_mutability() {
    // add 'mut' to be mutable
    let mut a = 12;
    println!("The value of x is: {a}");
    a = 5;
    println!("The value of x is: {a}");

    // shadowing
    let x = 5;
    let x = x + 1;
    {
        let x = x * 2;
        println!("1. Inner scope value: {x}")
    }
    println!("2. x value: {x}");

    let spaces = "   ";
    let spaces: i32 = spaces.len().try_into().unwrap();
    println!("spaces variable len: {spaces}")
}

pub fn guess_the_number() {
    println!("Guess the number!");
    let secret_number = rand::thread_rng().gen_range(1..=100);
    loop {
        println!("Please input your guess.");
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        println!("You guessed: {guess}");
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small"),
            Ordering::Greater => println!("Too big"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
