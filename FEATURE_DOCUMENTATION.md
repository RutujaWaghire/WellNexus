# WellNexus - Practitioner Document Verification Feature

## Summary of Changes

This implementation adds a comprehensive document verification system for practitioners during registration and admin verification.

---

## Backend Changes

### 1. **New Entity: PractitionerDocument**
**File**: `backend/src/main/java/com/wellness/marketplace/model/PractitionerDocument.java`

- Stores practitioner verification documents
- Fields: userId, documentName, documentPath, documentType, fileType, fileSize, uploadedAt, verifiedAt, status, rejectionReason
- Status values: PENDING, APPROVED, REJECTED

### 2. **New Repository: PractitionerDocumentRepository**
**File**: `backend/src/main/java/com/wellness/marketplace/repository/PractitionerDocumentRepository.java`

- JPA repository for CRUD operations on practitioner documents
- Methods: findByUserId, findByStatus, findByUserIdAndStatus

### 3. **New Service: PractitionerDocumentService**
**File**: `backend/src/main/java/com/wellness/marketplace/service/PractitionerDocumentService.java`

Key Features:
- `uploadDocument()`: Handles file upload with validation (type, size)
- `getDocumentById()`: Retrieve specific document
- `getDocumentsByUserId()`: Get all documents for a practitioner
- `getPendingDocuments()`: Get all unverified documents
- `approveDocument()`: Mark document as approved
- `rejectDocument()`: Mark document as rejected with reason
- `downloadDocument()`: Get file bytes for download
- `deleteDocument()`: Remove document and file

File Validation:
- Allowed types: PDF, JPG, PNG, DOC, DOCX
- Max size: 10MB
- Files stored in `uploads/documents/` directory

### 4. **New Controller: PractitionerDocumentController**
**File**: `backend/src/main/java/com/wellness/marketplace/controller/PractitionerDocumentController.java`

Endpoints:
- `POST /api/documents/upload`: Upload new document
- `GET /api/documents/{documentId}`: Get document details
- `GET /api/documents/user/{userId}`: Get all documents for user
- `GET /api/documents/pending`: Get all pending documents
- `GET /api/documents/download/{documentId}`: Download document file
- `PUT /api/documents/{documentId}/approve`: Approve document
- `PUT /api/documents/{documentId}/reject`: Reject document
- `DELETE /api/documents/{documentId}`: Delete document

### 5. **Updated: AuthController**
**File**: `backend/src/main/java/com/wellness/marketplace/controller/AuthController.java`

- Changed from `@RequestBody` to `@RequestParam` to support multipart/form-data
- Now accepts optional `documentType` and `documentFile` for practitioners

### 6. **Updated: AuthService**
**File**: `backend/src/main/java/com/wellness/marketplace/service/AuthService.java`

- Modified `register()` method to accept `MultipartFile` parameter
- Automatically uploads document if practitioner provides one
- Integrates with `PractitionerDocumentService`

### 7. **Updated: RegisterRequest DTO**
**File**: `backend/src/main/java/com/wellness/marketplace/dto/RegisterRequest.java`

- Added `documentType` field
- Added `documentName` field

### 8. **New DTO: UnverifiedPractitionerWithDocumentsDTO**
**File**: `backend/src/main/java/com/wellness/marketplace/dto/UnverifiedPractitionerWithDocumentsDTO.java`

- Contains practitioner info and associated documents
- Used for admin verification page

### 9. **Updated: application.properties**
**File**: `backend/src/main/resources/application.properties`

- Added `file.upload-dir=uploads/documents` configuration

---

## Frontend Changes

### 1. **Updated: Register.jsx Page**
**File**: `frontend/src/pages/Register.jsx`

New Features for Practitioners:
- **Terms & Conditions Modal**: 
  - Detailed terms displayed in scrollable modal
  - Checkbox to accept before registration
  - Covers professional standards, document verification, liability, etc.

