package com.wellness.marketplace.service;

import com.wellness.marketplace.model.PractitionerDocument;
import com.wellness.marketplace.repository.PractitionerDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PractitionerDocumentService {

    @Value("${file.upload-dir:uploads/documents}")
    private String uploadDir;

    @Autowired
    private PractitionerDocumentRepository documentRepository;

    public PractitionerDocument uploadDocument(Long userId, String documentType, MultipartFile file) throws IOException {
        // Validate file
        validateFile(file);

        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? 
            originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        String filePath = uploadDir + File.separator + uniqueFilename;

        // Save file to disk
        Path targetPath = Paths.get(filePath);
        file.transferTo(targetPath.toFile());

        // Create document record
        PractitionerDocument document = new PractitionerDocument();
        document.setUserId(userId);
        document.setDocumentType(documentType);
        document.setDocumentName(originalFilename != null ? originalFilename : "document");
        document.setDocumentPath(filePath);
        document.setFileType(file.getContentType());
        document.setFileSize(file.getSize());
        document.setStatus("PENDING");
        document.setUploadedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    public PractitionerDocument getDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public List<PractitionerDocument> getDocumentsByUserId(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    public List<PractitionerDocument> getPendingDocuments() {
        return documentRepository.findByStatus("PENDING");
    }

    public PractitionerDocument approveDocument(Long documentId) {
        PractitionerDocument document = getDocumentById(documentId);
        document.setStatus("APPROVED");
        document.setVerifiedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }

    public PractitionerDocument rejectDocument(Long documentId, String rejectionReason) {
        PractitionerDocument document = getDocumentById(documentId);
        document.setStatus("REJECTED");
        document.setRejectionReason(rejectionReason);
        document.setVerifiedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }

    public byte[] downloadDocument(Long documentId) throws IOException {
        PractitionerDocument document = getDocumentById(documentId);
        Path filePath = Paths.get(document.getDocumentPath());
        
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found");
        }
        
        return Files.readAllBytes(filePath);
    }

    public void deleteDocument(Long documentId) throws IOException {
        PractitionerDocument document = getDocumentById(documentId);
        Path filePath = Paths.get(document.getDocumentPath());
        
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        documentRepository.deleteById(documentId);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }

        String[] allowedExtensions = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"};
        String filename = file.getOriginalFilename();
        boolean isAllowed = false;

        if (filename != null) {
            for (String ext : allowedExtensions) {
                if (filename.toLowerCase().endsWith(ext)) {
                    isAllowed = true;
                    break;
                }
            }
        }

        if (!isAllowed) {
            throw new RuntimeException("File type not allowed. Allowed types: PDF, JPG, PNG, DOC, DOCX");
        }
    }
}
