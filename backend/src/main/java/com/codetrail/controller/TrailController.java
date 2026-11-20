package com.codetrail.controller;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@RestController
@RequestMapping("/api")
public class TrailController {
    private final JsonNode trilhas;
    public TrailController(ObjectMapper mapper) throws IOException {
        try (var stream = new ClassPathResource("data/trilhas.json").getInputStream()) {
            trilhas = mapper.readTree(stream);
        }
    }
    @GetMapping("/health")
    public String health() { return "CodeTrail OK"; }
    @GetMapping("/trilhas")
    public List<JsonNode> listar() {
        List<JsonNode> resultado = new ArrayList<>();
        trilhas.forEach(track -> resultado.add(publicTrack(track)));
        return resultado;
    }
    private JsonNode publicTrack(JsonNode track) {
        JsonNode copy=track.deepCopy();
        for(JsonNode module:copy.path("modulos"))for(JsonNode lesson:module.path("aulas"))
            for(JsonNode question:lesson.path("exercicios"))((com.fasterxml.jackson.databind.node.ObjectNode)question).remove("resposta");
        return copy;
    }
    @GetMapping("/trilhas/{slug}")
    public JsonNode buscar(@PathVariable String slug) {
        for (JsonNode trilha : trilhas)
            if (trilha.path("slug").asText().equals(slug)) return publicTrack(trilha);
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Trilha nao encontrada");
    }
}
