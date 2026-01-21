# Quick Reference - Practitioner Document Verification

## What Was Added

### ✨ Practitioner Registration Page
```
Practitioner Role Selected
    ↓
Shows "Verification Documents" Section
    ├─ Document Type Dropdown
    │  └─ License, Certification, Degree, Insurance, Other
    ├─ File Upload Input
    │  └─ Accepts: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
    └─ File Preview
```

### ✨ Terms & Conditions Modal
```
- Comprehensive terms for practitioners
- Coverage: Professional standards, document requirements, liability
- Mandatory acceptance checkbox
- Accessible via link during registration
- Must accept to complete registration
```

### ✨ Admin Verification Interface
```
Unverified Practitioners List
    ├─ Practitioner Card (Expandable)
    │  ├─ Name, Email, Bio
    │  └─ Expand Button
    │
    └─ Expanded View
       ├─ Documents Section
       │  ├─ Document Name
       │  ├─ Type & Size
       │  ├─ Status Badge
       │  └─ Download Button ← NEW
       │
       ├─ Specialization Selector
       ├─ Rating Input
       └─ Verify/Cancel Buttons
```

### ✨ Document Download
```
Click Download Button
    ↓
Backend generates file stream
    ↓
Browser downloads with original filename
```

---

## Files Changed

### Backend (Java)
| File | Change | Type |
|------|--------|------|
| `PractitionerDocument.java` | New entity for documents | CREATE |
| `PractitionerDocumentRepository.java` | Database queries | CREATE |
| `PractitionerDocumentService.java` | File handling logic | CREATE |
| `PractitionerDocumentController.java` | REST endpoints | CREATE |
| `AuthController.java` | Accept multipart data | MODIFY |
| `AuthService.java` | Call document service | MODIFY |
| `RegisterRequest.java` | Add document fields | MODIFY |
| `UnverifiedPractitionerWithDocumentsDTO.java` | DTO for admin view | CREATE |
| `application.properties` | Add upload directory | MODIFY |

### Frontend (React)
| File | Change |
|------|--------|
| `Register.jsx` | Terms modal + document upload |
| `AdminVerifyPractitioners.jsx` | Document display + download |
| `api.js` | Support FormData for multipart |

---

## Key Endpoints

### Register Practitioner with Document
```
POST /api/auth/register
Content-Type: multipart/form-data

Parameters:
- name, email, password, role, bio
- documentType: "License" | "Certification" | "Degree" | "Insurance" | "Other"
- documentFile: <file>
```

### Get Pending Documents
```
GET /api/documents/pending
Response: [ { id, userId, documentName, status, ... }, ... ]
```

### Download Document
```
GET /api/documents/download/{documentId}
Response: File binary with Content-Disposition header
```

### Verify Practitioner
```
POST /api/practitioners/admin/verify
Body: { userId, specialization, rating }
```

---

## Field Restrictions

### Document Upload
| Property | Value |
|----------|-------|
| Allowed Types | PDF, JPG, PNG, DOC, DOCX |
| Max Size | 10 MB |
| Required for | Practitioners |
| Optional for | Patients |

### Document Types
- Professional License
- Certification
- Degree/Qualification
- Insurance Certificate
- Other

### Status Values
- **PENDING** - Newly uploaded, awaiting review
- **APPROVED** - Verified by admin
- **REJECTED** - Admin rejected (with optional reason)

---

## Testing Quick Start

### Test Practitioner Registration
```
1. Go to /register
2. Select "Practitioner" role
3. Fill form
4. Upload a PDF or image file
5. Accept terms checkbox
6. Submit
✓ Should redirect to dashboard with token
```

### Test Admin Verification
```
1. Login as admin
2. Go to /admin/verify-practitioners
3. Click practitioner to expand
4. Click "Download" on document
5. File downloads to Downloads folder
6. Select specialization & rating
7. Click "Verify Practitioner"
✓ Practitioner should disappear from list
```

---

## Database Queries

### See Pending Documents
```sql
SELECT * FROM practitioner_documents 
WHERE status = 'PENDING'
ORDER BY uploaded_at DESC;
```

### See Practitioner's Documents
```sql
SELECT * FROM practitioner_documents 
WHERE user_id = {userId};
```

### Check File Location
```sql
SELECT document_path FROM practitioner_documents 
WHERE id = {documentId};
```

---

## File Storage

- **Location**: `{project}/uploads/documents/`
- **Naming**: UUID (e.g., `550e8400-e29b-41d4-a716-446655440000.pdf`)
- **Original Name**: Stored in `document_name` field in DB
- **Size**: Tracked in `file_size` field
- **MIME Type**: Stored in `file_type` field

---

## Validation Rules

### File Upload Validation
```
✓ File type: PDF | JPG | PNG | DOC | DOCX
✓ File size: ≤ 10 MB
✓ Not empty
✓ Original filename preserved
```

### Registration Validation
```
✓ Practitioner must accept terms
✓ Practitioner must upload document
✓ Patient registration unchanged (no document required)
```

### Admin Verification
```
✓ Must select specialization
✓ Rating must be 0-5
✓ Document must exist for practitioner
```

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "File size exceeds 10MB" | File too large | Use smaller file or compress |
| "File type not allowed" | Wrong extension | Use PDF, JPG, PNG, DOC, or DOCX |
| "Document not found" | Invalid document ID | Ensure practitioner uploaded document |
| "Failed to download" | File deleted | Re-upload document |
| "Must accept terms" | Checkbox unchecked | Check "I accept" before registering |

---

## Troubleshooting

### Documents Not Appearing in Admin View
```
→ Check practitioner_documents table has records
→ Verify user_id matches practitioner
→ Confirm status = 'PENDING'
→ Check file exists in uploads/documents/
```

### Download Fails
```
→ Verify file path in database is correct
→ Check file permissions on server
→ Ensure uploads/documents/ directory exists
→ Check disk space available
```

### Registration Fails
```
→ Ensure multipart/form-data content-type
→ Verify file not empty
→ Check file type allowed
→ Check API endpoint responding
```

---

## Important Configuration

### application.properties
```properties
file.upload-dir=uploads/documents
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Frontend API Base
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## Success Indicators

✅ Practitioner can see document upload during registration
✅ Document stored in uploads/documents/ with UUID name
✅ Record created in practitioner_documents table
✅ Admin can see document in verification list
✅ Admin can download file with original name
✅ File downloads to local machine
✅ Admin can verify practitioner
✅ Verified practitioner disappears from list
✅ PractitionerProfile created with admin data
