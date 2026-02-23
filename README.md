# Association in Object-Oriented Programming

## Introduction

Association is the most fundamental relationship between two classes in Object-Oriented Programming (OOP).

It represents a general connection where one object interacts with or uses another object.

Association models real-world relationships where two entities are related but remain independent of each other.

---

## Definition

Association is a relationship between two independent classes where:

- One object uses or interacts with another
- Neither object owns the other
- Both objects can exist independently

It is commonly described as a **"uses"** or **"works with"** relationship.

---

## Key Characteristics

- No ownership implied
- Independent object lifecycles
- Can be unidirectional or bidirectional
- Can represent one-to-one, one-to-many, or many-to-many relationships

---

## Types of Association

### 1. Unidirectional Association

One class knows about the other, but not vice versa.

Example:
Teacher → Student

### 2. Bidirectional Association

Both classes reference each other.

Example:
Student ↔ Course

---

## Example 1: Unidirectional Association

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

- Teacher interacts with Student.
- Teacher does not own Student.
- Student can exist without Teacher.
- Teacher can exist without Student.

This is a simple unidirectional association.

---

## Example 2: Bidirectional Association

```java
class Course {
    String courseName;
    Student student;

    Course(String courseName) {
        this.courseName = courseName;
    }

    void assignStudent(Student student) {
        this.student = student;
    }
}

class Student {
    String name;
    Course course;

    Student(String name) {
        this.name = name;
    }

    void enroll(Course course) {
        this.course = course;
        course.assignStudent(this);
    }
}
```

### Explanation

- Student references Course.
- Course references Student.
- Both objects are aware of each other.
- Still independent in lifecycle.

This is bidirectional association.

---

## Real-World Examples of Association

- Doctor treats Patient  
- Customer places Order  
- Driver drives Car  
- Author writes Book  

In all these cases:

- Both entities exist independently.
- No strong ownership exists.
- Relationship is logical, not structural.

---

## Association in UML

In UML diagrams:

- Represented by a simple solid line between classes.
- Can include multiplicity indicators:
  - 1 → One
  - * → Many

Example:

Teacher 1 ------ * Student

---

## Association vs Aggregation vs Composition

| Feature | Association | Aggregation | Composition |
|----------|------------|------------|------------|
| Ownership | No | Weak | Strong |
| Lifecycle Dependency | No | No | Yes |
| Strength | Weak | Medium | Strong |

Association is the base relationship from which aggregation and composition are derived.

---

## When to Use Association

Use association when:

- Two classes need to collaborate
- There is no ownership relationship
- Objects should remain independent
- Relationship is temporary or logical

---

## Common Mistake

Do not confuse association with composition.

If deleting one object should delete the other, it is NOT association.

Association always implies independence.

---

## Why Association Matters in LLD

Association helps in:

- Designing clean interactions
- Reducing tight coupling
- Building scalable class diagrams
- Modeling real-world systems accurately

Understanding association is essential before mastering aggregation and composition.

---

## Conclusion

Association represents a basic relationship between independent classes.

It:

- Models real-world collaboration
- Maintains object independence
- Forms the foundation for more complex relationships

Association is the starting point for understanding object relationships in Low Level Design.
