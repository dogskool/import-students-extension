import { initializeBlock } from '@airtable/blocks';
import { Box, Button, FieldPicker, FormField, Input, Text, TablePicker, useBase, useRecords, useTable } from '@airtable/blocks/ui';
import React, { useState, useCallback } from 'react';

function ImportCsvDestinyStudentsApp() {
    try {
        const base = useBase();
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState(null);
    const [xNumberField, setXNumberField] = useState(null);
    const [emailField, setEmailField] = useState(null);
    const [contractCodeField, setContractCodeField] = useState(null);
    const [fullNameField, setFullNameField] = useState(null);
    const [firstNameField, setFirstNameField] = useState(null);
    const [lastNameField, setLastNameField] = useState(null);
    const [customSectionNumberField, setCustomSectionNumberField] = useState(null);
    const [duplicatesField, setDuplicatesField] = useState(null);

    const table = selectedTable ? base.getTableByIdIfExists(selectedTable.id) : null;
    const records = useRecords(table);

    // Parse CSV data with better handling of quoted fields
    const parseCSV = useCallback((csvText) => {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];
        
        // Parse headers
        const headers = parseCSVLine(lines[0]);
        const data = [];
        
        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = parseCSVLine(lines[i]);
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        }
        return data;
    }, []);

    // Helper function to parse a single CSV line, handling quoted fields
    const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the last field
        result.push(current.trim());
        return result;
    };

    // Handle file upload
    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvText = e.target.result;
                const parsedData = parseCSV(csvText);
                setCsvData(parsedData);
            };
            reader.readAsText(file);
        } else {
            alert('Please select a valid CSV file.');
        }
    }, [parseCSV]);

    // Check for duplicates and process data
    const processData = useCallback(async () => {
        if (!table || !csvData.length || !xNumberField) {
            alert('Please select a table and ensure all required fields are mapped.');
            return;
        }

        setIsProcessing(true);
        const existingXNumbers = new Set();
        const newRecords = [];
        const duplicates = [];

        // Get existing X numbers from Airtable
        if (records && xNumberField) {
            records.forEach(record => {
                const xNumber = record.getCellValue(xNumberField);
                if (xNumber) {
                    existingXNumbers.add(xNumber.toString());
                }
            });
        }

        // Process CSV data
        csvData.forEach((row, index) => {
            const xNumber = row['X Number'];
            if (!xNumber) return;

            if (existingXNumbers.has(xNumber)) {
                duplicates.push({ row: index + 1, xNumber, reason: 'X Number already exists' });
            } else {
                // Create new record data
                const firstName = row['First Name'] || '';
                const lastName = row['Last Name'] || '';
                const email = row['Email'] || '';
                const csn = row['CSN'] || '';
                
                // Create Contract Code by removing first 3 and last 3 characters of CSN
                const contractCode = csn.length > 6 ? csn.substring(3, csn.length - 3) : '';
                
                // Create Full Name
                const fullName = `${firstName} ${lastName}`.trim();

                const recordData = {};
                
                // Only add fields that are mapped
                if (xNumberField) recordData[xNumberField.id] = xNumber;
                if (emailField) recordData[emailField.id] = email;
                if (contractCodeField) recordData[contractCodeField.id] = contractCode;
                if (fullNameField) recordData[fullNameField.id] = fullName;
                if (firstNameField) recordData[firstNameField.id] = firstName;
                if (lastNameField) recordData[lastNameField.id] = lastName;
                if (customSectionNumberField) recordData[customSectionNumberField.id] = csn;
                if (duplicatesField) recordData[duplicatesField.id] = 'No';

                newRecords.push(recordData);
            }
        });

        // Create new records in Airtable
        let createdCount = 0;
        let errorCount = 0;
        const errors = [];

        if (newRecords.length > 0) {
            try {
                // Create records in batches
                const batchSize = 50;
                for (let i = 0; i < newRecords.length; i += batchSize) {
                    const batch = newRecords.slice(i, i + batchSize);
                    try {
                        await table.createRecordsAsync(batch);
                        createdCount += batch.length;
                    } catch (error) {
                        errorCount += batch.length;
                        errors.push(`Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
                    }
                }
            } catch (error) {
                errors.push(`General error: ${error.message}`);
            }
        }

        setResults({
            totalProcessed: csvData.length,
            duplicatesFound: duplicates.length,
            newRecordsCreated: createdCount,
            errors: errorCount,
            errorDetails: errors,
            duplicateDetails: duplicates
        });
        setIsProcessing(false);
    }, [table, csvData, records, xNumberField, emailField, contractCodeField, fullNameField, firstNameField, lastNameField, customSectionNumberField, duplicatesField]);

    return (
        <Box padding={3}>
            <Text size="xlarge" weight="bold" marginBottom={3}>
                Import CSV Destiny Students
            </Text>
            
            <FormField label="Select Table">
                <TablePicker
                    base={base}
                    table={selectedTable}
                    onChange={setSelectedTable}
                    placeholder="Choose a table..."
                />
            </FormField>

            {table && (
                <>
                    <Text size="large" weight="bold" marginTop={3} marginBottom={2}>
                        Field Mapping
                    </Text>
                    
                    <FormField label="X Number Field (Required)">
                        <FieldPicker
                            table={table}
                            field={xNumberField}
                            onChange={setXNumberField}
                            placeholder="Select X Number field..."
                        />
                    </FormField>

                    <FormField label="Email Address Field">
                        <FieldPicker
                            table={table}
                            field={emailField}
                            onChange={setEmailField}
                            placeholder="Select Email Address field..."
                        />
                    </FormField>

                    <FormField label="Contract Code Field">
                        <FieldPicker
                            table={table}
                            field={contractCodeField}
                            onChange={setContractCodeField}
                            placeholder="Select Contract Code field..."
                        />
                    </FormField>

                    <FormField label="Full Name Field">
                        <FieldPicker
                            table={table}
                            field={fullNameField}
                            onChange={setFullNameField}
                            placeholder="Select Full Name field..."
                        />
                    </FormField>

                    <FormField label="First Name Field">
                        <FieldPicker
                            table={table}
                            field={firstNameField}
                            onChange={setFirstNameField}
                            placeholder="Select First Name field..."
                        />
                    </FormField>

                    <FormField label="Last Name Field">
                        <FieldPicker
                            table={table}
                            field={lastNameField}
                            onChange={setLastNameField}
                            placeholder="Select Last Name field..."
                        />
                    </FormField>

                    <FormField label="Custom Section Number Field">
                        <FieldPicker
                            table={table}
                            field={customSectionNumberField}
                            onChange={setCustomSectionNumberField}
                            placeholder="Select Custom Section Number field..."
                        />
                    </FormField>

                    <FormField label="Duplicates Field">
                        <FieldPicker
                            table={table}
                            field={duplicatesField}
                            onChange={setDuplicatesField}
                            placeholder="Select Duplicates field..."
                        />
                    </FormField>
                </>
            )}

            <FormField label="Upload CSV File" marginTop={3}>
                <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                />
            </FormField>

            {csvData.length > 0 && (
                <Box marginTop={2}>
                    <Text>CSV Data Preview ({csvData.length} records):</Text>
                    <Box maxHeight="200px" overflow="auto" border="default" padding={2} marginTop={1}>
                        <pre>{JSON.stringify(csvData.slice(0, 3), null, 2)}</pre>
                        {csvData.length > 3 && <Text>... and {csvData.length - 3} more records</Text>}
                    </Box>
                </Box>
            )}

            <Button
                onClick={processData}
                disabled={!table || !csvData.length || !xNumberField || isProcessing}
                marginTop={3}
            >
                {isProcessing ? 'Processing...' : 'Import Data'}
            </Button>

            {results && (
                <Box marginTop={3} padding={2} border="default">
                    <Text size="large" weight="bold">Import Results:</Text>
                    <Text>Total Records Processed: {results.totalProcessed}</Text>
                    <Text>Duplicates Found: {results.duplicatesFound}</Text>
                    <Text>New Records Created: {results.newRecordsCreated}</Text>
                    <Text>Errors: {results.errors}</Text>
                    
                    {results.errorDetails.length > 0 && (
                        <Box marginTop={2}>
                            <Text weight="bold">Error Details:</Text>
                            {results.errorDetails.map((error, index) => (
                                <Text key={index} textColor="red">{error}</Text>
                            ))}
                        </Box>
                    )}
                    
                    {results.duplicateDetails.length > 0 && (
                        <Box marginTop={2}>
                            <Text weight="bold">Duplicate Details:</Text>
                            {results.duplicateDetails.slice(0, 10).map((dup, index) => (
                                <Text key={index}>Row {dup.row}: X Number {dup.xNumber} - {dup.reason}</Text>
                            ))}
                            {results.duplicateDetails.length > 10 && (
                                <Text>... and {results.duplicateDetails.length - 10} more duplicates</Text>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
    } catch (error) {
        console.error('Extension error:', error);
        return (
            <Box padding={3}>
                <Text size="large" weight="bold" textColor="red">
                    Extension Error
                </Text>
                <Text marginTop={2}>
                    An error occurred while loading the extension. Please refresh the page and try again.
                </Text>
                <Text marginTop={1} textColor="gray">
                    Error: {error.message}
                </Text>
            </Box>
        );
    }
}

initializeBlock(() => <ImportCsvDestinyStudentsApp />);
