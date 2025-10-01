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

### Option 1: Using the Template (Recommended)

1. Install the Airtable Blocks CLI: `npm install -g @airtable/blocks-cli`
2. Initialize from template: `block init YOUR_BASE_ID --template=https://github.com/dogskool/import-students-extension YOUR_PROJECT_NAME`
3. Navigate to your project: `cd YOUR_PROJECT_NAME`
4. Run the extension: `block run`

### Option 2: Manual Installation

1. Install the Airtable Blocks CLI: `npm install -g @airtable/blocks-cli`
2. Clone or download this repository
3. Navigate to the directory: `cd import-students-extension`
4. Install dependencies: `npm install`
5. Run the extension: `block run`

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
