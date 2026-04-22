package lk.ijse.back_end.controller;

// සටහන: ඔයාට Category සඳහා වෙනම Service එකක් නැති නිසා,
// මම දැනට සරලව static ලිස්ට් එකක් හෝ පවතින දත්ත එවන විදිහට මේක හදන්නම්.
// ඔයාට Category Entity එකක් තියෙනවා නම් ඒක පාවිච්චි කරන්න.

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @GetMapping("/all")
    public ResponseEntity<?> getAllCategories() {
        // දැනට පරීක්ෂා කිරීමට sample දත්ත කිහිපයක් යවමු
        List<Map<String, String>> categories = new ArrayList<>();

        Map<String, String> c1 = new HashMap<>();
        c1.put("id", "1");
        c1.put("name", "WEDDING");
        c1.put("description", "Marriage ceremonies and receptions");

        Map<String, String> c2 = new HashMap<>();
        c2.put("id", "2");
        c2.put("name", "BIRTHDAY");
        c2.put("description", "Birthday parties and celebrations");

        categories.add(c1);
        categories.add(c2);

        return ResponseEntity.ok(categories);
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveCategory(@RequestBody Map<String, String> payload) {
        // අලුත් Category එකක් save කරන logic එක (දැනට success පණිවිඩයක් පමණයි)
        return ResponseEntity.ok("Category Saved Successfully!");
    }
}