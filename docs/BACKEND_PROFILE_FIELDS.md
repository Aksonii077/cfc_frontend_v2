# Backend Profile Update Fields Reference

This document lists all the fields that the backend endpoint should support for profile updates.

## Endpoints

- **Founder**: `PUT /profile/update`
- **Mentor**: `PUT /mentor-onboarding/my-profile`

## All Supported Fields

The backend should accept the following fields (can be sent individually or in combinations):

### 1. About Section
- **Field**: `about` (string)
- **Description**: Bio/about text description
- **Example Payload**:
```json
{
  "about": "I am a serial entrepreneur with 10+ years of experience building SaaS products."
}
```

---

### 2. Location
- **Field**: `location` (string)
- **Description**: User's location (e.g., "San Francisco, CA")
- **Example Payload**:
```json
{
  "location": "San Francisco, CA"
}
```

---

### 3. Profile Information
- **Fields**:
  - `title` (string): Professional title (e.g., "Founder & CEO")
  - `company` (string): Company name
  - `location` (string): Location string (same as location field above)
- **Example Payload**:
```json
{
  "title": "Founder & CEO",
  "company": "My Startup Inc",
  "location": "San Francisco, CA"
}
```

---

### 4. Professional Experience
- **Field**: `experiences` (array of objects)
- **Each experience object contains**:
  - `company` (string, required): Company name
  - `title` (string, required): Job title/position
  - `start_date` (string): Start date in YYYY-MM format (e.g., "2020-01")
  - `end_date` (string | null): End date in YYYY-MM format, or `null` if current position
  - `summary` (string): Job description/achievements
  - `is_current` (boolean): `true` if this is the current position
- **Example Payload**:
```json
{
  "experiences": [
    {
      "company": "Google",
      "title": "Senior Software Engineer",
      "start_date": "2020-01",
      "end_date": "2022-12",
      "summary": "Led a team of 5 engineers to build scalable backend services.",
      "is_current": false
    },
    {
      "company": "My Startup Inc",
      "title": "Founder & CEO",
      "start_date": "2023-01",
      "end_date": null,
      "summary": "Founded and currently leading a SaaS startup.",
      "is_current": true
    }
  ]
}
```

---

### 5. Education
- **Field**: `education` (array of objects)
- **Each education object contains**:
  - `school` (string, required): School/University name
  - `degree` (string): Degree name (e.g., "Bachelor of Science")
  - `field_of_study` (string): Field of study (e.g., "Computer Science")
  - `start_year` (integer | null): Start year as integer (e.g., 2015)
  - `end_year` (integer | null): End year as integer, or `null` if ongoing
  - `description` (string): Additional details/description
- **Example Payload**:
```json
{
  "education": [
    {
      "school": "Stanford University",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_year": 2015,
      "end_year": 2019,
      "description": "Graduated with honors. Focused on machine learning."
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

### 6. Skills & Expertise
- **Fields**:
  - `expertise` (array of strings): Array of skill names
  - `industries` (array of strings): Array of industry names
- **Example Payload**:
```json
{
  "expertise": [
    "Product Management",
    "Software Engineering",
    "Team Leadership",
    "Strategic Planning"
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

## Complete Field Summary

Here's a quick reference of all top-level fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `about` | string | Bio/about text |
| `location` | string | User location |
| `title` | string | Professional title |
| `company` | string | Company name |
| `experiences` | array | Professional experience entries |
| `education` | array | Education entries |
| `expertise` | array of strings | Skills/expertise list |
| `industries` | array of strings | Industries list |

## Important Notes for Backend Implementation

1. **Partial Updates**: The endpoint should support partial updates. Users can send any combination of these fields.

2. **Array Replacements**: When updating arrays (`experiences`, `education`, `expertise`, `industries`), the frontend sends the complete array. The backend should replace the existing array with the new one (not merge).

3. **Data Validation**:
   - **Experiences**: Filter out entries where `title` or `company` is empty/whitespace
   - **Education**: Filter out entries where `school` is empty/whitespace
   - **Skills/Industries**: Filter out empty strings

4. **Date Formats**:
   - Experience dates: `YYYY-MM` format (e.g., "2020-01")
   - Education years: Integer format (e.g., 2015)

5. **Null Handling**:
   - `end_date` in experiences: `null` if position is current
   - `end_year` in education: `null` if education is ongoing

6. **Current Position Logic**: 
   - `is_current` should be `true` if `end_date` is `null` or empty or equals "Present"

## Example Complete Payload (All Fields)

```json
{
  "about": "I am a serial entrepreneur with 10+ years of experience.",
  "location": "San Francisco, CA",
  "title": "Founder & CEO",
  "company": "My Startup Inc",
  "experiences": [
    {
      "company": "Google",
      "title": "Senior Software Engineer",
      "start_date": "2020-01",
      "end_date": "2022-12",
      "summary": "Led engineering team.",
      "is_current": false
    }
  ],
  "education": [
    {
      "school": "Stanford University",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_year": 2015,
      "end_year": 2019,
      "description": "Graduated with honors."
    }
  ],
  "expertise": ["Product Management", "Software Engineering"],
  "industries": ["SaaS", "FinTech"]
}
```
