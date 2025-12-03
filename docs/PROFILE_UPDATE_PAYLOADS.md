# Profile Update API Payloads

This document describes all the payload structures for profile updates.

## Endpoints

- **Founder Profile Update**: `PUT /profile/update`
- **Mentor Profile Update**: `PUT /mentor-onboarding/my-profile`

Both endpoints use the same payload structures but are called based on the user's role.

## Payload Structures

### 1. About Section Update

**Payload:**
```json
{
  "about": "string"  // Bio/about text description
}
```

**Example:**
```json
{
  "about": "I am a serial entrepreneur with 10+ years of experience building SaaS products. I've successfully exited two startups and am currently working on my third venture."
}
```

---

### 2. Location Update

**Payload:**
```json
{
  "location": "string"  // Location string (e.g., "San Francisco, CA")
}
```

**Example:**
```json
{
  "location": "San Francisco, CA"
}
```

---

### 3. Professional Experience Update

**Payload:**
```json
{
  "experiences": [
    {
      "company": "string",           // Company name
      "title": "string",             // Job title
      "start_date": "string",        // Start date in YYYY-MM format
      "end_date": "string | null",   // End date in YYYY-MM format, or null if current
      "summary": "string",           // Job description/achievements
      "is_current": boolean          // true if this is current position
    }
  ]
}
```

**Example:**
```json
{
  "experiences": [
    {
      "company": "Google",
      "title": "Senior Software Engineer",
      "start_date": "2020-01",
      "end_date": "2022-12",
      "summary": "Led a team of 5 engineers to build scalable backend services. Increased system performance by 40%.",
      "is_current": false
    },
    {
      "company": "My Startup Inc",
      "title": "Founder & CEO",
      "start_date": "2023-01",
      "end_date": null,
      "summary": "Founded and currently leading a SaaS startup focused on productivity tools.",
      "is_current": true
    }
  ]
}
```

---

### 4. Education Update

**Payload:**
```json
{
  "education": [
    {
      "school": "string",            // School/University name
      "degree": "string",            // Degree name (e.g., "Bachelor of Science")
      "field_of_study": "string",    // Field of study (e.g., "Computer Science")
      "start_year": "integer | null", // Start year as integer (e.g., 2015)
      "end_year": "integer | null",   // End year as integer, or null if ongoing
      "description": "string"        // Additional details
    }
  ]
}
```

**Example:**
```json
{
  "education": [
    {
      "school": "Stanford University",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_year": 2015,
      "end_year": 2019,
      "description": "Graduated with honors. Focused on machine learning and distributed systems."
    },
    {
      "school": "MIT",
      "degree": "Master of Business Administration",
      "field_of_study": "Business Administration",
      "start_year": 2020,
      "end_year": 2022,
      "description": "Specialized in entrepreneurship and innovation."
    }
  ]
}
```

---

### 5. Skills & Expertise Update

**Payload:**
```json
{
  "expertise": ["string"],      // Array of skill names
  "industries": ["string"]      // Array of industry names
}
```

**Example:**
```json
{
  "expertise": [
    "Product Management",
    "Software Engineering",
    "Team Leadership",
    "Strategic Planning",
    "Customer Acquisition"
  ],
  "industries": [
    "SaaS",
    "FinTech",
    "Healthcare Technology",
    "E-commerce"
  ]
}
```

---

### 6. Profile Information Update (Title, Company, Location)

**Payload:**
```json
{
  "title": "string",      // Professional title (e.g., "Founder & CEO")
  "company": "string",    // Company name
  "location": "string"    // Location string
}
```

**Example:**
```json
{
  "title": "Founder & CEO",
  "company": "My Startup Inc",
  "location": "San Francisco, CA"
}
```

---

## Notes

1. **Partial Updates**: All payloads support partial updates. Only include the fields you want to update.

2. **Arrays**: When updating arrays (experiences, education, expertise, industries), the entire array should be sent. The backend will replace the existing array with the new one.

3. **Date Formats**:
   - Experience dates: `YYYY-MM` format (e.g., "2020-01")
   - Education years: Integer format (e.g., 2015)

4. **Null Values**: Use `null` for:
   - `end_date` in experiences if the position is current
   - `end_year` in education if the education is ongoing

5. **Required Fields**: All fields in each payload are optional except for the top-level keys. However, when updating arrays, include all relevant fields for each item.

## API Response

Both endpoints should return the updated profile data in the same format as the GET endpoints:

- Founder: Same format as `GET /profile/me` (note: PUT endpoint is `/profile/update`)
- Mentor: Same format as `GET /mentor-onboarding/my-profile`
