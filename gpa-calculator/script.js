let assignments = [];
let assignmentForm;
let assignmentNameInput;
let assignmentGradeInput;
let gpaValueDisplay;
let assignmentsListContainer;
let validationMessageDisplay;
/**
 * @function calculateGPA
 * @description Calculates the Grade Point Average from the 'assignments' array.
 * Each assignment's grade is summed, and then divided by the total number of assignments.
 * @returns {string} The calculated GPA, formatted to two decimal places.
 */
function calculateGPA() {
    if (assignments.length === 0) {
        return '0.00';
    }
    const totalGradePoints = assignments.reduce((sum, assignment) => sum + assignment.grade, 0);
    const gpa = totalGradePoints / assignments.length;
    return gpa.toFixed(2);
}

/**
 * @function renderAssignments
 * @description Renders (or re-renders) the list of assignments and the current GPA in the UI.
 * It clears the existing list, adds new items for each assignment, and updates the GPA display.
 */
function renderAssignments() {
    if (!assignmentsListContainer) {
        console.error("Assignments list container not found. Cannot render assignments.");
        return;
    }
    assignmentsListContainer.innerHTML = '';
    if (assignments.length === 0) {
        const message = document.createElement('p');
        message.className = 'no-assignments';
        message.textContent = 'No assignments added yet. Add your first assignment above!';
        assignmentsListContainer.appendChild(message);
    } else {
        assignments.forEach(assignment => {
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'assignment-name';
            nameSpan.textContent = assignment.name;

            const gradeSpan = document.createElement('span');
            gradeSpan.className = 'assignment-grade';
            gradeSpan.textContent = `: ${assignment.grade.toFixed(1)}`;

            assignmentItem.appendChild(nameSpan);
            assignmentItem.appendChild(gradeSpan);
            assignmentsListContainer.appendChild(assignmentItem);
        });
    }
    if (gpaValueDisplay) {
        gpaValueDisplay.textContent = calculateGPA();
    }
}

/**
 * @function saveAssignmentsToLocalStorage
 * @description Saves the current 'assignments' array to the browser's localStorage.
 * The array is first converted to a JSON string.
 */
function saveAssignmentsToLocalStorage() {
    try {
        localStorage.setItem('gpaCalculatorAssignments', JSON.stringify(assignments));
    } catch (error) {
        console.error('Error saving assignments to local storage:', error);
    }
}

/**
 * @function loadAssignmentsFromLocalStorage
 * @description Loads assignments from the browser's localStorage into the 'assignments' array.
 * The stored JSON string is parsed back into a JavaScript array.
 */
function loadAssignmentsFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('gpaCalculatorAssignments');
        if (storedData) {
            assignments = JSON.parse(storedData);
            if (!Array.isArray(assignments)) {
                console.warn('LocalStorage data is not an array. Resetting assignments.');
                assignments = [];
            }
        } else {
            assignments = [];
        }
    } catch (error) {
        console.error('Error loading or parsing assignments from local storage:', error);
        assignments = [];
    }
    renderAssignments();
}

/**
 * @function handleAddAssignment
 * @description Event handler for the form submission.
 * It retrieves input values, validates them, adds the assignment to the array,
 * saves to local storage, and updates the UI.
 * @param {Event} event - The form submission event.
 */
function handleAddAssignment(event) {
    event.preventDefault();
    const name = assignmentNameInput.value.trim();
    const grade = parseFloat(assignmentGradeInput.value);
    if (validationMessageDisplay) {
        validationMessageDisplay.textContent = '';
    }
    if (!name) {
        if (validationMessageDisplay) {
            validationMessageDisplay.textContent = 'Please enter an assignment name.';
        }
        return;
    }
    if (isNaN(grade) || grade < 1 || grade > 5) {
        if (validationMessageDisplay) {
            validationMessageDisplay.textContent = 'Please enter a valid grade between 1 and 5 (e.g., 4.5).';
        }
        return;
    }
    assignments.push({ name, grade });
    saveAssignmentsToLocalStorage();
    renderAssignments();
    assignmentNameInput.value = '';
    assignmentGradeInput.value = '';
    assignmentNameInput.focus();
}

/**
 * @function handleKeyboardLogData
 * @description Event handler for keyboard key presses.
 * @param {KeyboardEvent} event 
 */
function handleKeyboardLogData(event) {
    if (event.key === 's' || event.key === 'S') {
        console.log('--- GPA Calculator Data Log ---');
        console.log('Assignments:', assignments);
        console.log('Current GPA:', calculateGPA());
        console.log('-------------------------------');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    assignmentForm = document.getElementById('assignmentForm');
    assignmentNameInput = document.getElementById('assignmentName');
    assignmentGradeInput = document.getElementById('assignmentGrade');
    gpaValueDisplay = document.getElementById('gpaValue');
    assignmentsListContainer = document.getElementById('assignmentsList'); 
    validationMessageDisplay = document.getElementById('validationMessage');
    if (assignmentForm) { 
        assignmentForm.addEventListener('submit', handleAddAssignment);
    } else {
        console.error("Error: 'assignmentForm' element not found.");
    }
    document.addEventListener('keydown', handleKeyboardLogData);
    loadAssignmentsFromLocalStorage();
});
