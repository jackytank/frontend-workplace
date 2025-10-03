using System.Collections;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;

namespace Learning
{
    class Learn
    {
        public static void PracticeLINQ()
        {
            // Minimum Length - minimum length of 5
            var list = new List<string>() { "computer", "usb", "asp" };
            list.Where(x => x.Length >= 5).Select(x => x.ToUpper());
            var query = from x in list
                        where x.Length >= 5
                        select x.ToUpper();
            // foreach (var item in query) { System.Console.WriteLine(item); }

            // Select words - start with a, end with m
            var list2 = new List<string>() { "mum", "amsterdam", "bloom", "usb" };
            list2.Where(x => x.StartsWith('a') && x.EndsWith('m'))
                .Select(x => x);
            // .ToList().ForEach(x => System.Console.WriteLine(x));
            var query2 = from x in list2
                         where x.StartsWith('a') && x.EndsWith('m')
                         select x;
            // foreach (var item in query2) { System.Console.WriteLine(item); }

            // Top 5 numbers - returns top 5 numbers from the 
            // list of integers in descending order.
            var list3 = new List<int>() { 78, -9, 0, 23, 54, 21, 7, 86 };
            list3.Select(x => x).OrderDescending().Take(5).ToList();
            // .ForEach(x => System.Console.WriteLine(x));
            var query3 = (from x in list3
                          orderby x descending
                          select x).Take(5);
            // foreach (var item in query3) { System.Console.WriteLine(item); };


            // Square greater than 20
            var list4 = new List<int> { 7, 2, 30, 1, -2, 3, 4 };
            list4.Select(x => Math.Pow(x, 2)).Where(x => x > 20).ToList();
            // .ForEach(x => System.Console.WriteLine(x));
            var query4 = from x in list4
                         let y = Math.Pow(x, 2)
                         where y > 20
                         select y;
            // foreach (var item in query4) { System.Console.WriteLine(item); };

            // replaces 'ea' substring with astersik (*) in given list of words.
            var list5 = new List<string> { "learn", "current", "deal" };
            list5.Select(x => x.Replace("ea", "*")).ToList();
            // .ForEach(x => Console.WriteLine($"{x}"));
            var query5 = from x in list5
                         select x.Replace("ea", "*");
            // foreach (var item in query5) { System.Console.WriteLine($"{item}"); }

            // Write a query that shuffles sorted array.
            var list6 = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
            list6.OrderBy(x => new Random().Next()).ToList();
            // .ForEach(x => System.Console.WriteLine(x));
            var query6 = from x in list6
                         let y = list6[new Random().Next(0, list6.Count - 1)]
                         select y;
            // foreach (var item in query6) { System.Console.WriteLine($"{item}"); }

            // Most frequent character
            var str = "n093nfv034nie9";
            var mostFrequent = str.GroupBy(c => c).OrderByDescending(c => c.Count()).First().Key;
            // System.Console.WriteLine(mostFrequent);

            var list7 = new List<string>() { "abc", "xyz", "klm", "xyz", "abc", "abc", "rst" };
            list7.GroupBy(x => x)
                .Where(x => x.Count() == 1)
                .Select(x => x.Key)
                .ToList()
                .ForEach(x => System.Console.WriteLine($"{x}"));
        }
        public static void TestTypeTestingOperator()
        {
            IEnumerable<int> numbers = new[] { 10, 20, 30, 40, 50, 100, 200, 300 };
            IList<int>? indexable = numbers as IList<int>;
            if (indexable != null)
            {
                Console.WriteLine(indexable[0] + indexable[indexable.Count - 1]);  // output: 40
            }
        }

        public record NamedPoint(string Name, int X, int Y);

        public static void TestWithExpression()
        {
            var p1 = new NamedPoint("A", 0, 0);
            System.Console.WriteLine($"{nameof(p1)} : {p1}");

            var p2 = p1 with { Name = "B", X = 5 };
            System.Console.WriteLine($"{nameof(p2)} : {p2}");

            var apples = new { Item = "Apples", Price = 1.19m };
            var saleApples = apples with { Price = 0.79m };
        }

