// Define the initial state of the 2D array, each cell contains a value and background color
let initialDataArray = [
    [{value: 'Student Name'}, {value: 'Student ID'}, {value: 'Assignment 1'}, {value: 'Assignment 2'}, {value: 'Assignment 3'}, {value: 'Assignment 4'}, {value: 'Assignment 5'}, {value: 'Average [%]'}]
];

for (let i = 0; i < 10; i++) {
    initialDataArray.push(generateRandomRow(initialDataArray[0].length));
}

let dataArray = JSON.parse(JSON.stringify(initialDataArray));

// Get table element and buttons
const table = document.getElementById('data-table');
const deleteButton = document.getElementById('delete-button');
const undeleteButton = document.getElementById('undelete-button');
const insertColumnButton = document.getElementById('insert-column-button');
const insertRowButton = document.getElementById('insert-row-button');
const saveButton = document.getElementById('save-button');
const resetButton = document.getElementById('reset-button');
const unsubmittedCA = document.getElementById('unsubmittedCA');
let selectedRow = null;
let selectedCol = null;
let lastDeleted = null;
let averageTextState = 0;

// Generate random row data
function generateRandomRow(columnCount) {
    const name = faker.name.findName();
    const id = faker.datatype.number({ min: 100000000, max: 999999999 }).toString();
    // const assignments = Array.from({ length: columnCount - 3 }, () => ({ value: '-' }));
    const assignments = Array.from({ length: columnCount - 3 }, () => ({ value: faker.datatype.number({ min: 0, max: 100 }).toString() }));
    return [{ value: name }, { value: id }, ...assignments, { value: '' }];
}

// Calculate the average score
function calculateAverage(rowData) {
    const assignmentValues = rowData.slice(2, -1).map(cell => cell.value === '-' ? null : parseInt(cell.value)).filter(val => val !== null);
    if (assignmentValues.length === 0) {
        return '-';
    }
    const sum = assignmentValues.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / assignmentValues.length);

    if (averageTextState === 0) {
        return `${average}`;
    } else if (averageTextState === 1) {
        return convertToLetterGrade(average);
    } else {
        return convertTo4Scale(average);
    }
}

// Convert to letter grade
function convertToLetterGrade(average) {
    if (average >= 93) return 'A';
    if (average >= 90) return 'A-';
    if (average >= 87) return 'B+';
    if (average >= 83) return 'B';
    if (average >= 80) return 'B-';
    if (average >= 77) return 'C+';
    if (average >= 73) return 'C';
    if (average >= 70) return 'C-';
    if (average >= 67) return 'D+';
    if (average >= 63) return 'D';
    if (average >= 60) return 'D-';
    return 'F';
}

// Convert to 4.0 scale
function convertTo4Scale(average) {
    if (average >= 93) return '4.0';
    if (average >= 90) return '3.7';
    if (average >= 87) return '3.3';
    if (average >= 83) return '3.0';
    if (average >= 80) return '2.7';
    if (average >= 77) return '2.3';
    if (average >= 73) return '2.0';
    if (average >= 70) return '1.7';
    if (average >= 67) return '1.3';
    if (average >= 63) return '1.0';
    if (average >= 60) return '0.7';
    return '0.0';
}

// Toggle Average Text
function toggleAverageText() {
    const averageHeader = dataArray[0][dataArray[0].length - 1];
    if (averageTextState === 0) {
        averageHeader.value = 'Average [Letter]';
        averageTextState = 1;
    } else if (averageTextState === 1) {
        averageHeader.value = 'Average [4.0]';
        averageTextState = 2;
    } else {
        averageHeader.value = 'Average [%]';
        averageTextState = 0;
    }
    renderTable();
}

