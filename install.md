# Installation Instructions

## Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation Steps

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Follow installation instructions for your operating system

2. **Install Airtable Blocks CLI**:
   ```bash
   npm install -g @airtable/blocks-cli
   ```

3. **Navigate to the project directory**:
   ```bash
   cd import_csv_destiny_students
   ```

4. **Install project dependencies**:
   ```bash
   npm install
   ```

5. **Run the extension**:
   ```bash
   block run
   ```

## Alternative Setup (if npm is not available)

If you encounter issues with npm, you can:

1. **Use the extension directly in Airtable**:
   - Copy the contents of `src/index.js`
   - Create a new custom block in Airtable
   - Paste the code into the block editor

2. **Manual installation**:
   - The extension files are ready to use
   - You can modify the code directly in the `src/index.js` file
   - Upload to Airtable using their web interface

## Testing

Use the provided `sample_data.csv` file to test the extension functionality.

## Troubleshooting

- Ensure your Airtable base has the required fields
- Check that the CSV file format matches the expected structure
- Verify field mappings are correct before importing
