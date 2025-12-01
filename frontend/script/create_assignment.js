// Create Assignment Functionality
let currentAssignmentId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadClassOptions();
    setupFormValidation();
    setupPreviewUpdates();
    
    // Check if editing existing assignment
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
        loadAssignmentForEdit(editId);
    }
});

async function loadClassOptions() {
    try {
        const response = await fetch('../php/api/teacher_classes.php');
        const data = await response.json();
        
        if (data.classes) {
            const classSelect = document.getElementById('assignmentClass');
            classSelect.innerHTML = '<option value="">Select Class</option>' +
                data.classes.map(cls => 
                    `<option value="${cls.id}">${cls.class_name} ${cls.section ? `- ${cls.section}` : ''}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error loading classes:', error);
        showNotification('Failed to load classes', 'error');
    }
}

async function loadClassSubjects() {
    const classId = document.getElementById('assignmentClass').value;
    const subjectSelect = document.getElementById('assignmentSubject');
    
    if (!classId) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        return;
    }
    
    try {
        const response = await fetch(`../php/api/class_subjects.php?class_id=${classId}`);
        const data = await response.json();
        
        subjectSelect.innerHTML = '<option value="">Select Subject</option>' +
            data.subjects.map(sub => 
                `<option value="${sub.id}">${sub.subject_name}</option>`
            ).join('');
            
    } catch (error) {
        console.error('Error loading subjects:', error);
        showNotification('Failed to load subjects', 'error');
    }
}

function setupFormValidation() {
    const form = document.getElementById('assignmentForm');
    const dueDateInput = document.getElementById('dueDate');
    
    // Set minimum due date to current time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dueDateInput.min = now.toISOString().slice(0, 16);
    
    // File upload handling
    const fileInput = document.getElementById('assignmentAttachment');
    const fileInfo = document.getElementById('fileInfo');
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
        } else {
            fileInfo.textContent = 'No file chosen';
        }
    });
}

function setupPreviewUpdates() {
    // Update preview when form fields change
    const formFields = ['assignmentTitle', 'assignmentClass', 'assignmentSubject', 'totalMarks', 'dueDate', 'assignmentDescription'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updatePreview);
        }
    });
}

function updatePreview() {
    document.getElementById('previewTitle').textContent = document.getElementById('assignmentTitle').value || 'Assignment Title';
    
    const classSelect = document.getElementById('assignmentClass');
    const selectedClass = classSelect.options[classSelect.selectedIndex];
    document.getElementById('previewClass').textContent = `Class: ${selectedClass.text || '-'}`;
    
    const subjectSelect = document.getElementById('assignmentSubject');
    const selectedSubject = subjectSelect.options[subjectSelect.selectedIndex];
    document.getElementById('previewSubject').textContent = `Subject: ${selectedSubject.text || '-'}`;
    
    document.getElementById('previewMarks').textContent = `Marks: ${document.getElementById('totalMarks').value || '-'}`;
    
    const dueDate = document.getElementById('dueDate').value;
    document.getElementById('previewDueDate').textContent = `Due: ${dueDate ? formatDateTime(dueDate) : '-'}`;
    
    document.getElementById('previewDescription').textContent = 
        document.getElementById('assignmentDescription').value || 'Assignment description will appear here...';
}

async function saveAssignment(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate due date
    const dueDate = new Date(formData.get('due_date'));
    const now = new Date();
    if (dueDate <= now) {
        showNotification('Due date must be in the future', 'error');
        return;
    }
    
    try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner"></div> Saving...';
        submitBtn.disabled = true;
        
        const response = await fetch('../php/api/create_assignment.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Assignment created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'assignments.html';
            }, 1500);
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to create assignment', 'error');
    } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function saveDraft() {
    document.getElementById('assignmentStatus').value = 'draft';
    document.getElementById('assignmentForm').dispatchEvent(new Event('submit'));
}

async function loadAssignmentForEdit(assignmentId) {
    try {
        const response = await fetch(`../php/api/get_assignment.php?id=${assignmentId}`);
        const assignment = await response.json();
        
        if (assignment.error) {
            throw new Error(assignment.error);
        }
        
        currentAssignmentId = assignmentId;
        
        // Populate form fields
        document.getElementById('assignmentTitle').value = assignment.title;
        document.getElementById('assignmentDescription').value = assignment.description || '';
        document.getElementById('totalMarks').value = assignment.total_marks;
        document.getElementById('dueDate').value = assignment.due_date.slice(0, 16);
        document.getElementById('assignmentInstructions').value = assignment.instructions || '';
        document.getElementById('assignmentStatus').value = assignment.status;
        
        // Load class and subject
        await loadClassOptions();
        document.getElementById('assignmentClass').value = assignment.class_id;
        await loadClassSubjects();
        document.getElementById('assignmentSubject').value = assignment.subject_id;
        
        // Update UI for edit mode
        document.querySelector('.create-assignment-header h1').textContent = 'Edit Assignment';
        document.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Assignment';
        
        updatePreview();
        
    } catch (error) {
        console.error('Error loading assignment:', error);
        showNotification('Failed to load assignment', 'error');
    }
}

// Utility functions
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type) {
    // Same implementation as in teacher_assignments.js
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else {
        notification.style.background = '#e74c3c';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add this function to debug form submission
async function debugFormSubmission(formData) {
    console.log('Form Data Contents:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    // Test the API endpoint directly
    try {
        const testResponse = await fetch('../php/api/create_assignment.php', {
            method: 'POST',
            body: formData
        });
        const result = await testResponse.text();
        console.log('API Response:', result);
    } catch (error) {
        console.error('API Error:', error);
    }
}

// Modify the saveAssignment function to include debugging
async function saveAssignment(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Debug: Check what's being sent
    await debugFormSubmission(formData);
    
    // Rest of your existing code...
}