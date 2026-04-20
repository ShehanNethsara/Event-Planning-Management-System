package lk.ijse.back_end.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vendors")
@CrossOrigin
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @GetMapping("/all")
    public ResponseEntity<List<VendorDTO>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @PostMapping("/add")
    public ResponseEntity<VendorDTO> addVendor(@RequestBody VendorDTO vendorDTO) {
        return ResponseEntity.ok(vendorService.saveVendor(vendorDTO));
    }

    @GetMapping("/category/{type}")
    public ResponseEntity<List<VendorDTO>> getVendorsByType(@PathVariable String type) {
        return ResponseEntity.ok(vendorService.getVendorsByType(type));
    }
}