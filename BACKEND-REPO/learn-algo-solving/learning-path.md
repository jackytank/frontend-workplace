# Embrace the .NET

Start: May 29 2023

End: Expected End of June

Below is a list of topics that cover basic to advanced concepts in C#. This learning path is designed to help you learn C# from scratch and take you all the way to advanced topics, such as multithreading and design patterns. Each topic is presented as a checkbox, so you can easily track your progress.

- [x]  Introduction to C#: This topic covers the basics of C#, including variables, data types, and operators. You will also learn how to write and execute your first C# program.
    - [x]  Install .NET, Visual Studio, VSCode Extensions, ..etc..
- [x]  Variables and Data Types: In this topic, you will learn about variables and data types in C#. You will also learn how to declare and initialize variables, and how to use them in your programs.
    - [x]  Modifiers
        - [ ]  Access Modifiers (internal, private, protected, public, protected internal, private protected, file)
        - [ ]  Keywords Modifiers (virtual, volatile, override, in, out, new, async, await, extern, event, sealed, const, readonly, abstract, static, unsafe)
    - [x]  Primitive types (int. long, double, float, decimal. short, and other unsigned types)
    - [x]  Nullable types (using Nullable<T> or ? operator)
    - [x]  string type
        - [x]  [Verbatim string literals](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/verbatim) (@””)
        - [x]  String interpolation ($”{var}”)
    - [x]  object type
    - [x]  dynamic type (not type safe, not known until runtime, IntelliSence is not available)
    - [x]  var type (type safe, no issue at runtime, make code shorter, reduce effort to create new class, prefer when using LINQ)
    - [x]  anonymous type (by using object initializer, not allow null, derived directly from object)
    - [x]  struct type (Not reference type, can’t be derived or become base class, only for hold data)
    - [x]  “ref” keyword and reference types
        - When a reference type (such as an object) is passed by value to a method in C#, a copy of the reference is created and passed to the method. Mean: original reference and the copy of the reference both point to the same object in memory
        - using “ref” with primitive type the behavior is expected
- [x]  Operators: This topic covers the different types of operators in C#, such as arithmetic, logical, and comparison operators. You will also learn how to use operators to perform different operations in your programs.
    - [x]  Operators (is, new, sizeof, delegate, cast, as)
        - as: should use if uncertain if conversion is success
        - cast: use if certain the conversion will be succeed
        - is, as, typeof: can be overloaded
    - [x]  Expression (with, switch, stackalloc, default)
- [x]  Control Flow Statements: In this topic, you will learn about control flow statements in C#, such as if-else statements, switch statements, and loops. You will also learn how to use these statements to control the flow of your programs.
    - [x]  Jump statement
        - [x]  ref return
        - [x]  goto statement (can use in for-loop and switch )
    - [x]  Iterative statement
        - [x]  foreach: use ref inside statement (recommend using ref readonly)
- [x]  Low-level shits
    - [x]  Span<T> (for string should use .AsSpan().Slice instead of .SubString() )
    - [ ]  Memory<T>
- [x]  Functional technique & patterns
    - [x]  Pattern matching (declaration pattern, constant pattern, logical pattern,…)
- [x]  Arrays and Collections: This topic covers arrays and collections in C#. You will learn how to declare, initialize, and use arrays and collections in your programs.
    - [x]  List, ArrayList
    - [x]  Dictionary
    - [x]  HashTable
    - [x]  Stack
    - [x]  LinkedList
    - [ ]  Queue
