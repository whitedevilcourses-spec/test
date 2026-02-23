# Object Relationships in OOP

## Introduction

In Object-Oriented Programming (OOP), classes do not exist in isolation. They interact with one another to build real-world systems.

These interactions are called **Object Relationships**.

The four fundamental object relationships are:

- Association  
- Aggregation  
- Composition  
- Dependency  

Understanding these relationships is essential for:

- Low Level Design (LLD)
- UML diagram modeling
- Writing scalable architecture
- Cracking system design interviews

---

# 1. Association

## Definition

Association represents a general relationship between two independent classes.

It indicates that one object uses or interacts with another object.

It is the most basic form of relationship in OOP.

---

## Key Characteristics

- Represents a "uses" or "works with" relationship
- Objects can exist independently
- Can be one-to-one, one-to-many, or many-to-many
- No ownership implied

---

## Example: Teacher and Student

```java
class Student {
    String name;

    Student(String name) {
        this.name = name;
    }
}

class Teacher {
    String name;

    Teacher(String name) {
        this.name = name;
    }

    void teach(Student student) {
        System.out.println(name + " teaches " + student.name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Rahul");
        Teacher t = new Teacher("Mr. Sharma");

        t.teach(s);
    }
}
```

### Explanation

- Teacher and Student are independent.
- If Teacher is deleted, Student still exists.
- If Student is deleted, Teacher still exists.

This is simple association.

---

# 2. Aggregation

## Definition

Aggregation is a special form of association representing a weak "Has-A" relationship.

It implies ownership, but the contained object can still exist independently.

---

## Key Characteristics

- Weak ownership
- Represented by a hollow diamond in UML
- Objects can exist independently
- Lifetime of child object does not depend on parent

---

## Example: Department and Teacher

```java
import java.util.List;

class Teacher {
    String name;

    Teacher(String name) {
        this.name = name;
    }
}

class Department {
    String deptName;
    List<Teacher> teachers;

    Department(String deptName, List<Teacher> teachers) {
        this.deptName = deptName;
        this.teachers = teachers;
    }

    void showTeachers() {
        for (Teacher t : teachers) {
            System.out.println(t.name);
        }
    }
}
```

### Explanation

- Department "has" Teachers.
- If Department is deleted, Teachers still exist.
- Teachers are not fully owned by Department.

This is aggregation.

---

# 3. Composition

## Definition

Composition is a strong form of aggregation representing a strong "Has-A" relationship.

The contained object cannot exist independently of the parent.

---

## Key Characteristics

- Strong ownership
- Represented by a filled diamond in UML
- Child object lifecycle depends on parent
- If parent is destroyed, child is destroyed

---

## Example: House and Room

```java
class Room {
    String type;

    Room(String type) {
        this.type = type;
    }
}

class House {
    private Room bedroom;
    private Room kitchen;

    House() {
        bedroom = new Room("Bedroom");
        kitchen = new Room("Kitchen");
    }

    void showRooms() {
        System.out.println(bedroom.type);
        System.out.println(kitchen.type);
    }
}
```

### Explanation

- House creates and owns Rooms.
- Rooms cannot exist without House.
- If House is deleted, Rooms are also deleted.

This is composition.

---

# 4. Dependency

## Definition

Dependency represents a temporary "uses" relationship between classes.

One class depends on another to perform a specific operation.

It is the weakest form of relationship.

---

## Key Characteristics

- Short-term relationship
- No ownership
- Usually method-level usage
- Represented by dashed arrow in UML

---

## Example: PaymentService and EmailService

```java
class EmailService {
    void sendEmail(String message) {
        System.out.println("Email sent: " + message);
    }
}

class PaymentService {

    void processPayment(double amount, EmailService emailService) {
        System.out.println("Payment processed: " + amount);
        emailService.sendEmail("Payment successful");
    }
}
```

### Explanation

- PaymentService temporarily uses EmailService.
- It does not own EmailService.
- Relationship exists only during method execution.

This is dependency.

---

# Comparison Table

| Relationship | Type | Ownership | Lifecycle Dependency | Strength |
|-------------|------|-----------|----------------------|----------|
| Association | Uses | No | Independent | Weak |
| Aggregation | Has-A | Weak | Independent | Medium |
| Composition | Strong Has-A | Strong | Dependent | Strong |
| Dependency | Temporary Uses | No | Independent | Very Weak |

---

# When to Use What?

- Use **Association** for general interactions.
- Use **Aggregation** when one object contains another but does not fully own it.
- Use **Composition** when child object should not exist without parent.
- Use **Dependency** for temporary method-level usage.

---

# Why These Relationships Matter

These relationships are foundational for:

- Writing clean object-oriented code
- Designing scalable systems
- Creating UML diagrams
- Understanding design patterns
- Cracking LLD interviews

Strong understanding of these concepts separates beginner developers from system designers.

---

# Conclusion

Object relationships define how classes interact in real-world systems.

Understanding:

- Association  
- Aggregation  
- Composition  
- Dependency  

is essential for mastering Low Level Design and building professional software architectures.

They form the structural backbone of Object-Oriented Design.
