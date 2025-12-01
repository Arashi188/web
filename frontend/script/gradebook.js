// Gradebook Management System
let currentPage = 1;
const itemsPerPage = 10;
let totalItems = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadGradebookFilters();
    loadGradebookData();
});

// Load filter options
async function loadGradebookFilters() {
    try {
        // Load classes
        const classResponse = await fetch('../php/api/teacher_classes.php');
        const classData = await classResponse.json();
        
        if (classData.classes) {
            const classSelect = document.getElementById('filterClass');
            classSelect.innerHTML = '<option value="">All Classes</option>' +
                classData.classes.map(cls => 
                    `<option value="${cls.id}">${cls.class_name} ${cls.section ? `- ${cls.section}` : ''}</option>`
                ).join('');
        }

        // Load subjects for bulk modal
        const bulkClassSelect = document.getElementById('bulkClass');
        bulkClassSelect.innerHTML = '<option value="">Select Class</option>' +
            classData.classes.map(cls => 
                `<option value="${cls.id}">${cls.class_name} ${cls.section ? `- ${cls.section}` : ''}</option>`
            ).join('');

    } catch (error) {
        console.error('Error loading filters:', error);
        showNotification('Failed to load filter options', 'error');
    }
}

// Load gradebook data with filters
async function loadGradebookData(page = 1) {
    currentPage = page;
    
    const classId = document.getElementById('filterClass').value;
    const subjectId = document.getElementById('filterSubject').value;
    const term = document.getElementById('filterTerm').value;
    
    try {
        // Show loading state
        document.getElementById('gradebookBody').innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem;">
                    <div class="spinner"></div> Loading grades...
                </td>
            </tr>
        `;

        const params = new URLSearchParams({
            page: page,
            limit: itemsPerPage,
            ...(classId && { class_id: classId }),
            ...(subjectId && { subject_id: subjectId }),
            ...(term && { term: term })
        });

        const response = await fetch(`../php/api/gradebook.php?${params}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        totalItems = data.total || 0;
        displayGradebookData(data.grades);
        displayGradebookStats(data.stats);
        setupPagination();

    } catch (error) {
        console.error('Error loading gradebook:', error);
        document.getElementById('gradebookBody').innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #dc3545;">
                    <i class="fas fa-exclamation-triangle"></i> Failed to load grades
                </td>
            </tr>
        `;
    }
}

// Display gradebook data in table
function displayGradebookData(grades) {
    const tbody = document.getElementById('gradebookBody');
    
    if (!grades || grades.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-inbox"></i> No grades found matching your filters
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = grades.map(grade => `
        <tr>
            <td>${grade.student_name}</td>
            <td>${grade.roll_number}</td>
            <td>${grade.class_name}</td>
            <td>${grade.subject_name}</td>
            <td>${grade.term}</td>
            <td>
                <strong>${grade.marks || '-'}</strong>
            </td>
            <td>
                ${grade.grade ? `<span class="grade-badge grade-${grade.grade}">${grade.grade}</span>` : '-'}
            </td>
            <td>${grade.last_updated ? new Date(grade.last_updated).toLocaleDateString() : '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="editGrade(${grade.id})" title="Edit Grade">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteGrade(${grade.id})" title="Delete Grade">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Display gradebook statistics
function displayGradebookStats(stats) {
    const statsContainer = document.getElementById('gradebookStats');
    
    if (!stats) {
        statsContainer.innerHTML = '';
        return;
    }

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.total_grades || 0}</div>
            <div class="stat-label">Total Grades</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.average_marks ? stats.average_marks.toFixed(1) : '0'}</div>
            <div class="stat-label">Average Marks</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.graded_students || 0}</div>
            <div class="stat-label">Graded Students</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.unique_subjects || 0}</div>
            <div class="stat-label">Subjects</div>
        </div>
    `;
}

// Setup pagination
function setupPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    pagination.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="loadGradebookData(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Previous
        </button>
        
        <span class="pagination-info">
            Page ${currentPage} of ${totalPages} (${totalItems} total)
        </span>
        
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="loadGradebookData(${currentPage + 1})">
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
}

// Bulk Grade Modal Functions
async function loadBulkGradeStudents() {
    const classId = document.getElementById('bulkClass').value;
    const subjectSelect = document.getElementById('bulkSubject');
    const studentsContainer = document.getElementById('bulkGradeStudents');
    
    if (!classId) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        studentsContainer.innerHTML = '';
        return;
    }
    
    try {
        // Load subjects for selected class
        const subjectResponse = await fetch(`../php/api/class_subjects.php?class_id=${classId}`);
        const subjectData = await subjectResponse.json();
        
        subjectSelect.innerHTML = '<option value="">Select Subject</option>' +
            subjectData.subjects.map(sub => 
                `<option value="${sub.id}">${sub.subject_name}</option>`
            ).join('');
        
        // Load students for selected class
        const studentResponse = await fetch(`../php/api/class_students.php?class_id=${classId}`);
        const studentData = await studentResponse.json();
        
        studentsContainer.innerHTML = studentData.students.map(student => `
            <tr>
                <td>${student.first_name} ${student.last_name}</td>
                <td>${student.roll_number}</td>
                <td>
                    <input type="hidden" name="student_ids[]" value="${student.id}">
                    <input type="number" class="bulk-grade-input" name="marks[]" 
                           min="0" max="100" step="0.01" 
                           oninput="updateBulkGrade(this)" 
                           placeholder="0-100">
                </td>
                <td>
                    <span class="bulk-grade-display" id="grade-${student.id}">-</span>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error loading bulk grade data:', error);
        showNotification('Failed to load student data', 'error');
    }
}