- [x]  Methods and Functions: In this topic, you will learn about methods and functions in C#. You will learn how to declare, define, and call methods and functions in your programs.
    - [x]  Method parameters vs. arguments
    - [x]  Passing by value, Passing by reference (”ref” keyword)
        - [x]  Pass a value type by value (changes **aren't** visible from the caller.)
        - [x]  Pass a value type by reference (changes **are** visible from the caller.)
        - [x]  Pass a reference type by value (changes **are** visible from the caller)
        - [x]  Pass a reference type by reference (changes **are** visible from the caller.)
    - [x]  “in” keyword (pass parameter by reference in read-only mode, you can read its value but cannot modify it) ⇒ ***Recommended*** to use in normal and multi-threaded environment
    - [x]  “out” keyword (similar to “ref” but it expect assign value to the parameter before returning)
    - [x]  Return type
        - [x]  yield return (for foreach-loop to loop over instead of return individual value)
        - [x]  ref return (return as a reference to a variable)
- [ ]  Classes and Objects: This topic covers classes and objects in C#. You will learn how to declare and define classes, and how to create and use objects of these classes.
- [ ]  Inheritance and Polymorphism: In this topic, you will learn about inheritance and polymorphism in C#. You will learn how to create and use derived classes, and how to use polymorphism to write more flexible and reusable code.
- [ ]  Interfaces: This topic covers interfaces in C#. You will learn how to declare and define interfaces, and how to use them to write code that is more flexible and extensible.
- [ ]  Delegates and Events: In this topic, you will learn about delegates and events in C#. You will learn how to declare and use delegates and events, and how to write event handlers for different types of events.
- [x]  Exception Handling: This topic covers exception handling in C#. You will learn how to handle exceptions in your programs, and how to write code that is more robust and reliable.
    - Don't throw System.Exception, System.SystemException, System.NullReferenceException, or System.IndexOutOfRangeException
- [x]  LINQ: In this topic, you will learn about LINQ (Language-Integrated Query) in C#. You will learn how to use LINQ to query different data sources, such as arrays, collections, and databases.
    - [x]  LINQ Method style
        - [x]  On Collections source
        - [ ]  On Database source
    - [x]  LINQ Query style
        - [x]  On Collections source
        - [ ]  On Database source
- [ ]  Asynchronous Programming: This topic covers asynchronous programming in C#. You will learn how to use async and await keywords to write code that is more responsive and efficient.
- [ ]  Reflection and Attributes: In this topic, you will learn about reflection and attributes in C#. You will learn how to use reflection to inspect and manipulate objects at runtime, and how to use attributes to annotate your code with metadata.
- [ ]  Generics: This topic covers generics in C#. You will learn how to declare and use generic classes, methods, and interfaces, and how to write code that is more reusable and type-safe.
- [ ]  Multithreading: In this topic, you will learn about multithreading in C#. You will learn how to use threads and locks to write code that is more concurrent and scalable.
- [ ]  File I/O and Serialization: This topic covers file I/O and serialization in C#. You will learn how to read and write files, and how to serialize and deserialize objects using different formats, such as XML and JSON.
- [ ]  Unit Testing: In this topic, you will learn about unit testing in C#. You will learn how to write unit tests for your code, and how to use frameworks, such as NUnit and xUnit, to automate your tests.
- [ ]  Design Patterns: This topic covers design patterns in C#. You will learn about different types of design patterns, such as creational, structural, and behavioral patterns, and how to use them to write code that is more modular, maintainable, and extensible.
- [ ]  Entity Framework Core: This topic covers Entity Framework Core in C#. You will learn how to use Entity Framework Core to interact with different databases, and how to write code that is more data-driven and scalable.

# Winform Path

Below is a list of topics that cover basic to advanced concepts in Winforms. This learning path is designed to help you learn Winforms from scratch and take you all the way to advanced topics, such as localization and deployment. Each topic is presented as a checkbox, so you can easily track your progress.

- [ ]  Introduction to Winforms: This topic covers the basics of Winforms, including creating forms and controls, and event handling. You will also learn how to write and execute your first Winforms application.
- [ ]  Creating Forms and Controls: In this topic, you will learn how to create forms and controls in Winforms. You will also learn how to customize the appearance and behavior of these forms and controls.
- [ ]  Event Handling: This topic covers event handling in Winforms. You will learn how to handle different types of events, such as button clicks, mouse events, and keyboard events.
- [ ]  Layout and Docking: In this topic, you will learn about layout and docking in Winforms. You will learn how to use different types of layouts, such as flow layout and table layout, to arrange controls on a form.
- [ ]  Menus and Toolbars: This topic covers menus and toolbars in Winforms. You will learn how to create and customize menus and toolbars, and how to handle different types of menu and toolbar events.
- [ ]  Dialog Boxes: In this topic, you will learn about dialog boxes in Winforms. You will learn how to create and use different types of dialog boxes, such as message boxes and file dialogs.
- [ ]  Data Binding: This topic covers data binding in Winforms. You will learn how to bind controls to data sources, such as databases and XML files, and how to display and edit data in your Winforms applications.
- [ ]  Data Validation: In this topic, you will learn about data validation in Winforms. You will learn how to validate user input, and how to display error messages when validation fails.
- [ ]  DataGridView Control: This topic covers the DataGridView control in Winforms. You will learn how to use the DataGridView control to display and edit tabular data, and how to customize its appearance and behavior.
- [ ]  ListView and TreeView Controls: In this topic, you will learn about the ListView and TreeView controls in Winforms. You will learn how to use these controls to display hierarchical data, such as file systems and directories.
- [ ]  Working with Files and Folders: This topic covers working with files and folders in Winforms. You will learn how to read and write files and directories, and how to use different types of file dialogs to interact with the file system.
- [ ]  Printing and Reporting: In this topic, you will learn about printing and reporting in Winforms. You will learn how to create and customize print previews and reports, and how to use different types of print dialogs to print documents.
- [ ]  Advanced Controls: This topic covers advanced controls in Winforms, such as the WebBrowser control and the RichTextBox control. You will learn how to use these controls to add more functionality to your Winforms applications.
- [ ]  Custom Controls: In this topic, you will learn about custom controls in Winforms. You will learn how to create and use custom controls, and how to add them to the toolbox for reuse in other projects.
- [ ]  Multithreading in Winforms: This topic covers multithreading in Winforms. You will learn how to use threads and locks to write code that is more concurrent and responsive.
- [ ]  Deployment and Installation: In this topic, you will learn about deployment and installation in Winforms. You will learn how to create and customize installation packages, and how to deploy your Winforms applications to different environments.
- [ ]  Localization and Globalization: This topic covers localization and globalization in Winforms. You will learn how to create and use resource files to support different languages and cultures, and how to customize the appearance and behavior of your Winforms applications based on the user's locale.
- [ ]  Windows Services: This topic covers Windows services in Winforms. You will learn how to create and install Windows services, and how to write code that runs as a Windows service.