# Encapsulation in Java

## Introduction

Encapsulation is one of the fundamental principles of Object-Oriented Programming (OOP). It refers to the practice of bundling data (fields) and the methods that operate on that data into a single unit — typically a class — while restricting direct access to the object's internal state.

In Java, encapsulation is implemented using:

- Access modifiers (`private`, `protected`, `public`)
- Getter and setter methods
- Controlled exposure of functionality
- Data hiding principles

By preventing direct access to internal data, encapsulation promotes robustness, maintainability, and security in software systems.

---

## Understanding Encapsulation

At its core, encapsulation means:

> Protect the internal state of an object and expose only well-defined interfaces for interaction.

Instead of allowing external classes to modify fields directly, we declare them as `private` and provide controlled access through public methods. This ensures that object integrity is maintained and business rules are consistently enforced.

---

## Advantages of Encapsulation

### 1. Data Protection
Prevents unauthorized or unintended modification of internal state.

### 2. Controlled Modification
Enables validation and business logic enforcement before updating values.

### 3. Improved Maintainability
Internal implementation can evolve without impacting external consumers of the class.

### 4. Better Code Organization
Groups related data and behavior together, improving readability and modularity.

---

## Encapsulation Through Access Modifiers

Java provides access control mechanisms to enforce encapsulation:

- `private` → Accessible only within the same class  
- `protected` → Accessible within the same package and subclasses  
- `public` → Accessible from anywhere  

The standard encapsulation pattern is:

- Declare fields as `private`
- Provide public getter and/or setter methods when necessary

---

## Example 1: Basic Encapsulation with Private Fields

```java
class Student {

    private String name;
    private double marks;

    public Student(String name, double marks) {
        this.name = name;
        this.marks = marks;
    }

    public double getMarks() {
        return marks;
    }

    public void addBonusMarks(double bonus) {
        if (bonus < 0) {
            System.out.println("Bonus marks cannot be negative.");
            return;
        }
        marks += bonus;
        System.out.println("Bonus added: " + bonus);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Rahul", 75);
        System.out.println("Initial Marks: " + s.getMarks());
        s.addBonusMarks(5);
        System.out.println("Final Marks: " + s.getMarks());
    }
}
```

### Sample Output

```
Initial Marks: 75.0
Bonus added: 5.0
Final Marks: 80.0
```

Here, the `marks` field cannot be modified directly from outside the class, ensuring controlled state management.

---

## Why Encapsulation Is Important

Without encapsulation:

```java
s.marks = -500;
```

This would directly corrupt the object’s state.

With encapsulation:

- Direct modification is prevented
- Validation logic ensures correctness
- Object state remains consistent and reliable

Encapsulation protects the integrity of your system.

---

## Encapsulation Using Getters and Setters

- **Getters** retrieve values.
- **Setters** update values while enforcing validation rules.

---

## Example 2: Product Data Protection

```java
class Product {

    private String productName;
    private double price;

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        if (productName == null || productName.isBlank()) {
            System.out.println("Invalid product name.");
            return;
        }
        this.productName = productName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if (price <= 0) {
            System.out.println("Price must be greater than zero.");
            return;
        }
        this.price = price;
    }
}
```

This design ensures that invalid data cannot be assigned, preserving object validity.

---

## Encapsulation and Internal Validation

Encapsulation allows internal helper methods that remain hidden from external classes, ensuring that business logic is not exposed unnecessarily.

---

## Example 3: Secure Ticket Booking Logic

```java
class Ticket {

    private int availableSeats;

    public Ticket(int seats) {
        this.availableSeats = seats;
    }

    private boolean canBook(int seatsRequested) {
        return seatsRequested > 0 && seatsRequested <= availableSeats;
    }

    public void bookSeats(int seatsRequested) {
        if (canBook(seatsRequested)) {
            availableSeats -= seatsRequested;
            System.out.println("Seats booked: " + seatsRequested);
        } else {
            System.out.println("Booking failed.");
        }
    }

    public int getAvailableSeats() {
        return availableSeats;
    }
}
```

The `canBook` method is kept `private`, ensuring that validation logic remains internal and protected.

---

## Real-World Applications of Encapsulation

Encapsulation is widely used in production-grade systems:

- Banking software → Protects account balances  
- Healthcare systems → Secures patient data  
- E-commerce platforms → Abstracts payment logic  
- Authentication systems → Protects credentials  

It is foundational to building secure and scalable applications.

---

## Example 4: Masking Sensitive Information

```java
class EmailService {

    private String maskedEmail;

    public EmailService(String email) {
        this.maskedEmail = maskEmail(email);
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf("@");
        return email.charAt(0) + "****" + email.substring(atIndex);
    }

    public void sendNotification() {
        System.out.println("Notification sent to " + maskedEmail);
    }
}
```

Sensitive data is never exposed directly — only a safe representation is shared.

---

## Why Data Hiding Matters

Data hiding ensures:

- Internal structure cannot be tampered with
- Business rules remain enforced
- Object state remains valid
- Security vulnerabilities are minimized

It is a foundational principle for writing secure, enterprise-grade software.

---

## Best Practices for Encapsulation in Java

- Always declare fields as `private`
- Expose only what is necessary
- Validate input within setters
- Keep helper methods `private`
- Avoid exposing mutable objects directly

---

## Conclusion

Encapsulation is more than simply marking fields as `private`. It is about designing classes that safeguard their internal state and enforce business rules through controlled interfaces.

It improves:

- Code safety
- Maintainability
- Scalability
- Security

Encapsulation forms the foundation for advanced concepts such as design patterns, clean architecture, and robust system design.