        public static void TestPatternMatching()
        {
            object? @object = "This is not null string";
            if (@object is not null)
            {
                System.Console.WriteLine(@object);
            }
            dynamic? result = @object switch
            {
                string @string => @$"{@string}: is a string ",
                int @int => $@"{@int} is a number",
                Array array => string.Format("{0} is an array", array),
                null => 0,
                double.NaN => "Unknown",
                ICollection collection => "{0} is a collection".Replace("{0}", $"{collection}"),
                _ => null
            };
            if (result is string str
                && result is not null
                && result is not (float or double or decimal or int or uint))
            {
                System.Console.WriteLine(str);
            }

            DateTime[] dates = new[]{
                new DateTime(2021, 3, 14),
                new DateTime(2021, 7, 19),
                new DateTime(2021, 2, 17),
                DateTime.Now,
                DateTime.UtcNow,
                new DateTime(2002, 11, 17)
            };
            foreach (var item in dates)
            {
                // System.Console.WriteLine($"{GetCalendarSeason(item)}, is my birthday: {IsMyBirthDay(item)}");
            }
            // Console.WriteLine(TakeFive("Hello, world!"));  // output: Hello
            // Console.WriteLine(TakeFive("Hi!"));  // output: Hi!
            // Console.WriteLine(TakeFive(new[] { '1', '2', '3', '4', '5', '6', '7' }));  // output: 12345
            // Console.WriteLine(TakeFive(new[] { 'a', 'b', 'c' }));  // output: abc

        }
        private void Hello() => global::System.Console.WriteLine("Hello");
        private static bool IsAcceptable(int id, int absLimit) =>
            SimulateDataFetch(id) is var results
            && results.Min() >= -absLimit
            && results.Max() <= absLimit;
        private static int[] SimulateDataFetch(int id)
        {
            var rand = new Random();
            return Enumerable
                .Range(start: 0, count: 5)
                .Select(s => rand.Next(minValue: -10, maxValue: 11))
                .ToArray();
        }
        private static string TakeFive(object input) => input switch
        {
            string { Length: >= 5 } s => s.Substring(0, 5),
            string s => s,
            ICollection<char> { Count: >= 5 } symbols => new string(symbols.Take(5).ToArray()),
            ICollection<char> symbols => new string(symbols.ToArray()),
            null => throw new ArgumentNullException(nameof(input)),
            _ => throw new ArgumentException("Not supported input type"),
        };
        private static bool IsMyBirthDay(DateTime date) => date is { Year: 2002, Month: 11, Day: 17 };
        private static string GetCalendarSeason(DateTime date) => date.Month switch
        {
            >= 3 and < 6 => "spring",
            >= 6 and < 9 => "summer",
            >= 9 and < 12 => "autumn",
            12 or (>= 1 and < 3) => "winter",
            _ => throw new ArgumentOutOfRangeException(nameof(date), $"Date with unexpected month: {date.Month}.")
        };
        class CustomExceptions : Exception
        {
            public CustomExceptions() : base() { }
            public CustomExceptions(string message) : base(message) { }
            public CustomExceptions(string message, Exception inner) : base(message, inner) { }
        }
        public static void TestTryCatch()
        {
            FileStream? file = null;
            FileInfo fileInfo = new FileInfo("./test.txt");
            int awesomeScore = 70;
            // First try-catch
            try
            {
                file = fileInfo.OpenWrite();
                file.WriteByte(0xF);
            }
            catch (DirectoryNotFoundException ex)
            {
                System.Console.WriteLine(ex);
            }
            catch (CustomExceptions ex) when (awesomeScore < 70)
            {
                System.Console.WriteLine(ex);
            }
            catch (IOException ex) when (awesomeScore < 50)
            {
                System.Console.WriteLine(ex);
            }
            finally
            {
                file?.Close();
            }
            // Second try-catch
            try
            {
                file = fileInfo.OpenWrite();
                Console.WriteLine("OpenWrite() succeeded");
            }
            catch (IOException)
            {
                Console.WriteLine("OpenWrite() failed");
            }
            // Third try-catch
            Regex regex = new Regex("^[a-zA-Z]+$");
            string name = "hello";
            if (!regex.IsMatch(name))
            {
                throw new CustomExceptions($"Name {name} is not valid!");
            }
            else
            {
                System.Console.WriteLine($"{name} is valid");
            }
        }
        public static void TestSpan()
        {
            var arr = new byte[10];
            Span<byte> bytes = arr;
            Span<byte> slicedBytes = bytes.Slice(start: 5, length: 2);
            slicedBytes[0] = 42;
            slicedBytes[1] = 43;
            // System.Console.WriteLine($"{arr[5]} {arr[6]}");
            // System.Console.WriteLine($"{slicedBytes[0]} {slicedBytes[1]}");
            string str = "hello, world";
            string worldString = str.Substring(startIndex: 7, length: 5);
            ReadOnlySpan<char> worldSpan = str.AsSpan().Slice(start: 7, length: 5);
            int[] array = new[] { 0, 1, 2, 3, 4, 5, 6 };
            Span<int> arrSpan = array.AsSpan();
            List<int> list = new() { 0, 1, 2, 3, 4, 5, 6 };
            Span<int> listSpan = CollectionsMarshal.AsSpan(list);
            string input = "123,456";
            ReadOnlySpan<char> span = input.AsSpan();
            int commaPos = span.IndexOf(',');
            int first = int.Parse(span.Slice(0, commaPos));
            int second = int.Parse(span.Slice(commaPos + 1));
            string[] logs = new string[]
                {
                    "a1K3vlCTZE6GAtNYNAi5Vg::05/12/2022 09:10:00 AM::http://localhost:2923/api/customers/getallcustomers",
                    "mpO58LssO0uf8Ced1WtAvA::05/12/2022 09:15:00 AM::http://localhost:2923/api/products/getallproducts",
                    "2KW1SfJOMkShcdeO54t1TA::05/12/2022 10:25:00 AM::http://localhost:2923/api/orders/getallorders",
                    "x5LmCTwMH0isd1wiA8gxIw::05/12/2022 11:05:00 AM::http://localhost:2923/api/orders/getallorders",
                    "7IftPSBfCESNh4LD9yI6aw::05/12/2022 11:40:00 AM::http://localhost:2923/api/products/getallproducts"
                };
            const string colon = ":";
            const string doubleColon = "::";
            foreach (ref readonly var item in logs.AsSpan())
            {
                var curSpan = item.AsSpan();
                var colonIndex = curSpan.IndexOf(colon);
                var doubleColonIndex = curSpan.LastIndexOf(doubleColon);

                var requestId = curSpan.Slice(0, colonIndex);
                var dateTime = curSpan.Slice(colonIndex + 2, 22);
                var requestUrl = curSpan.Slice(doubleColonIndex + 2);
                var template = $"Request ID: {requestId}\nDateTime: {dateTime}\nRequest URL: {requestUrl}";
                System.Console.WriteLine(template);
                System.Console.WriteLine("********************************");
            }
        }
        public static void TestRefReturnTypeWithSpan()
        {
            Span<int> storage = stackalloc int[10];
            int num = 0;
            foreach (ref int item in storage)
            {
                item = num++;
            }
            foreach (ref readonly var item in storage)
            {
                System.Console.WriteLine($"{item}");
            }
        }
        public enum CoffeeChoice
        {
            Plain,
            WithMilk,
            WithIceCream,
        }

