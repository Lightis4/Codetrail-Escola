package com.codetrail.repository;
import com.codetrail.model.Completion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CompletionRepository extends JpaRepository<Completion,Long> {
 List<Completion> findByStudentId(Long studentId);
 boolean existsByStudentIdAndLessonId(Long studentId,String lessonId);
}
