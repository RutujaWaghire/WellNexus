# Practitioner Document Verification System - Architecture Overview

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  PRACTITIONER REGISTRATION FLOW                 │
└─────────────────────────────────────────────────────────────────┘

1. USER REGISTRATION PAGE
   ├─ Personal Details (Name, Email, Password)
   ├─ Bio (Optional)
   ├─ Terms & Conditions Modal
   │  └─ Professional Standards
   │  └─ Document Requirements
   │  └─ Liability Disclaimer
   │  └─ Accept/Reject
   └─ Document Upload (For Practitioners)
      ├─ Document Type Selector
      └─ File Upload

         │
         │ FormData (multipart/form-data)
         ↓

2. BACKEND - AUTH CONTROLLER
   ├─ Receives multipart request
   ├─ Validates file
   ├─ Creates User record
   └─ Calls AuthService

         │
         ↓

3. BACKEND - AUTH SERVICE
   ├─ Creates User in DB
   ├─ Checks if Practitioner
   ├─ Calls DocumentService
   ├─ Generates JWT token
   └─ Returns AuthResponse

         │
         ↓

4. BACKEND - DOCUMENT SERVICE
   ├─ Validates file (type, size)
   ├─ Generates unique filename (UUID)
   ├─ Saves file to: uploads/documents/
   ├─ Creates PractitionerDocument record
   │  ├─ userId
   │  ├─ documentPath
   │  ├─ documentType
   │  ├─ status: PENDING
   │  └─ uploadedAt
   └─ Returns Document entity

         │
         │ Response with token
         ↓

5. FRONTEND RECEIVES
   ├─ Auth token
   ├─ User info
   └─ Redirect to Dashboard

═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN VERIFICATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. ADMIN DASHBOARD
   └─ "Verify Practitioners" Link

         │
         ↓

2. GET UNVERIFIED PRACTITIONERS
   ├─ Query: All users with role='practitioner' without profile
   └─ Response: List of unverified practitioners

         │
         ↓

3. FETCH DOCUMENTS FOR EACH PRACTITIONER
   ├─ For each unverified practitioner
   ├─ GET /api/documents/user/{userId}
   └─ Response: Array of documents with status

         │
         ↓

4. DISPLAY UNVERIFIED LIST
   ├─ Name, Email, Bio
   ├─ Expandable card
   └─ Expand to see details

         │
         ↓

5. ADMIN CLICKS EXPAND
   ├─ Shows document section
   │  ├─ Document Name
   │  ├─ Type (License, Certification, etc.)
   │  ├─ Size & Upload Date
   │  ├─ Status (PENDING, APPROVED, REJECTED)
   │  └─ DOWNLOAD BUTTON
   │
   ├─ Specialization selector
   ├─ Rating input (0-5)
   └─ Verify/Cancel buttons

         │
         ↓

6. ADMIN DOWNLOADS DOCUMENT
   ├─ Click Download button
   ├─ GET /api/documents/download/{documentId}
   ├─ Browser downloads file
   └─ Admin reviews externally

         │ (Manual review)
         ↓

7. ADMIN VERIFIES PRACTITIONER
   ├─ Selects specialization
   ├─ Sets rating
   ├─ Clicks "Verify Practitioner"
   └─ POST /api/practitioners/admin/verify

         │
         ↓

8. BACKEND - VERIFY PRACTITIONER
   ├─ Validates request
   ├─ Creates PractitionerProfile
   │  ├─ userId
   │  ├─ specialization
   │  ├─ rating
   │  └─ verified: true
   ├─ Updates User status
   └─ Returns success

         │
         ↓

9. ADMIN UI UPDATES
   ├─ Removes practitioner from list
   ├─ Shows success message
   └─ List refreshes automatically

═══════════════════════════════════════════════════════════════════
```

## Database Schema

```
┌──────────────────────────────────┐
│          users TABLE             │
├──────────────────────────────────┤
│ id (PK)                          │
│ name                             │
│ email (UNIQUE)                   │
│ password                         │
│ role (patient/practitioner/admin)│
│ bio                              │
│ accountStatus (PENDING/APPROVED) │
│ verified (boolean)               │
│ createdAt                        │
└────────────┬─────────────────────┘
             │ 1:N
             │ userId
             │
┌────────────▼──────────────────────────────┐
│   practitioner_documents TABLE            │
├───────────────────────────────────────────┤
│ id (PK)                                   │
│ userId (FK to users.id)                   │
│ documentName                              │
│ documentPath (file system location)       │
│ documentType (License/Certification/etc)  │
│ fileType (MIME type)                      │
│ fileSize                                  │
│ uploadedAt                                │
│ verifiedAt                                │
│ status (PENDING/APPROVED/REJECTED)        │
│ rejectionReason                           │
└───────────────────────────────────────────┘

