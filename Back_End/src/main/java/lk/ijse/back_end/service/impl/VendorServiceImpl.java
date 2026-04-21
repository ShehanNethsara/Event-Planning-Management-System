package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.VendorDTO;
import lk.ijse.back_end.entity.Vendor;
import lk.ijse.back_end.repository.VendorRepository;
import lk.ijse.back_end.service.VendorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VendorServiceImpl implements VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public VendorDTO saveVendor(VendorDTO vendorDTO) {
        Vendor vendor = modelMapper.map(vendorDTO, Vendor.class);
        return modelMapper.map(vendorRepository.save(vendor), VendorDTO.class);
    }

    @Override
    public List<VendorDTO> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(v -> modelMapper.map(v, VendorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<VendorDTO> getVendorsByType(String type) {
        return vendorRepository.findByType(type).stream()
                .map(v -> modelMapper.map(v, VendorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteVendor(Long id) {
        vendorRepository.deleteById(id);
    }
}