        // goto statement
        public static decimal CalPriceWithGoto(CoffeeChoice choice)
        {
            decimal price = 0;
            switch (choice)
            {
                case CoffeeChoice.Plain:
                    price += 10.0m;
                    break;
                case CoffeeChoice.WithMilk:
                    price += 5.0m;
                    goto case CoffeeChoice.Plain;
                case CoffeeChoice.WithIceCream:
                    price += 7.0m;
                    goto case CoffeeChoice.Plain;
            }
            return price;
        }
        // goto statement
        public static void CheckMatricesWithGoto(Dictionary<string, int[][]> matrixLookup, int target)
        {
            foreach (var (key, matrix) in matrixLookup)
            {
                for (int row = 0; row < matrix.Length; row++)
                {
                    for (int col = 0; col < matrix[row].Length; col++)
                    {
                        if (matrix[row][col] == target)
                        {
                            goto Found;
                        }
                    }
                }
                Console.WriteLine($"Found {target} in matrix {key}.");
                continue;
            Found:
                Console.WriteLine($"Found {target} in matrix {key}.");
            }
        }
        // ref return
        public static void TestRefReturn()
        {
            var xs = new int[] { 1, 2, 3, 4, 30, 49 };
            ref int found = ref FindFirst(xs, s => s == 30);
            ref int newValue = ref found;
            newValue = 99;
            System.Console.WriteLine(string.Join(" ", xs));
            System.Console.WriteLine(newValue);
        }
        public static ref int FindFirst(int[] numbers, Func<int, bool> predicate)
        {
            for (int i = 0; i < numbers.Length; i++)
            {
                if (predicate(numbers[i]))
                {
                    return ref numbers[i];
                }
            }
            throw new InvalidOperationException("No element satisfies the given condition");
        }
        public static IEnumerable<int> TakeWhilePositive(IEnumerable<int> numbers)
        {
            foreach (int n in numbers)
            {
                if (n > 0) yield return n;
                else yield break;
            }
        }
        // yield return
        public static IEnumerable<int> ProduceEvenNumbers(int upto)
        {
            for (int i = 0; i <= upto; i += 2)
            {
                yield return i;
            }
        }
        public static async Task DoAsync()
        {
            Task<int> delayTask = DelayAsync();
            int result = await delayTask;
            System.Console.WriteLine($"Result: {result}");
        }
        public static async Task<int> DelayAsync()
        {
            await Task.Delay(100);
            return 5;
        }
        public static void LearnStringType()
        {
            string a = "hello";
            string b = "h";
            b += "ello";
            string stringLiterals = """
                This is a line from your concious, please consult to your master
                    to learn more about the syntax of this programming language called C#
                        I love this shit because "C#" is my first /language/ even before learnng "Java"
            """;
            // System.Console.WriteLine(a == b);
            // System.Console.WriteLine(object.ReferenceEquals(a, b));
        }