function updateBulkGrade(input) {
    const marks = parseFloat(input.value);
    const studentId = input.name.match(/\d+/)[0];
    const gradeDisplay = document.getElementById(`grade-${studentId}`);
    
    if (!isNaN(marks) && marks >= 0 && marks <= 100) {
        const grade = calculateGrade(marks);
        gradeDisplay.textContent = grade;
        gradeDisplay.className = `bulk-grade-display grade-badge grade-${grade}`;
    } else {
        gradeDisplay.textContent = '-';
        gradeDisplay.className = 'bulk-grade-display';
    }
}

// Calculate grade based on marks
function calculateGrade(marks) {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
}

// Modal Control Functions
function showBulkGradeModal() {
    document.getElementById('bulkGradeModal').style.display = 'block';
    loadBulkGradeStudents(); // Load initial data
}

function closeBulkGradeModal() {
    document.getElementById('bulkGradeModal').style.display = 'none';
    document.getElementById('bulkGradeForm').reset();
    document.getElementById('bulkGradeStudents').innerHTML = '';
}

function closeEditGradeModal() {
    document.getElementById('editGradeModal').style.display = 'none';
    document.getElementById('editGradeForm').reset();
}

// Edit Grade Functions
async function editGrade(gradeId) {
    try {
        const response = await fetch(`../php/api/get_grade.php?id=${gradeId}`);
        const grade = await response.json();
        
        if (grade.error) {
            throw new Error(grade.error);
        }
        
        document.getElementById('editGradeId').value = grade.id;
        document.getElementById('editStudent').value = grade.student_name;
        document.getElementById('editSubject').value = grade.subject_name;
        document.getElementById('editMarks').value = grade.marks || '';
        document.getElementById('editTerm').value = grade.term;
        
        // Update grade preview
        updateGradePreview();
        
        document.getElementById('editGradeModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading grade:', error);
        showNotification('Failed to load grade details', 'error');
    }
}

function updateGradePreview() {
    const marks = parseFloat(document.getElementById('editMarks').value);
    const gradePreview = document.getElementById('gradePreview');
    
    if (!isNaN(marks) && marks >= 0 && marks <= 100) {
        const grade = calculateGrade(marks);
        gradePreview.textContent = grade;
        gradePreview.className = `grade-${grade}`;
    } else {
        gradePreview.textContent = '-';
        gradePreview.className = '';
    }
}

// Event Listeners
document.getElementById('editMarks').addEventListener('input', updateGradePreview);

document.getElementById('bulkGradeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('../php/api/bulk_add_grades.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`Successfully added ${result.added} grades!`, 'success');
            closeBulkGradeModal();
            loadGradebookData(); // Refresh the gradebook
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to save grades', 'error');
    }
});

document.getElementById('editGradeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('../php/api/update_grade.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Grade updated successfully!', 'success');
            closeEditGradeModal();
            loadGradebookData(); // Refresh the gradebook
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to update grade', 'error');
    }
});

// Delete grade function
async function deleteGrade(gradeId) {
    if (!confirm('Are you sure you want to delete this grade? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('../php/api/delete_grade.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ grade_id: gradeId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Grade deleted successfully!', 'success');
            loadGradebookData(); // Refresh the gradebook
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to delete grade', 'error');
    }
}

// Export grades function
async function exportGrades() {
    const classId = document.getElementById('filterClass').value;
    const subjectId = document.getElementById('filterSubject').value;
    const term = document.getElementById('filterTerm').value;
    
    const params = new URLSearchParams({
        ...(classId && { class_id: classId }),
        ...(subjectId && { subject_id: subjectId }),
        ...(term && { term: term })
    });
    
    window.open(`../php/api/export_grades.php?${params}`, '_blank');
}

// Utility function to show notifications
function showNotification(message, type) {
    // Implementation from previous teacher_dashboard.js
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

// Close modals when clicking outside
window.onclick = function(event) {
    const bulkModal = document.getElementById('bulkGradeModal');
    const editModal = document.getElementById('editGradeModal');
    
    if (event.target === bulkModal) closeBulkGradeModal();
    if (event.target === editModal) closeEditGradeModal();
}