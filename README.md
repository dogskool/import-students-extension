# Import CSV Destiny Students - Airtable Extension

This Airtable extension allows you to import CSV student data with automatic duplicate checking and field mapping.

## Features

- **CSV Upload**: Upload CSV files containing student data
- **Duplicate Checking**: Automatically checks for existing records based on X Number
- **Field Mapping**: Maps CSV fields to Airtable fields with automatic processing
- **Data Processing**: 
  - Creates Full Name by concatenating First Name + Last Name
  - Creates Contract Code by removing first 3 and last 3 characters from CSN
  - Sets Duplicates field to "No" for new records

## CSV Format Expected

The CSV should contain the following columns:
- First Name
- Last Name  
- X Number
- Email
- CSN
- PO
- CU

## Airtable Fields Required

The Airtable table should have these fields:
- xNumber (Required for duplicate checking)
- Email Address
- Contract Code
- Full Name
- First Name
- Last Name
- Custom Section Number
- Duplicates

## How to Use

1. Select the target table in your Airtable base
2. Map the CSV fields to your Airtable fields using the field pickers
3. Upload your CSV file
4. Click "Import Data" to process the records
5. Review the results showing duplicates found and new records created

## Installation

1. Install the Airtable Blocks CLI: `npm install -g @airtable/blocks-cli`
2. Navigate to this directory: `cd import_csv_destiny_students`
3. Run the extension: `block run`

## Processing Logic

- **Duplicate Check**: Compares X Number from CSV against existing records
- **New Records**: Only creates records for X Numbers not found in the base
- **Field Mapping**:
  - Email → Email Address
  - First Name → First Name
  - Last Name → Last Name
  - CSN → Custom Section Number
  - Full Name = First Name + " " + Last Name
  - Contract Code = CSN with first 3 and last 3 characters removed
  - Duplicates = "No" (for new records)
