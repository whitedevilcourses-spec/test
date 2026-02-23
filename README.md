# Aggregation in Object-Oriented Programming

## Introduction

Aggregation is a special type of association in Object-Oriented Programming (OOP).

It represents a **weak "Has-A" relationship** where one class contains a reference to another class, but the contained object can exist independently of the container.

Aggregation models relationships where objects are related structurally, yet maintain independent lifecycles.

---

## Definition

Aggregation is a relationship between two classes where:

- One class contains or has another class
- Ownership exists, but it is weak
- The child object can exist independently of the parent

It is often described as a **weak Has-A relationship**.

---

## Key Characteristics

- Weak ownership
- Independent object lifecycle
- Parent contains child
- Child can exist without parent
- Represented by a hollow diamond in UML

---

## Aggregation vs Association

Aggregation is a specialized form of association.

All aggregations are associations, but not all associations are aggregations.

The key difference is structural containment.

Association → Just interaction  
Aggregation → Has-A relationship (weak ownership)

---

## Example 1: Department and Teacher

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

public class Main {
    public static void main(String[] args) {

        Teacher t1 = new Teacher("Rahul");
        Teacher t2 = new Teacher("Anita");

        List<Teacher> teacherList = List.of(t1, t2);

        Department dept = new Department("Computer Science", teacherList);

        dept.showTeachers();
    }
}
```

### Explanation

- Department "has" Teachers.
- Teachers are created outside the Department.
- If Department is deleted, Teachers still exist.
- Teachers are not owned strongly by Department.

This is aggregation.

---

## Example 2: Team and Player

```java
import java.util.List;

class Player {
    String name;

    Player(String name) {
        this.name = name;
    }
}

class Team {
    String teamName;
    List<Player> players;

    Team(String teamName, List<Player> players) {
        this.teamName = teamName;
        this.players = players;
    }

    void showPlayers() {
        for (Player p : players) {
            System.out.println(p.name);
        }
    }
}
```

### Explanation

- Team has Players.
- Players can exist independently of Team.
- If Team is dissolved, Players still exist.

This demonstrates weak ownership.

---

## Real-World Examples of Aggregation

- Department has Teachers  
- Library has Books  
- Team has Players  
- Company has Employees  

In all these cases:

- The container has members.
- Members can exist independently.
- Ownership is logical, not lifecycle-bound.

---

## Aggregation in UML

In UML diagrams:

- Represented by a hollow diamond near the container class.

Example:

Department ◇------ Teacher

The hollow diamond indicates weak ownership.

---

## Aggregation vs Composition

| Feature | Aggregation | Composition |
|----------|------------|------------|
| Ownership | Weak | Strong |
| Lifecycle Dependency | No | Yes |
| Object Creation | External | Internal |
| UML Symbol | Hollow Diamond | Filled Diamond |

If child should not exist without parent → Composition  
If child can exist independently → Aggregation  

---

## When to Use Aggregation

Use aggregation when:

- One object logically contains others
- Child objects should remain reusable
- Lifecycle independence is required
- You want structural grouping without strong ownership

---

## Common Mistake

Do not confuse aggregation with composition.

If deleting the parent should automatically destroy the child, it is NOT aggregation.

Aggregation always implies lifecycle independence.

---

## Why Aggregation Matters in LLD

Aggregation helps in:

- Modeling real-world structures
- Reducing tight coupling
- Designing reusable components
- Building scalable systems

It provides clarity in ownership without enforcing lifecycle dependency.

---

## Conclusion

Aggregation represents a weak Has-A relationship where objects are structurally related but independent in lifecycle.

It:

- Extends association
- Maintains flexibility
- Enables reusable object modeling
- Forms an important part of object-oriented design

Understanding aggregation is essential before mastering composition.