        public delegate int DelegateMethod(string str);
        public static int ConvertStringToInt(string str)
        {
            return int.Parse(str);
        }
        public static int ShowString(string str)
        {
            System.Console.WriteLine($"Show string: {str}");
            return 0;
        }
        public static int MostFrequent(int[] arr)
        {
            Dictionary<int, int> freq = new Dictionary<int, int>();
            int maxFreq = 0;
            int mostFreqNum = 0;

            for (int i = 0; i < arr.Length; i++)
            {
                if (!freq.ContainsKey(arr[i]))
                {
                    freq[arr[i]] = 1;
                }
                else
                {
                    freq[arr[i]]++;
                }

                if (freq[arr[i]] > maxFreq || (freq[arr[i]] == maxFreq && arr[i] < mostFreqNum))
                {
                    maxFreq = freq[arr[i]];
                    mostFreqNum = arr[i];
                }
            }
            return mostFreqNum;
        }
        public static void TestComplexLINQStyles()
        {
            var salesData = Utils.BuildSalesDataList();
            var medMethod = salesData
                        .Where(sales => sales.Quantity >= 10 && sales.Price >= 50)
                        .GroupBy(sales => sales.Region)
                        .Select(group => new
                        {
                            Region = group.Key,
                            TotalSales = group.Sum(sales => sales.Quantity * sales.Price),
                            AveragePrice = Math.Round(group.Average(sales => sales.Price), 2),
                            MaxQuantity = group.Max(sales => sales.Quantity),
                            MinPrice = Math.Round(group.Min(sales => sales.Price), 2)
                        })
                        .OrderByDescending(group => group.TotalSales)
                        .ToList();
            // result1.ForEach(item => System.Console.WriteLine(item));
            var medQuery = from sales in salesData
                           where sales.Quantity >= 10 && sales.Price >= 50
                           group sales by sales.Region into regionGroup
                           orderby regionGroup.Sum(sales => sales.Quantity * sales.Price) descending
                           select new
                           {
                               Region = regionGroup.Key,
                               TotalSales = regionGroup.Sum(sales => sales.Quantity * sales.Price),
                               AveragePrice = Math.Round(regionGroup.Average(sales => sales.Price), 2),
                               MaxQuantity = regionGroup.Max(sales => sales.Quantity),
                               MinPrice = Math.Round(regionGroup.Min(sales => sales.Price), 2)
                           };
            // foreach (var item in mediumQuery)
            // {
            //     System.Console.WriteLine(item);
            // }
            var hardMethod = salesData
                            .GroupBy(sales => new { sales.Region, sales.Product })
                            .Select(group => new
                            {
                                Region = group.Key.Region,
                                Product = group.Key.Product,
                                TotalSales = group.Sum(sales => sales.Quantity * sales.Price),
                                AveragePrice = Math.Round(group.Average(sales => sales.Price), 2),
                                MaxQuantity = group.Max(sales => sales.Quantity),
                                MinPrice = Math.Round(group.Min(sales => sales.Price), 2),
                                MaxPrice = Math.Round(group.Max(sales => sales.Price), 2)
                            })
                            .OrderByDescending(group => group.TotalSales)
                            .GroupBy(group => group.Region)
                            .SelectMany(regionGroup => regionGroup.
                                OrderByDescending(group => group.TotalSales))
                            .Select((group, index) => new
                            {
                                Rank = index + 1,
                                Region = group.Region,
                                Product = group.Product,
                                TotalSales = group.TotalSales,
                                AveragePrice = group.AveragePrice,
                                MaxQuantity = group.MaxQuantity,
                                MinPrice = group.MinPrice,
                                MaxPrice = group.MaxPrice
                            })
                            .OrderBy(group => group.Region)
                            .ThenBy(group => group.Rank)
                            .ToList();
            // hardMethod.ForEach(data => System.Console.WriteLine(data));

            // Conclusions: I Prefer the method style to write LINQ
        }
    }
    public struct Coords
    {
        public const int CONST_VALUE = 2;
        public readonly int READONLY_VALUE;
        public readonly void GetShit() { }
        public Coords(double x, double y)
        {
            X = x;
            Y = y;
        }
        public double X { get; }
        public double Y { get; }
        public readonly override string ToString() => $"{X} {Y}";
    }
    public struct EmployeeStruct
    {
        public string Name { get; set; }
        public int Age { get; set; }
    }
    class TestMotorcycle : Motorcycle
    {

