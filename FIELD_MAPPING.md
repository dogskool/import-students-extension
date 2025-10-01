# Field Mapping Guide

## CSV Fields (Input)
The extension expects these fields in your CSV file:
- **First Name**: Student's first name
- **Last Name**: Student's last name  
- **X Number**: Unique student identifier (used for duplicate checking)
- **Email**: Student's email address
- **CSN**: Contract Section Number (used to generate Contract Code)
- **PO**: Purchase Order (not mapped to Airtable)
- **CU**: Customer Unit (not mapped to Airtable)

## Airtable Fields (Output)
Map these fields in your Airtable table:

### Required Fields
- **xNumber**: Maps to CSV "X Number" field
  - Used for duplicate checking
  - Must be mapped for the extension to work

### Optional Fields (Recommended)
- **Email Address**: Maps to CSV "Email" field
- **First Name**: Maps to CSV "First Name" field
- **Last Name**: Maps to CSV "Last Name" field
- **Custom Section Number**: Maps to CSV "CSN" field
- **Duplicates**: Set to "No" for new records

### Auto-Generated Fields
- **Full Name**: Automatically created from First Name + " " + Last Name
- **Contract Code**: Automatically created by removing first 3 and last 3 characters from CSN

## Data Processing Rules

### Duplicate Checking
- Compares X Number from CSV against existing records in Airtable
- If X Number exists, record is skipped (marked as duplicate)
- Only new X Numbers will create new records

### Contract Code Generation
- Takes the CSN value from CSV
- Removes first 3 characters
- Removes last 3 characters
- Example: "ABC123456789DEF" → "123456789"

### Full Name Generation
- Concatenates First Name + " " + Last Name
- Trims any extra whitespace
- Example: "John" + " " + "Doe" → "John Doe"

## Field Types in Airtable

Recommended field types for optimal functionality:
- **xNumber**: Single line text
- **Email Address**: Email
- **Contract Code**: Single line text
- **Full Name**: Single line text
- **First Name**: Single line text
- **Last Name**: Single line text
- **Custom Section Number**: Single line text
- **Duplicates**: Single select (with "Yes" and "No" options)

## Example Mapping

If your Airtable fields are named differently, here's how to map them:

| CSV Field | Airtable Field | Processing |
|-----------|----------------|------------|
| X Number | Student ID | Direct mapping |
| Email | Email Address | Direct mapping |
| First Name | First Name | Direct mapping |
| Last Name | Last Name | Direct mapping |
| CSN | Section Number | Direct mapping |
| - | Full Name | Auto-generated |
| - | Contract Code | Auto-generated from CSN |
| - | Duplicates | Set to "No" |
