package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.VendorDTO;
import java.util.List;

public interface VendorService {
    VendorDTO saveVendor(VendorDTO vendorDTO);
    List<VendorDTO> getAllVendors();
    List<VendorDTO> getVendorsByType(String type);
    void deleteVendor(Long id);
}