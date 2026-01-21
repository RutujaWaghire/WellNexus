# Implementation Guide - Practitioner Document Verification

## Step-by-Step Setup Instructions

### Backend Setup

1. **Create Required Directories**:
   ```bash
   mkdir -p uploads/documents
   ```

2. **Database Migration**:
   - The entity `PractitionerDocument` will auto-create the table via Hibernate DDL
   - Ensure `spring.jpa.hibernate.ddl-auto=update` is set in application.properties

3. **Rebuild Backend**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Update Dependencies** (if needed):
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

### Testing the Feature

#### Test 1: Practitioner Registration with Document

1. Go to Register page
2. Select "Practitioner" role
3. Fill in details:
   - Name: "Dr. John Doe"
   - Email: "doctor@example.com"
   - Password: "SecurePass123!"
   - Bio: "Experienced yoga therapist"
4. In "Verification Documents" section:
   - Select "Professional License"
   - Upload a PDF file
5. Scroll down and accept Terms & Conditions
6. Click "Create Account"
7. Verify:
   - Account created successfully
   - Redirected to dashboard
   - Document saved to `uploads/documents/`

#### Test 2: Admin Verification

1. Create admin account (manually update user role in database)
2. Login as admin
3. Go to "Verify Practitioners"
4. Should see recently registered practitioner
5. Click to expand
6. Should see:
   - Uploaded document details
   - Download button
7. Click "Download" button
8. File should download with original name
9. Select specialization and rating
10. Click "Verify Practitioner"
11. Verify:
    - Practitioner removed from list
    - Practitioner profile created
    - Success message displayed

### Key Files Modified/Created

**Backend**:
- ✅ `model/PractitionerDocument.java` (NEW)
- ✅ `repository/PractitionerDocumentRepository.java` (NEW)
- ✅ `service/PractitionerDocumentService.java` (NEW)
- ✅ `controller/PractitionerDocumentController.java` (NEW)
- ✅ `controller/AuthController.java` (MODIFIED)
- ✅ `service/AuthService.java` (MODIFIED)
- ✅ `dto/RegisterRequest.java` (MODIFIED)
- ✅ `dto/UnverifiedPractitionerWithDocumentsDTO.java` (NEW)
- ✅ `application.properties` (MODIFIED)

**Frontend**:
- ✅ `pages/Register.jsx` (MODIFIED)
- ✅ `pages/AdminVerifyPractitioners.jsx` (MODIFIED)
- ✅ `services/api.js` (MODIFIED)

### API Endpoints Summary

#### Registration
```
POST /api/auth/register
Content-Type: multipart/form-data

Parameters:
- name: string
- email: string
- password: string
- role: "patient" | "practitioner"
- bio: string (optional)
- documentType: string (for practitioners) - "License", "Certification", "Degree", "Insurance", "Other"
- documentFile: file (for practitioners) - PDF, JPG, PNG, DOC, DOCX, max 10MB
```

#### Document Management
```
POST /api/documents/upload
GET /api/documents/{documentId}
GET /api/documents/user/{userId}
GET /api/documents/pending
GET /api/documents/download/{documentId}
PUT /api/documents/{documentId}/approve
PUT /api/documents/{documentId}/reject?rejectionReason=...
DELETE /api/documents/{documentId}
```

### Troubleshooting

#### Issue: "Failed to upload document"
- **Solution**: Check uploads/documents directory permissions
- Ensure Spring config `file.upload-dir` is correct

#### Issue: "File not found when downloading"
- **Solution**: Verify file path is correct in database
- Check file actually exists on disk

#### Issue: Admin can't see documents
- **Solution**: Ensure documents were uploaded during registration
- Check practitioner_documents table in database
- Verify user_id matches

#### Issue: Registration fails with multipart error
- **Solution**: Update api.js to use FormData (already done)
- Check Content-Type header is not forced to application/json

### Performance Considerations

1. **File Storage**: Files stored locally; consider cloud storage (S3, GCS) for production
2. **File Download**: Large files streamed efficiently via byte arrays
3. **Database Queries**: Add indexes on user_id and status for faster lookups

### Security Notes

1. File uploads are validated by:
   - File type whitelist
   - File size limit
   - UUID filename generation

2. Recommended additional measures:
   - Add virus scanning for uploaded files
   - Implement rate limiting on upload endpoint
   - Add authentication checks on document endpoints
   - Encrypt files at rest
   - Add audit logging for document access

### Next Steps (Optional Enhancements)

1. Add reject document functionality
2. Implement document preview (PDF viewer)
3. Add automatic email notifications
4. Create document expiration system
5. Add document versioning
6. Implement cloud storage
7. Add batch operations for admin