        public override double GetTopSpeed()
        {

            return new Random().NextDouble() * 100;
        }

        public override int Drive(int miles, int speed)
        {
            return base.Drive(1, 19) + 99;
        }

        public static int ManipulateInt(ref int num)
        {
            return new Random().Next(1, 10) * num;
        }
        public static int? CheckDriverMentalScore(double speed)
        {
            int? score = null;
            return score;
        }
    }
    abstract class Motorcycle
    {
        public void StartEngine() { }
        protected void AddGas(int gallons) { }
        public virtual int Drive(int miles, int speed) { return 1; }
        public abstract double GetTopSpeed();
    }

    public class AllElements : System.Collections.IEnumerable
    {
        Element[] _elements ={
            new Element() { Name = "red" },
            new Element() { Name = "blue" },
            new Element() { Name = "green" }
        };

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new ElementEnumerator(_elements);
            // return _elements.GetEnumerator();
        }

        public static IEnumerator<int> EvenSequence(int first, int last)
        {
            for (int i = first; i <= last; i++)
            {
                if (i % 2 == 0)
                {
                    yield return i;
                }
            }
        }

        private class ElementEnumerator : System.Collections.IEnumerator
        {
            private Element[] _elements;
            private int _position = -1;
            public ElementEnumerator(Element[] elements)
            {
                _elements = elements;
            }

            object IEnumerator.Current
            {
                get
                {
                    return _elements[_position];
                }
            }

            bool IEnumerator.MoveNext()
            {
                _position++;
                return (_position < _elements.Length);
            }

