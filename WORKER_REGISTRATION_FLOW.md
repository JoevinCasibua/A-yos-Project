# Worker Registration Flow

## Overview

This document outlines the multi-step worker registration process for the A-yos platform. Workers must complete all steps and be approved by an admin before their profile becomes visible to users.

---

## Registration Steps

### Step 1: Basic Information
- Full name
- Email address
- Phone number
- Password (with confirmation)
- Profile photo upload

### Step 2: Category Selection
Workers select their primary service category:
- Plumbing
- Electrical
- HVAC (Heating, Ventilation, Air Conditioning)
- Cleaning
- General Repair
- Painting
- Carpentry
- Other (with manual text input)

### Step 3: ID Verification
Upload a valid government-issued ID for verification:
- Accepted IDs: Driver's License, Passport, National ID, Voter's ID
- Photo must be clear and readable
- ID must not be expired
- System stores ID for admin review (not displayed publicly)

### Step 4: Work Experience
- Years of professional experience (minimum 1 year)
- Brief description of work history
- Previous employers or companies (optional)
- Specializations within their category

### Step 5: Skills & Services
Workers select or add specific skills:
- Pre-defined skill suggestions based on category
- Custom skill addition (up to 10 skills)
- Set hourly rate or fixed pricing
- Indicate availability (full-time, part-time, weekends only, etc.)

### Step 6: Service Areas
Select neighborhoods or zones where services are offered:
- Map-based selection (tap to select areas)
- Or search by neighborhood/city name
- Minimum 1 area required
- Maximum 10 areas

### Step 7: Portfolio
Upload sample work photos to showcase expertise:
- Minimum 3 photos required
- Maximum 10 photos
- Each photo can have a caption (e.g., "Kitchen pipe replacement")
- Photos should be high quality and relevant to services offered

### Step 8: Review & Submit
- Summary of all entered information
- Terms and conditions acceptance
- Privacy policy acceptance
- Submit for admin review

---

## Admin Review Process

After submission, the worker account enters **Pending Review** status:

1. **Admin Notification**: Admin receives a new registration alert
2. **Verification Check**: Admin reviews uploaded ID against provided information
3. **Profile Review**: Admin checks portfolio photos, skills, and experience
4. **Decision**:
   - **Approved**: Worker receives notification, account status changes to "Verified"
   - **Rejected**: Worker receives notification with rejection reason, can re-apply

---

## Account Statuses

| Status | Description |
|--------|-------------|
| `pending` | Registration submitted, awaiting admin review |
| `verified` | Approved by admin, profile visible to users |
| `rejected` | Rejected by admin, can re-apply with corrections |
| `suspended` | Previously verified, suspended for policy violation |

---

## Future Enhancements

- **Expedited Review**: Workers can pay for faster review (24-hour turnaround)
- **Auto-Approval**: Low-risk categories may be auto-approved
- **Background Check**: Optional paid background check integration
- **Certification Upload**: Upload professional certifications
- **Video Introduction**: Short video introduction for profile
