# Encapsulation in Java

## Introduction

Encapsulation is one of the four fundamental principles of Object-Oriented Programming (OOP). It is the practice of bundling data (variables) and the methods that operate on that data into a single unit (class) while restricting direct access to internal implementation details.

In Java, encapsulation is achieved using:

- Access Modifiers (`private`, `protected`, `public`)
- Getters and Setters
- Data Hiding

Encapsulation improves data protection, modularity, maintainability, and security of applications.

---

## What is Encapsulation?

Encapsulation refers to wrapping data (variables) and behavior (methods) together inside a class while preventing direct external access to internal state.

By restricting access to certain components of an object, encapsulation:

- Protects data integrity  
- Prevents unintended modifications  
- Ensures controlled access through defined interfaces  

---

## Key Benefits of Encapsulation

- **Data Hiding** – Prevents direct access to sensitive data.
- **Increased Security** – Controls how data is accessed and modified.
- **Improved Maintainability** – Allows internal implementation changes without affecting other parts of the system.
- **Better Modularity** – Organizes code into logical, self-contained components.

---

## Encapsulation Using Access Modifiers

Java provides access modifiers to enforce encapsulation:

- `private` – Accessible only within the same class.
- `protected` – Accessible within the same package and subclasses.
- `public` – Accessible from anywhere.

---

## Example: Encapsulation with Private Variables

```java
class BankAccount {

    private String accountHolder;
    private double balance;

    public BankAccount(String accountHolder, double balance) {
        this.accountHolder = accountHolder;
        this.balance = balance;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: " + amount);
        } else {
            System.out.println("Invalid deposit amount");
        }
    }
}
```

### Usage

```java
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("Alice", 1000);
        System.out.println("Current Balance: " + account.getBalance());
        account.deposit(500);
        System.out.println("Updated Balance: " + account.getBalance());
    }
}
```

### Output

```
Current Balance: 1000.0
Deposited: 500.0
Updated Balance: 1500.0
```

---

## Why Use Encapsulation?

- Prevents unauthorized access to internal data.
- Allows controlled modifications through methods.
- Protects system integrity from accidental misuse.

---

## Encapsulation Using Getters and Setters

Encapsulation ensures that object state cannot be accessed directly. Instead, values are retrieved or modified through methods.

---

## Example: Getters and Setters in Java

```java
class Employee {

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age > 18) {
            this.age = age;
        } else {
            System.out.println("Age must be greater than 18");
        }
    }
}
```

### Usage

```java
public class Main {
    public static void main(String[] args) {
        Employee emp = new Employee();
        emp.setName("John Doe");
        emp.setAge(25);
        System.out.println("Employee Name: " + emp.getName());
        System.out.println("Employee Age: " + emp.getAge());
    }
}
```

### Output

```
Employee Name: John Doe
Employee Age: 25
```

---

## Encapsulation and Data Hiding

Encapsulation hides implementation details while exposing only the necessary methods required for interaction.

---

## Example: Hiding Implementation Details

```java
class Account {

    private double balance;

    public Account(double initialBalance) {
        this.balance = initialBalance;
    }

    private boolean validateWithdrawal(double amount) {
        return amount > 0 && amount <= balance;
    }

    public void withdraw(double amount) {
        if (validateWithdrawal(amount)) {
            balance -= amount;
            System.out.println("Withdrawal Successful: " + amount);
        } else {
            System.out.println("Insufficient balance or invalid amount");
        }
    }

    public double getBalance() {
        return balance;
    }
}
```

### Usage

```java
public class Main {
    public static void main(String[] args) {
        Account myAccount = new Account(1000);
        myAccount.withdraw(300);
        System.out.println("Remaining Balance: " + myAccount.getBalance());
    }
}
```

### Output

```
Withdrawal Successful: 300.0
Remaining Balance: 700.0
```

---

## Why Hide Data?

- Prevents direct modification of critical fields.
- Ensures validation before state changes.
- Maintains system consistency and reliability.

---

## Encapsulation in Real-World Applications

Encapsulation is widely used in:

- Banking Systems – Protecting account information  
- Healthcare Applications – Securing patient records  
- E-Commerce Platforms – Hiding payment processing logic  

---

## Example: Encapsulation in Payment Processing

```java
class PaymentProcessor {

    private String cardNumber;
    private double amount;

    public PaymentProcessor(String cardNumber, double amount) {
        this.cardNumber = maskCardNumber(cardNumber);
        this.amount = amount;
    }

    private String maskCardNumber(String cardNumber) {
        return "****-****-****-" + cardNumber.substring(cardNumber.length() - 4);
    }

    public void processPayment() {
        System.out.println("Processing payment of " + amount + " for card " + cardNumber);
    }
}
```

### Usage

```java
public class Main {
    public static void main(String[] args) {
        PaymentProcessor payment = new PaymentProcessor("1234567812345678", 250.00);
        payment.processPayment();
    }
}
```

### Output

```
Processing payment of 250.0 for card ****-****-****-5678
```

---

## Why Use Encapsulation in Payment Processing?

- Protects sensitive data such as credit card numbers.
- Hides unnecessary internal details.
- Ensures secure and controlled transactions.
