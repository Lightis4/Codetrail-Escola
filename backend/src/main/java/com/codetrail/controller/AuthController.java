package com.codetrail.controller;
import com.codetrail.model.Student;
import com.codetrail.repository.StudentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final StudentRepository repo;private final PasswordEncoder encoder;
 public AuthController(StudentRepository repo,PasswordEncoder encoder){this.repo=repo;this.encoder=encoder;}
 public record Register(@NotBlank @Size(min=2,max=90) String name,@Email @NotBlank String email,@NotBlank @Size(min=8,max=72) String password){}
 @GetMapping("/csrf") public Map<String,String> csrf(CsrfToken token){return Map.of("token",token.getToken());}
 @PostMapping("/register") public ResponseEntity<?> register(@Valid @RequestBody Register r){
  String email=r.email().trim().toLowerCase();
  if(repo.existsByEmail(email))return ResponseEntity.status(409).body(Map.of("error","E-mail já cadastrado"));
  Student s=repo.save(new Student(r.name().trim(),email,encoder.encode(r.password())));
  return ResponseEntity.status(201).body(Map.of("id",s.id,"name",s.name));
 }
 @GetMapping("/me") public Map<String,Object> me(Authentication a){Student s=repo.findByEmail(a.getName()).orElseThrow();return Map.of("id",s.id,"name",s.name,"email",s.email,"role",s.role);}
}
