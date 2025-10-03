using System.Collections;
using System.Collections.Generic;
using Learning;

namespace Learning
{

    class Program
    {
        static void Main(string[] args)
        {
            // LeetCode.LeetCodeMain();
            // LearnStringInterpolation();
            // LearnCollections();
            // LearnMethodFunction();
            // LearnType.LearnStringType();

            // LearnDataTypes();
            // Learn.TestComplexLINQStyles();
            // var emp = new EmployeeStruct() { Name = "Test", Age = 21 };
            // System.Console.WriteLine($"{emp.Name} {emp.Age}");
            // ModifyUserInfo(out emp);
            // System.Console.WriteLine($"{emp.Name} {emp.Age}");
            // System.Console.WriteLine(string.Join(" ", Learn.TakeWhilePositive(new[] { 2, 3, 4, 5, -1, 3, 4 })));
            Learn.PracticeLINQ();

        }

        public static void ModifyUserInfo(out EmployeeStruct user)
        {
            user = new EmployeeStruct();
            user.Name = "Changed by out";
        }
        public static void UpdateUserVal(ref EmployeeStruct user)
        {
            user.Name = "Changed by ref";
        }

        public static void ReadUserInfo(in EmployeeStruct user)
        {
            // "in": pass a parameter by reference in read-only mode, you can read the value but you cannot modify it
            var userInfo = user;
            userInfo.Name = "Changed by in";
        }
        private static void LearnDataTypes()
        {
            // String verbatim
            string filename1 = @"c:\documents\files\u0066.txt";
            string filename2 = "c:\\documents\\files\\u0066.txt";
            string filename3 = "\u0066";
            string s1 = "He said, \"This is the last \u0063hance\x0021\"";
            string s2 = @"He said, ""This is the last \u0063hance\x0021""";
            // User C# reserved keywords as identifiers
            int[] @foreach = { 2, 3, 4, 5, 2, 5, 23, 23, 23, 23, 23, 23, 23, 23, 23 };
            string? @string = @foreach.ToString();
            Learn.DelegateMethod delegateMethod = new Learn.DelegateMethod(Learn.ShowString);
            // int result = delegateMethod("32");
            // System.Console.WriteLine(result);
            dynamic? dynamicVar = "Hello world!";
            object? objectVar = "Hello world!";
            dynamicVar = 233M;
            objectVar = 233M;
            // System.Console.WriteLine($"{dynamicVar.GetType()} {objectVar.GetType()}");
            dynamicVar = null;
            if (dynamicVar is not null)
            {
                // System.Console.WriteLine("dynamicVar is not null");
            }
            // Anonymous types using object initializer
            var student = new { Id = "PS001", FullName = "Nguyen Van A", Age = 21L };
            // System.Console.WriteLine(student.ToString());
        }

        private static void LearnMethodFunction()
        {
            var testMotorcycle = new TestMotorcycle();
            System.Console.WriteLine(testMotorcycle.Drive(1, 12));
        }
        private static void LearnCollections()
        {

            var salmons = new List<string> { "chinook", "coho", "pink", "sockeye" };
            salmons.ForEach(salmon =>
            {
                // System.Console.WriteLine(salmon);
            });

            var galaxies = new List<Galaxy>()
            {
                new Galaxy(){Name = "what is this", MegaLightYears = 23},
                new Galaxy(){Name = "what is2this", MegaLightYears = 232},
                new Galaxy(){Name = "what is3 this", MegaLightYears = 233},
                new Galaxy(){Name = "what is 4this", MegaLightYears = 243},
            };
            foreach (var item in galaxies)
            {
                // System.Console.WriteLine($"{item.Name} : {item.MegaLightYears}");
            }

            Hashtable hashtable = new Hashtable();
            hashtable[0] = 2;
            hashtable[0] = 2;
            foreach (DictionaryEntry item in hashtable)
            {
                // System.Console.WriteLine($"{item.Key} => {item.Value}");
            }

            List<Element> elements = Utils.BuildElementList();
            // LINQ query
            var subset1 = from theElement in elements
                          where theElement.AtomicNumber < 32
                          orderby theElement.Name
                          select theElement;
            var subset2 = from el in elements
                          where el.AtomicNumber > 100 & el.AtomicNumber < 200
                          orderby el.Name
                          select new { el.FullName, el.Name };
            foreach (var item in subset1)
            {
                // System.Console.WriteLine($"{item.Name} : {item.AtomicNumber}");
            }
            string testStr = "{}[]()";
            var stack = new Stack<char>();
            for (int i = 0; i < testStr.Length; i++)
            {
                char cur = testStr[i];
                if (stack.Count >= 1)
                {
                    char last = stack.Last();
                    if ((cur == last + 1) || (cur == last + 2))
                    {
                        stack.Pop();
                        continue;
                    }
                }
                stack.Push(cur);
            }
            // System.Console.WriteLine($"Is \"{testStr}\" a valid parenthesis: {stack.Count == 0}");
            var elementList = new AllElements();
            foreach (Element item in elementList)
            {
                // System.Console.WriteLine(item.Name + " ");
            }
        }

        private static void LearnStringInterpolation()
        {
            int safetyScore = 85;
            string message = $"The usage policy for {safetyScore} is {safetyScore switch
            {
                > 90 => "Unlimited usage",
                > 80 => "General usage, with daily safety check",
                > 70 => "Issues must be addressed within 1 week",
                > 50 => "Issues must be addressed within 1 day",
                _ => "Issues must be addressed before continued use"
            }}";
            string name = "JackyStonk";
            DateTime today = DateTime.Now;
            string todayString = $"Whatzup, {name}! Today is {today:HH:mm:ss} now.";
            const int PIPrescision = 5;
            string PIString = $"PI num with {PIPrescision} precision: {Math.PI,PIPrescision}";
            System.Console.WriteLine(message);
            System.Console.WriteLine(todayString);
            System.Console.WriteLine(PIString);
        }


    }

}

