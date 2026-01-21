package com.wellness.marketplace.controller;

import com.wellness.marketplace.model.PractitionerDocument;
import com.wellness.marketplace.service.PractitionerDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
//@CrossOrigin(origins = "*")
public class PractitionerDocumentController {
    
    @Autowired
    private PractitionerDocumentService documentService;
    
    @PostMapping("/upload")
    public ResponseEntity<PractitionerDocument> uploadDocument(
            @RequestParam Long userId,
            @RequestParam String documentType,
            @RequestParam MultipartFile file) {
        try {
            PractitionerDocument document = documentService.uploadDocument(userId, documentType, file);
            return ResponseEntity.ok(document);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @GetMapping("/{documentId}")
    public ResponseEntity<PractitionerDocument> getDocument(@PathVariable Long documentId) {
        try {
            PractitionerDocument document = documentService.getDocumentById(documentId);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PractitionerDocument>> getUserDocuments(@PathVariable Long userId) {
        List<PractitionerDocument> documents = documentService.getDocumentsByUserId(userId);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<PractitionerDocument>> getPendingDocuments() {
        List<PractitionerDocument> documents = documentService.getPendingDocuments();
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
        try {
            PractitionerDocument document = documentService.getDocumentById(documentId);
            byte[] fileContent = documentService.downloadDocument(documentId);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + document.getDocumentName() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, document.getFileType())
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("/{documentId}/approve")
    public ResponseEntity<PractitionerDocument> approveDocument(@PathVariable Long documentId) {
        try {
            PractitionerDocument document = documentService.approveDocument(documentId);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("/{documentId}/reject")
    public ResponseEntity<PractitionerDocument> rejectDocument(
            @PathVariable Long documentId,
            @RequestParam String rejectionReason) {
        try {
            PractitionerDocument document = documentService.rejectDocument(documentId, rejectionReason);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