- **Document Upload Section** (shows for practitioners only):
  - Document type selector (License, Certification, Degree, Insurance, Other)
  - File upload input with validation
  - File type restrictions: PDF, JPG, PNG, DOC, DOCX
  - Max file size: 10MB
  - Selected file feedback

- **Form Submission Updates**:
  - Validates terms acceptance
  - Validates document upload for practitioners
  - Uses FormData for multipart submission
  - Handles file upload to backend

### 2. **Updated: AdminVerifyPractitioners.jsx Page**
**File**: `frontend/src/pages/AdminVerifyPractitioners.jsx`

New Features:
- **Document Display Section**:
  - Shows all documents uploaded by practitioner
  - Displays: document name, type, size, status, upload date
  - Color-coded status (PENDING: yellow, APPROVED: green, REJECTED: red)

- **Document Download**:
  - Download button for each document
  - File downloaded to local machine with original filename
  - Error handling for failed downloads

- **Auto-fetching Documents**:
  - Automatically fetches documents when loading unverified practitioners
  - Documents displayed when admin expands a practitioner

### 3. **Updated: api.js Service**
**File**: `frontend/src/services/api.js`

- Updated `authService.register()` to handle FormData
- Automatically detects FormData and uses multipart/form-data header
- Maintains backward compatibility with JSON registration (for patients)

---

## User Workflows

### Practitioner Registration Flow:

1. Practitioner selects "Practitioner" role
2. Fills in personal details (name, email, password)
3. Optionally adds bio
4. **Sees "Verification Documents" section**:
   - Selects document type from dropdown
   - Uploads relevant document
   - Gets confirmation of file selection
5. **Reviews and accepts Terms & Conditions**:
   - Clicks link to read full terms modal
   - Reviews professional standards, document requirements, liability
   - Clicks "I Accept" to accept terms
6. Clicks "Create Account"
7. Document is uploaded with registration
8. Account created with status "PENDING"

### Admin Verification Flow:

1. Admin logs in and navigates to "Verify Practitioners" section
2. **Sees list of unverified practitioners**
3. **Clicks on a practitioner to expand details**
4. **Views uploaded documents**:
   - Document name, type, size
   - Upload date
   - Status (PENDING)
   - Download button
5. **Downloads document** to verify credentials
6. Reviews documents and decides to approve/reject
7. **If approved**:
   - Selects specialization from dropdown
   - Sets initial rating (0-5)
   - Clicks "Verify Practitioner"
   - Practitioner is approved and profile created
8. **If rejected**:
   - Would use reject endpoint (can be added)

---

## Database Schema

### practitioner_documents table
```sql
CREATE TABLE practitioner_documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_path VARCHAR(500) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## File Storage

- Documents stored in: `uploads/documents/` directory
- Files renamed with UUID to prevent conflicts
- Original filename preserved in database
- File path and MIME type stored for download

---

## Security Considerations

1. **File Validation**:
   - Whitelist of allowed file types
   - Max file size limit (10MB)
   - UUID naming prevents path traversal

2. **Access Control**:
   - Document endpoints should be protected with role-based auth
   - Only admins can approve/reject
   - Users can only see their own documents

3. **Terms & Conditions**:
   - Mandatory acceptance for all users
   - Enforced on frontend and recommended on backend

---

## Testing Checklist

- [ ] Practitioner can register with document upload
- [ ] Document appears in admin verification page
- [ ] Admin can download document
- [ ] Admin can verify practitioner
- [ ] File size validation works
- [ ] File type validation works
- [ ] Terms acceptance required
- [ ] Documents properly saved to disk
- [ ] File permissions are secure

---

## Future Enhancements

1. Add document reject functionality with rejection reason
2. Add document expiration dates
3. Implement document versioning (practitioner can reupload)
4. Add admin comments on documents
5. Email notifications for document status changes
6. Document preview functionality for PDFs/images
7. Bulk document approval/rejection
8. Document audit trail
