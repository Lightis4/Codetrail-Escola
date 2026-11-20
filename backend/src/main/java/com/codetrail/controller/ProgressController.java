package com.codetrail.controller;
import com.codetrail.model.*;
import com.codetrail.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.*;
@RestController @RequestMapping("/api/progress")
public class ProgressController {
 private final StudentRepository students;private final CompletionRepository completions;private final JsonNode tracks;
 public ProgressController(StudentRepository s,CompletionRepository c,ObjectMapper mapper)throws IOException{
  students=s;completions=c;
  try(var stream=new ClassPathResource("data/trilhas.json").getInputStream()){tracks=mapper.readTree(stream);}
 }
 private Student student(Authentication a){return students.findByEmail(a.getName()).orElseThrow();}
 @GetMapping public List<String> all(Authentication a){return completions.findByStudentId(student(a).id).stream().map(c->c.lessonId).toList();}
 public record Answer(String lessonId, int questionIndex, int option){}
 @PostMapping("/answer") public ResponseEntity<?> answer(@RequestBody Answer answer,Authentication a){
  if(answer.lessonId()==null)return ResponseEntity.badRequest().body(Map.of("error","Aula obrigatória"));
  for(JsonNode t:tracks)for(JsonNode m:t.path("modulos"))for(JsonNode l:m.path("aulas")){
   if(l.path("id").asText().equals(answer.lessonId())){
    JsonNode questions = l.path("exercicios");
    if (answer.questionIndex() < 0 || answer.questionIndex() >= questions.size()) {
     return ResponseEntity.badRequest().body(Map.of("error", "Questão inválida"));
    }
    JsonNode q = questions.get(answer.questionIndex());
    boolean correct = q.path("resposta").asInt(-1) == answer.option();
    if (correct && answer.questionIndex() == questions.size() - 1) {Student s=student(a);if(!completions.existsByStudentIdAndLessonId(s.id,answer.lessonId()))completions.save(new Completion(s,answer.lessonId()));}
    return ResponseEntity.ok(Map.of("correct",correct));
   }
  }
  return ResponseEntity.status(404).body(Map.of("error","Aula não encontrada"));
 }
}
