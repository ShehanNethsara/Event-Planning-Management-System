package lk.ijse.back_end.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private static final List<Map<String, String>> categories = new ArrayList<>(Arrays.asList(
        new HashMap<>(Map.of("id", "1", "name", "WEDDING", "description", "Marriage ceremonies and receptions")),
        new HashMap<>(Map.of("id", "2", "name", "BIRTHDAY", "description", "Birthday parties and celebrations")),
        new HashMap<>(Map.of("id", "3", "name", "CORPORATE", "description", "Business events and conferences")),
        new HashMap<>(Map.of("id", "4", "name", "CONCERT", "description", "Music events and shows"))
    ));
    private static long nextId = 5;

    @GetMapping("/all")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveCategory(@RequestBody Map<String, String> payload) {
        Map<String, String> newCat = new HashMap<>();
        newCat.put("id", String.valueOf(nextId++));
        newCat.put("name", payload.getOrDefault("name", "NEW"));
        newCat.put("description", payload.getOrDefault("description", "General Service"));
        categories.add(newCat);
        return ResponseEntity.ok(newCat);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        boolean removed = categories.removeIf(c -> c.get("id").equals(id));
        if (removed) return ResponseEntity.ok("Category deleted!");
        return ResponseEntity.status(404).body("Category not found!");
    }
}
