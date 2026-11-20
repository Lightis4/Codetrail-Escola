package com.codetrail.config;
import com.codetrail.repository.StudentRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean UserDetailsService users(StudentRepository repo){return email->{var s=repo.findByEmail(email.toLowerCase()).orElseThrow(()->new UsernameNotFoundException("Usuário não encontrado"));return User.withUsername(s.email).password(s.passwordHash).roles(s.role).build();};}
 @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
  var csrf=new CookieCsrfTokenRepository();csrf.setCookieCustomizer(c->c.httpOnly(false).path("/").sameSite("Lax"));
  var handler=new CsrfTokenRequestAttributeHandler();handler.setCsrfRequestAttributeName(null);
  http.csrf(c->c.csrfTokenRepository(csrf).csrfTokenRequestHandler(handler))
    .authorizeHttpRequests(a->a.requestMatchers("/","/index.html","/css/**","/js/**","/api/health","/api/trilhas/**","/api/auth/csrf","/api/auth/register").permitAll().anyRequest().authenticated())
    .formLogin(f->f.loginProcessingUrl("/api/auth/login").successHandler((req,res,auth)->{res.setContentType("application/json;charset=UTF-8");res.getWriter().write("{\"ok\":true}");}).failureHandler((req,res,ex)->res.sendError(401,"Credenciais inválidas")))
    .logout(l->l.logoutUrl("/api/auth/logout").logoutSuccessHandler((req,res,auth)->{res.setStatus(204);}));
  return http.build();
 }
}