            void IEnumerator.Reset()
            {
                _position = -1;
            }
        }
    }

    enum BeveragePrice
    {
        Vodka = 500_000,
        Gin = 900_000,
        Rum = 1_200_000,
        Soju = 125_000,
    }

    class Galaxy
    {
        public string Name { get; set; }
        public int MegaLightYears { get; set; }
    }

    public class SalesData
    {
        public string Region { get; set; }
        public string Product { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }

    class Element
    {
        public string Symbol { get; set; }
        public string Name { get; set; }
        public int AtomicNumber { get; set; }
        public string FullName { get; set; }
    }
    class Utils
    {
        public static List<Element> BuildElementList()
        {
            return new List<Element>
            {
                new Element() { Symbol="K", Name="Potassium", AtomicNumber=19},
                new Element() { Symbol="Ca", Name="Calcium", AtomicNumber=20},
                new Element() { Symbol="Fe", Name="Scandium", AtomicNumber=231},
                new Element() { Symbol="Sc", Name="Metaniun", AtomicNumber=212},
                new Element() { Symbol="Br", Name="Jackarium", AtomicNumber=621},
                new Element() { Symbol="Ti", Name="Netalin", AtomicNumber=5},
                new Element() { Symbol="Sr", Name="Masterium", AtomicNumber=77},
                new Element() { Symbol="Zi", Name="Deltanium", AtomicNumber=12},
                new Element() { Symbol="C", Name="Carvibra", AtomicNumber=72},
            };
        }
        public static List<SalesData> BuildSalesDataList()
        {
            return new List<SalesData>
            {
                new SalesData { Region = "North", Product = "Product A", Quantity = 10, Price = 100 },
                new SalesData { Region = "North", Product = "Product B", Quantity = 20, Price = 50 },
                new SalesData { Region = "North", Product = "Product C", Quantity = 15, Price = 75 },
                new SalesData { Region = "South", Product = "Product A", Quantity = 5, Price = 120 },
                new SalesData { Region = "South", Product = "Product B", Quantity = 30, Price = 40 },
                new SalesData { Region = "South", Product = "Product C", Quantity = 25, Price = 60 },
                new SalesData { Region = "East", Product = "Product A", Quantity = 12, Price = 90 },
                new SalesData { Region = "East", Product = "Product B", Quantity = 18, Price = 55 },
                new SalesData { Region = "East", Product = "Product C", Quantity = 20, Price = 70 },
                new SalesData { Region = "West", Product = "Product A", Quantity = 8, Price = 110 },
                new SalesData { Region = "West", Product = "Product B", Quantity = 25, Price = 45 },
                new SalesData { Region = "West", Product = "Product C", Quantity = 30, Price = 55 }
            };
        }
    }

    class BaseAudit
    {
        public DateTime CreatedDate { get; }
        public DateTime UpdatedDate { get; set; }
        public DateTime DeletedDate { get; set; }

        public BaseAudit()
        {
            this.CreatedDate = DateTime.Now;
            this.UpdatedDate = DateTime.Now;
        }
    }

    class Employee
    {
        public string FirstName { get; private set; }
        public string LastName { get; init; }
        public string FullName { get; set; }

        public void Print() => System.Console.WriteLine($"{FirstName} {LastName} {FullName}");
    }

    record RecordEmployee
    {
        public string Name { get; set; }
    }

    class Customer : BaseAudit
    {
        public string Name
        {
            get => _name;
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    throw new ArgumentException("Name must not be blank");
                }
                _name = value;
            }
        }
        private string _name;
        public string? Email { get; init; }
        public string? Address { get; private set; }
        public decimal TotalPurchased { get; set; } = 0;
        private decimal TotalPurchasedTime = 0;

        public Customer(string contactName, string email, string address) : base()
        {
            Name = contactName;
            Email = email;
            Address = address;
        }

        public void buyAlcohol(BeveragePrice beverage)
        {
            // If bough more than 5 then discount -2%
            TotalPurchasedTime++;
            decimal price = (decimal)beverage;
            TotalPurchased += TotalPurchasedTime > 5 ? price * 98 / 100 : price;
        }

        public string toString() => Name + " " + Email + " " + Address;

        public void ChangeAddress(string newAddress) => Address = newAddress;
    }
}