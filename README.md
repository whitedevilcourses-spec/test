# Polymorphism in Java

## Introduction

Polymorphism is one of the four fundamental principles of Object-Oriented Programming (OOP). The word polymorphism means "many forms".

In Java, polymorphism allows a single entity (method or object) to behave differently in different situations.

Polymorphism is achieved through:

- Method Overloading (Compile-time Polymorphism)
- Method Overriding (Runtime Polymorphism)
- Upcasting and Dynamic Method Dispatch
- Interfaces and Abstract Classes

Polymorphism promotes flexibility, extensibility, and clean architecture in software systems.

---

## Understanding Polymorphism

At its core, polymorphism means:

> One interface, multiple implementations.

It allows objects to be treated as instances of their parent class while executing their specific behavior.

For example:

- A `Shape` can be a `Circle`, `Rectangle`, or `Triangle`
- A `Payment` can be `CreditCard`, `UPI`, or `PayPal`

The behavior depends on the actual object, not the reference type.

---

## Types of Polymorphism in Java

Java supports two types of polymorphism:

### 1. Compile-Time Polymorphism (Method Overloading)

Occurs when multiple methods have the same name but different parameters.

### 2. Runtime Polymorphism (Method Overriding)

Occurs when a subclass provides a specific implementation of a method defined in its parent class.

---

## Compile-Time Polymorphism (Method Overloading)

Method overloading:

- Same method name
- Different parameter list (type or number)
- Happens at compile time
- Increases readability

---

## Example 1: Method Overloading

```java
class Calculator {

    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }

    int add(int a, int b, int c) {
        return a + b + c;
    }
}

public class Main {
    public static void main(String[] args) {
        Calculator calc = new Calculator();

        System.out.println(calc.add(5, 10));
        System.out.println(calc.add(5.5, 2.5));
        System.out.println(calc.add(1, 2, 3));
    }
}
```

### Sample Output

```
15
8.0
6
```

Here, the method executed depends on the method signature at compile time.

---

## Runtime Polymorphism (Method Overriding)

Method overriding:

- Requires inheritance
- Method signature must be identical
- Resolved at runtime
- Achieved through dynamic method dispatch

---

## Example 2: Method Overriding

```java
class Animal {

    void makeSound() {
        System.out.println("Animal makes a sound.");
    }
}

class Dog extends Animal {

    @Override
    void makeSound() {
        System.out.println("Dog barks.");
    }
}

class Cat extends Animal {

    @Override
    void makeSound() {
        System.out.println("Cat meows.");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a1 = new Dog();
        Animal a2 = new Cat();

        a1.makeSound();
        a2.makeSound();
    }
}
```

### Sample Output

```
Dog barks.
Cat meows.
```

The method executed depends on the actual object at runtime.

---

## Dynamic Method Dispatch

Dynamic Method Dispatch is the mechanism by which a call to an overridden method is resolved at runtime.

Example:

```java
Animal animal = new Dog();
animal.makeSound();
```

Even though the reference type is `Animal`, the method of `Dog` is executed.

This enables runtime flexibility.

---

## Upcasting and Downcasting

### Upcasting
Converting a child class reference to a parent class reference.

```java
Animal animal = new Dog();  // Upcasting
```

Upcasting is implicit and safe.

### Downcasting
Converting a parent reference back to a child reference.

```java
Dog dog = (Dog) animal;  // Downcasting
```

Downcasting must be explicit and should be done carefully to avoid `ClassCastException`.

---

## Polymorphism with Interfaces

Interfaces allow full abstraction and runtime polymorphism.

---

## Example 3: Polymorphism Using Interface

```java
interface Payment {

    void pay(double amount);
}

class CreditCardPayment implements Payment {

    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using Credit Card.");
    }
}

class UpiPayment implements Payment {

    @Override
    public void pay(double amount) {
        System.out.println("Paid " + amount + " using UPI.");
    }
}

public class Main {
    public static void main(String[] args) {
        Payment payment = new CreditCardPayment();
        payment.pay(1000);

        payment = new UpiPayment();
        payment.pay(500);
    }
}
```

### Sample Output

```
Paid 1000.0 using Credit Card.
Paid 500.0 using UPI.
```

The same interface behaves differently depending on the implementation.

---

## Advantages of Polymorphism

### 1. Flexibility
New implementations can be added without modifying existing code.

### 2. Loose Coupling
Code depends on abstractions rather than concrete classes.

### 3. Extensibility
Systems can grow easily.

### 4. Cleaner Code
Reduces conditional logic and improves maintainability.

---

## Real-World Applications of Polymorphism

Polymorphism is widely used in:

- Payment gateways → Multiple payment methods
- Logging frameworks → Different logging strategies
- Notification systems → Email, SMS, Push notifications
- Database drivers → Different database implementations

It enables scalable and adaptable software systems.

---

## Overloading vs Overriding

| Feature | Overloading | Overriding |
|----------|------------|------------|
| Occurs In | Same class | Parent-child classes |
| Parameters | Must differ | Must be identical |
| Return Type | Can differ | Must be same or covariant |
| Binding | Compile time | Runtime |
| Inheritance Required | No | Yes |

---

## Best Practices for Polymorphism in Java

- Always use `@Override` annotation  
- Program to interfaces, not implementations  
- Avoid unnecessary downcasting  
- Keep base classes generic  
- Follow SOLID principles  

---

## Conclusion

Polymorphism enables objects to take many forms and behave differently based on their actual type.

It improves:

- Flexibility  
- Maintainability  
- Extensibility  
- Clean system design  

Polymorphism, combined with encapsulation, abstraction, and inheritance, completes the four foundational pillars of Object-Oriented Programming in Java.