// Render the table
function renderTable() {
    table.innerHTML = '';
    dataArray.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');
        rowData.forEach((cellData, cellIndex) => {
            const cell = document.createElement(rowIndex === 0 ? 'th' : 'td');
            cell.textContent = cellData.value;
            if (rowIndex !== 0 && cellIndex === rowData.length - 1) {
                const average = calculateAverage(rowData);
                cell.textContent = average;
                const originalAverage = calculateOriginalAverage(rowData);
                if (originalAverage !== '-' && parseInt(originalAverage) < 60) {
                    cell.style.backgroundColor = 'red';
                    cell.style.color = 'white';
                } else {
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                }
            }
            if (cellIndex === 0 && rowIndex !== 0) {
                cell.addEventListener('click', () => toggleRowSelection(row));
            }
            if (rowIndex === 0 && cellIndex !== 0 && cellIndex !== rowData.length - 1 && cellIndex !== 1) {
                cell.addEventListener('click', () => toggleColSelection(cellIndex));
            }
            if (rowIndex === 0 && cellIndex === rowData.length - 1) {
                cell.addEventListener('click', toggleAverageText);
            }
            if (rowIndex !== 0 && cellIndex > 1 && cellIndex < rowData.length - 1) {
                const value = cellData.value === '-' ? '-' : parseFloat(cellData.value);
                if (value === '-') {
                    cell.style.backgroundColor = 'yellow';
                    cell.style.color = 'black';
                    cell.style.textAlign = 'center';
                } else if (!isNaN(value) && value < 60) {
                    cell.style.backgroundColor = 'red';
                    cell.style.color = 'white';
                    cell.style.textAlign = 'right';
                } else {
                    cell.style.backgroundColor = '';
                    cell.style.color = '';
                    cell.style.textAlign = 'right';
                }
                cell.contentEditable = true;
                cell.addEventListener('blur', (event) => {
                    if (preventBlur) {
                        event.stopImmediatePropagation(); // Prevent the blur event
                        preventBlur = false; // Reset the flag
                        return;
                    }
                    const newValue = parseInt(cell.textContent);
                    if (isNaN(newValue) || newValue < 0 || newValue > 100) {
                        cell.textContent = '-';
                        cellData.value = '-';
                        cell.style.textAlign = 'center';
                    } else {
                        cellData.value = newValue.toString();
                        cell.style.textAlign = 'right';
                    }
                    renderTable();
                });
                cell.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        cell.blur();
                    }
                });
            }
            // Set Student Name and Student ID columns to left align
            if (cellIndex === 0 || cellIndex === 1) {
                cell.style.textAlign = 'left';
            }
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    updateDeleteButtonState();
    updateUnsubmittedAssignments(); // Update the count of unsubmitted assignments
}

// Calculate the original average score
function calculateOriginalAverage(rowData) {
    const assignmentValues = rowData.slice(2, -1).map(cell => cell.value === '-' ? null : parseInt(cell.value)).filter(val => val !== null);
    if (assignmentValues.length === 0) {
        return '-';
    }
    const sum = assignmentValues.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / assignmentValues.length);
}

// Update the count of unsubmitted assignments
function updateUnsubmittedAssignments() {
    let count = 0;
    dataArray.forEach((rowData, rowIndex) => {
        if (rowIndex !== 0) {
            rowData.slice(2, -1).forEach(cell => {
                if (cell.value === '-') {
                    count++;
                }
            });
        }
    });
    unsubmittedCA.textContent = `Unsubmitted Assignments: ${count}`;
}

// Toggle row selection
function toggleRowSelection(row) {
    if (selectedCol !== null) {
        clearColSelection();
    }
    if (selectedRow) {
        selectedRow.classList.remove('selected-row');
    }
    if (selectedRow !== row) {
        row.classList.add('selected-row');
        selectedRow = row;
    } else {
        selectedRow = null;
    }
    undeleteButton.disabled = true;
    updateDeleteButtonState();
}

// Toggle column selection
function toggleColSelection(colIndex) {
    if (selectedRow !== null) {
        selectedRow.classList.remove('selected-row');
        selectedRow = null;
    }
    if (selectedCol === colIndex) {
        clearColSelection();
    } else {
        if (selectedCol !== null) {
            clearColSelection();
        }
        Array.from(table.rows).forEach((row, rowIndex) => {
            row.cells[colIndex].classList.add('selected-col');
            if (rowIndex === 0) {
                row.cells[colIndex].classList.add('selected-col-top');
            }
            if (rowIndex === table.rows.length - 1) {
                row.cells[colIndex].classList.add('selected-col-bottom');
            }
        });
        selectedCol = colIndex;
    }
    undeleteButton.disabled = true;
    updateDeleteButtonState();
}

// Clear column selection
function clearColSelection() {
    Array.from(table.rows).forEach((row, rowIndex) => {
        row.cells[selectedCol].classList.remove('selected-col', 'selected-col-top', 'selected-col-bottom');
    });
    selectedCol = null;
}

// Update delete button state
function updateDeleteButtonState() {
    if (selectedRow !== null || selectedCol !== null) {
        deleteButton.disabled = false;
    } else {
        deleteButton.disabled = true;
    }
}

// Delete selected row or column
deleteButton.addEventListener('click', () => {
    if (selectedRow !== null) {
        const rowIndex = Array.from(table.rows).indexOf(selectedRow);
        lastDeleted = { type: 'row', index: rowIndex, data: dataArray[rowIndex] };
        dataArray.splice(rowIndex, 1);
        selectedRow = null;
    } else if (selectedCol !== null) {
        lastDeleted = { type: 'col', index: selectedCol, data: dataArray.map(row => row[selectedCol]) };
        dataArray.forEach(row => {
            row.splice(selectedCol, 1);
        });
        // Re-label Assignment columns
        dataArray[0].forEach((cell, index) => {
            if (cell.value.startsWith('Assignment')) {
                cell.value = `Assignment ${index - 1}`;
            }
        });
        selectedCol = null;
    }
    renderTable();
    deleteButton.disabled = true;
    undeleteButton.disabled = false;
});

