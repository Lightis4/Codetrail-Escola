package com.codetrail.model;
import jakarta.persistence.*;
@Entity @Table(name="completions",uniqueConstraints=@UniqueConstraint(columnNames={"student_id","lessonId"}))
public class Completion {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false) @JoinColumn(name="student_id") public Student student;
 @Column(nullable=false) public String lessonId;
 protected Completion() {}
 public Completion(Student student,String lessonId){this.student=student;this.lessonId=lessonId;}
}