┌──────────────────────────────────┐
│ practitioner_profiles TABLE      │
├──────────────────────────────────┤
│ id (PK)                          │
│ userId (FK to users.id)          │
│ specialization                   │
│ verified (boolean)               │
│ rating                           │
│ consultationFee                  │
└──────────────────────────────────┘
```

## File System Structure

```
project-root/
├── uploads/
│   └── documents/
│       ├── 550e8400-e29b-41d4-a716-446655440000.pdf
│       ├── 6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg
│       └── 6ba7b811-9dad-11d1-80b4-00c04fd430c9.docx
│
├── backend/
│   ├── src/main/java/com/wellness/marketplace/
│   │   ├── controller/
│   │   │   ├── AuthController.java (MODIFIED)
│   │   │   ├── PractitionerController.java
│   │   │   └── PractitionerDocumentController.java (NEW)
│   │   │
│   │   ├── service/
│   │   │   ├── AuthService.java (MODIFIED)
│   │   │   ├── PractitionerService.java
│   │   │   └── PractitionerDocumentService.java (NEW)
│   │   │
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── PractitionerProfile.java
│   │   │   └── PractitionerDocument.java (NEW)
│   │   │
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── PractitionerProfileRepository.java
│   │   │   └── PractitionerDocumentRepository.java (NEW)
│   │   │
│   │   └── dto/
│   │       ├── RegisterRequest.java (MODIFIED)
│   │       └── UnverifiedPractitionerWithDocumentsDTO.java (NEW)
│   │
│   └── resources/
│       └── application.properties (MODIFIED)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Register.jsx (MODIFIED)
        │   └── AdminVerifyPractitioners.jsx (MODIFIED)
        │
        └── services/
            └── api.js (MODIFIED)
```

## Key Features

### 🔐 Registration Process
- Practitioners upload documents during registration
- Terms & Conditions modal with comprehensive policies
- Mandatory terms acceptance
- Real-time file validation (type, size)
- Visual feedback on file selection

### 📄 Document Management
- Support for multiple file types (PDF, JPG, PNG, DOC, DOCX)
- Max 10MB file size
- Unique filename generation (prevents conflicts)
- Original filename preservation
- MIME type tracking

### ✅ Admin Verification
- View all unverified practitioners
- Download documents for manual review
- Easy-to-use expandable cards
- Set specialization and rating
- One-click verification

### 🔄 Status Tracking
- PENDING: Newly uploaded
- APPROVED: Verified by admin
- REJECTED: Not acceptable (with optional reason)

## Security Features

### File Security
- Whitelist of allowed file types
- File size limit enforcement
- UUID-based naming (prevents path traversal)
- Server-side validation

### Access Control
- Only admins can verify documents
- Users can only access own documents (recommended)
- JWT authentication on all endpoints

### Data Protection
- File paths not exposed to frontend
- Download requires authentication
- Original filenames preserved safely

## API Reference

### Authentication
```
POST /api/auth/register
Content-Type: multipart/form-data

Body:
  name: "Dr. John Doe"
  email: "doctor@example.com"
  password: "SecurePass123!"
  role: "practitioner"
  bio: "Experienced therapist"
  documentType: "License"
  documentFile: <binary>
```

### Document Operations
```
GET    /api/documents/user/{userId}
GET    /api/documents/pending
GET    /api/documents/download/{documentId}
PUT    /api/documents/{documentId}/approve
PUT    /api/documents/{documentId}/reject?rejectionReason=...
DELETE /api/documents/{documentId}
```

## Statistics

- **New Files Created**: 4
- **Files Modified**: 6
- **New Controllers**: 1
- **New Services**: 1
- **New Repositories**: 1
- **New Entities**: 1
- **New DTOs**: 1
- **Frontend Components Updated**: 2
- **Lines of Code Added**: ~2000+

## Deployment Checklist

- [ ] Create `uploads/documents/` directory with proper permissions
- [ ] Set `file.upload-dir` in application.properties
- [ ] Run database migrations
- [ ] Test registration with document upload
- [ ] Test admin verification flow
- [ ] Verify file storage and retrieval
- [ ] Test document download
- [ ] Configure CORS if needed
- [ ] Set up file cleanup policies
- [ ] Monitor disk space usage

## Future Enhancements

1. **Document Versioning**: Allow practitioners to reupload documents
2. **Email Notifications**: Auto-notify on approval/rejection
3. **Document Preview**: In-browser preview for PDFs/images
4. **Expiration Dates**: Auto-expire verification documents
5. **Cloud Storage**: Migrate to S3/GCS for scalability
6. **Virus Scanning**: Integrate with antivirus service
7. **Batch Operations**: Admin bulk approval/rejection
8. **Audit Logging**: Track all document access/modifications
