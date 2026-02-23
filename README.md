# Inheritance in Java

## Introduction

Inheritance is one of the fundamental principles of Object-Oriented Programming (OOP). It allows one class to acquire the properties and behaviors of another class.

In Java, inheritance is implemented using the `extends` keyword.

Inheritance promotes:

- Code reusability  
- Hierarchical classification  
- Logical relationship modeling  
- Maintainability  
- Method overriding and runtime polymorphism  

It establishes an **IS-A relationship** between classes.

---

## Understanding Inheritance

At its core, inheritance means:

> A child class inherits fields and methods from a parent class.

Instead of rewriting common functionality, we place shared logic in a base class and allow other classes to reuse it.

For example:

- A `Car` IS-A `Vehicle`
- A `Dog` IS-A `Animal`
- A `SavingsAccount` IS-A `BankAccount`

This creates a logical hierarchy in software design.

---

## Syntax of Inheritance

```java
class Parent {
    // fields and methods
}

class Child extends Parent {
    // additional behavior
}
```

The `Child` class inherits all non-private members of the `Parent` class.

---

## Example 1: Basic Inheritance

```java
class Animal {

    void eat() {
        System.out.println("This animal eats food.");
    }
}

class Dog extends Animal {

    void bark() {
        System.out.println("The dog barks.");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.eat();   // Inherited method
        d.bark();  // Own method
    }
}
```

### Sample Output

```
This animal eats food.
The dog barks.
```

Here, `Dog` inherits the `eat()` method from `Animal`.

---

## Types of Inheritance in Java

Java supports the following types of inheritance:

### 1. Single Inheritance
One class inherits from one parent class.

### 2. Multilevel Inheritance
A class inherits from a class which itself inherits from another class.

### 3. Hierarchical Inheritance
Multiple classes inherit from the same parent class.

### Note:
Java does **not** support multiple inheritance with classes to avoid ambiguity (Diamond Problem). However, it supports multiple inheritance using interfaces.

---

## Example 2: Multilevel Inheritance

```java
class Animal {

    void eat() {
        System.out.println("Animal eats.");
    }
}

class Mammal extends Animal {

    void walk() {
        System.out.println("Mammal walks.");
    }
}

class Dog extends Mammal {

    void bark() {
        System.out.println("Dog barks.");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog d = new Dog();
        d.eat();
        d.walk();
        d.bark();
    }
}
```

### Sample Output

```
Animal eats.
Mammal walks.
Dog barks.
```

---

## The `super` Keyword

The `super` keyword is used to:

- Refer to parent class variables  
- Call parent class methods  
- Invoke parent class constructor  

---

## Example 3: Using `super`

```java
class Person {

    String name;

    Person(String name) {
        this.name = name;
    }

    void display() {
        System.out.println("Name: " + name);
    }
}

class Student extends Person {

    int rollNumber;

    Student(String name, int rollNumber) {
        super(name);
        this.rollNumber = rollNumber;
    }

    void showDetails() {
        super.display();
        System.out.println("Roll Number: " + rollNumber);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Rahul", 101);
        s.showDetails();
    }
}
```

### Sample Output

```
Name: Rahul
Roll Number: 101
```

---

## Constructor Chaining in Inheritance

When a child class object is created:

1. Parent class constructor executes first.
2. Then child class constructor executes.

This ensures proper initialization of inherited members.

---

## Method Overriding

Inheritance enables method overriding.

Method overriding occurs when:

- Child class provides its own implementation of a method already defined in the parent class.
- Method signature must be the same.
- Access level cannot be more restrictive.

---

## Example 4: Method Overriding

```java
class Vehicle {

    void start() {
        System.out.println("Vehicle starts.");
    }
}

class Car extends Vehicle {

    @Override
    void start() {
        System.out.println("Car starts with push button.");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle v = new Car();
        v.start();
    }
}
```

### Sample Output

```
Car starts with push button.
```

This demonstrates runtime polymorphism through inheritance.

---

## IS-A Relationship

Inheritance represents an **IS-A relationship**.

- A `Car` IS-A `Vehicle`
- A `Teacher` IS-A `Person`
- A `Circle` IS-A `Shape`

If the relationship is not logically IS-A, inheritance should not be used.

---

## Advantages of Inheritance

### 1. Code Reusability
Common logic is written once and reused.

### 2. Maintainability
Changes in base class propagate automatically.

### 3. Extensibility
New classes can be added easily.

### 4. Supports Polymorphism
Enables dynamic method dispatch.

---

## Real-World Applications of Inheritance

Inheritance is widely used in:

- GUI frameworks → `Button`, `TextField` inherit from base `Component`
- Banking systems → `SavingsAccount`, `CurrentAccount` inherit from `Account`
- E-commerce systems → `Electronics`, `Clothing` inherit from `Product`
- Game development → `Player`, `Enemy` inherit from `Character`

It helps build structured and scalable software hierarchies.

---

## When NOT to Use Inheritance

Avoid inheritance when:

- Relationship is not truly IS-A  
- You need flexibility at runtime  
- Composition is more appropriate  

Prefer **composition over inheritance** when behavior needs to change dynamically.

---

## Best Practices for Inheritance in Java

- Use inheritance only for true IS-A relationships  
- Keep base classes stable and generic  
- Avoid deep inheritance hierarchies  
- Use `@Override` annotation  
- Favor composition when appropriate  

---

## Conclusion

Inheritance enables classes to reuse existing behavior and establish logical hierarchies.

It improves:

- Code reuse  
- Structure  
- Extensibility  
- Maintainability  

Inheritance, combined with abstraction and encapsulation, forms the foundation of Object-Oriented Programming and enables powerful design patterns and scalable system architectures.