// Undo delete
undeleteButton.addEventListener('click', () => {
    if (lastDeleted !== null) {
        if (lastDeleted.type === 'row') {
            dataArray.splice(lastDeleted.index, 0, lastDeleted.data);
            renderTable();
            selectedRow = table.rows[lastDeleted.index];
            selectedRow.classList.add('selected-row');
        } else if (lastDeleted.type === 'col') {
            dataArray.forEach((row, rowIndex) => {
                row.splice(lastDeleted.index, 0, lastDeleted.data[rowIndex]);
            });
            // Re-label Assignment columns
            dataArray[0].forEach((cell, index) => {
                if (cell.value.startsWith('Assignment')) {
                    cell.value = `Assignment ${index - 1}`;
                }
            });
            renderTable();
            selectedCol = lastDeleted.index;
            Array.from(table.rows).forEach((row, rowIndex) => {
                row.cells[selectedCol].classList.add('selected-col');
                if (rowIndex === 0) {
                    row.cells[selectedCol].classList.add('selected-col-top');
                }
                if (rowIndex === table.rows.length - 1) {
                    row.cells[selectedCol].classList.add('selected-col-bottom');
                }
            });
        }
        lastDeleted = null;
        undeleteButton.disabled = true;
        deleteButton.disabled = true;
        updateDeleteButtonState();
    }
});

// Insert column
insertColumnButton.addEventListener('click', () => {
    const averageIndex = dataArray[0].length - 1;
    const assignmentCount = dataArray[0].filter(cell => cell.value.startsWith('Assignment')).length;
    const newAssignment = `Assignment ${assignmentCount + 1}`;
    dataArray.forEach((row, rowIndex) => {
        // row.splice(averageIndex, 0, { value: rowIndex === 0 ? newAssignment : '-' });
        row.splice(averageIndex, 0, { value: rowIndex === 0 ? newAssignment : faker.datatype.number({ min: 0, max: 100 }).toString() });
    });
    renderTable();
    selectedCol = averageIndex;
    Array.from(table.rows).forEach((row, rowIndex) => {
        row.cells[selectedCol].classList.add('selected-col');
        if (rowIndex === 0) {
            row.cells[selectedCol].classList.add('selected-col-top');
        }
        if (rowIndex === table.rows.length - 1) {
            row.cells[selectedCol].classList.add('selected-col-bottom');
        }
    });
    undeleteButton.disabled = true;
    updateDeleteButtonState();
});

// Insert row
insertRowButton.addEventListener('click', () => {
    const newRow = generateRandomRow(dataArray[0].length);
    dataArray.push(newRow);
    renderTable();
    selectedRow = table.rows[table.rows.length - 1];
    selectedRow.classList.add('selected-row');
    undeleteButton.disabled = true;
    updateDeleteButtonState();
});

// Reset to initial state
resetButton.addEventListener('click', () => {
    dataArray = JSON.parse(JSON.stringify(savedDataArray)); // Restore to the saved state
    averageTextState = 0;
    dataArray[0][dataArray[0].length - 1].value = 'Average [%]';
    renderTable();
    undeleteButton.disabled = true;
    deleteButton.disabled = true;
    selectedRow = null;
    selectedCol = null;
    updateDeleteButtonState();
});

// Save current state
saveButton.addEventListener('click', () => {
    savedDataArray = JSON.parse(JSON.stringify(dataArray));
    resetButton.disabled = false;
});

// Initial render of the table
renderTable();

// Right-click menu functionality
const contextMenu = document.getElementById('context-menu');
let targetCell = null;
let preventBlur = false;

table.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    targetCell = event.target;

    // Check if the cell is contentEditable
    if (targetCell.isContentEditable) {
        preventBlur = true; // Set flag to prevent blur event
        targetCell.contentEditable = false; // Cancel editing state
    }

    const rowIndex = Array.from(targetCell.parentElement.parentElement.children).indexOf(targetCell.parentElement);
    if (targetCell.tagName === 'TD' && rowIndex !== 0) {
        contextMenu.style.top = `${event.clientY}px`;
        contextMenu.style.left = `${event.clientX}px`;
        contextMenu.style.display = 'block';
    }
});

document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
    preventBlur = false; // Re-enable blur event
});

document.getElementById('insert-row-above').addEventListener('click', () => {
    if (targetCell) {
        const rowIndex = Array.from(targetCell.parentElement.parentElement.children).indexOf(targetCell.parentElement);
        const newRow = generateRandomRow(dataArray[0].length);
        dataArray.splice(rowIndex, 0, newRow);
        renderTable();
    
        selectedRow = table.rows[rowIndex];
        selectedRow.classList.add('selected-row');
        undeleteButton.disabled = true;
        updateDeleteButtonState();
    }
});

document.getElementById('insert-row-below').addEventListener('click', () => {
    if (targetCell) {
        const rowIndex = Array.from(targetCell.parentElement.parentElement.children).indexOf(targetCell.parentElement);
        const newRow = generateRandomRow(dataArray[0].length);
        dataArray.splice(rowIndex + 1, 0, newRow);
        renderTable();

        selectedRow = table.rows[rowIndex + 1];
        selectedRow.classList.add('selected-row');
        undeleteButton.disabled = true;
        updateDeleteButtonState();
    }
});
