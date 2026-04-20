package lk.ijse.back_end.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.back_end.repository.VendorRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class VendorServiceImpl implements VendorService {

    @Autowired
    private VendorRepository vendorRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public VendorDTO saveVendor(VendorDTO dto) {
        Vendor vendor = modelMapper.map(dto, Vendor.class);
        return modelMapper.map(vendorRepository.save(vendor), VendorDTO.class);
    }

    @Override
    public List<VendorDTO> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(v -> modelMapper.map(v, VendorDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<VendorDTO> getVendorsByType(String type) {
        return vendorRepository.findByType(type).stream()
                .map(v -> modelMapper.map(v, VendorDTO.class)).collect(Collectors.toList());
    }
}
