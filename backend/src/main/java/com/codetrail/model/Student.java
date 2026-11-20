package com.codetrail.model;
import jakarta.persistence.*;
@Entity @Table(name="students",uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class Student {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,length=90) public String name;
 @Column(nullable=false,length=190) public String email;
 @Column(nullable=false) public String passwordHash;
 @Column(nullable=false) public String role="STUDENT";
 protected Student() {}
 public Student(String name,String email,String hash){this.name=name;this.email=email;this.passwordHash=hash;}
}
