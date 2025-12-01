// Teacher Assignments Management
document.addEventListener('DOMContentLoaded', function() {
    loadTeacherAssignments();
});

async function loadTeacherAssignments() {
    try {
        const response = await fetch('../php/api/teacher_assignments.php');
        const data = await response.json();
        
        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }

        // Update statistics
        document.getElementById('totalAssignments').textContent = data.stats.total_assignments;
        document.getElementById('pendingGrading').textContent = data.stats.pending_grading;
        document.getElementById('activeAssignments').textContent = data.stats.active_assignments;
        document.getElementById('submittedCount').textContent = data.stats.submitted_count;

        // Display assignments
        displayAssignments(data.assignments);

    } catch (error) {
        console.error('Error loading assignments:', error);
        showNotification('Failed to load assignments', 'error');
    }
}

function displayAssignments(assignments) {
    const container = document.getElementById('assignmentsContainer');
    
    if (!assignments || assignments.length === 0) {
        container.innerHTML = `
            <div class="no-assignments">
                <i class="fas fa-file-alt"></i>
                <h3>No Assignments Yet</h3>
                <p>Create your first assignment to get started</p>
                <button class="btn btn-primary" onclick="location.href='create_assignment.html'">
                    Create Assignment
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = assignments.map(assignment => `
        <div class="assignment-card">
            <div class="assignment-card-header">
                <h3 class="assignment-title">${assignment.title}</h3>
                <div class="assignment-status status-${assignment.status}">
                    ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </div>
            </div>
            
            <div class="assignment-meta">
                <span><i class="fas fa-book"></i> ${assignment.subject_name}</span>
                <span><i class="fas fa-users"></i> ${assignment.class_name}</span>
                <span><i class="fas fa-star"></i> ${assignment.total_marks} marks</span>
                <span><i class="fas fa-clock"></i> Due: ${formatDateTime(assignment.due_date)}</span>
            </div>
            
            <div class="assignment-description">
                ${assignment.description || 'No description provided'}
            </div>
            
            <div class="assignment-stats">
                <span class="stat-item">
                    <i class="fas fa-paper-plane"></i>
                    ${assignment.submission_count || 0} / ${assignment.total_students || 0} submitted
                </span>
                <span class="stat-item">
                    <i class="fas fa-calendar"></i>
                    Created: ${formatDate(assignment.created_at)}
                </span>
            </div>
            
            <div class="assignment-actions">
                <button class="btn btn-primary btn-small" onclick="viewSubmissions(${assignment.id})">
                    <i class="fas fa-eye"></i> View Submissions
                </button>
                <button class="btn btn-secondary btn-small" onclick="editAssignment(${assignment.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                ${assignment.attachment_path ? `
                <button class="btn btn-outline btn-small" onclick="downloadFile('${assignment.attachment_path}')">
                    <i class="fas fa-download"></i> Attachment
                </button>
                ` : ''}
                <button class="btn btn-danger btn-small" onclick="deleteAssignment(${assignment.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function viewSubmissions(assignmentId) {
    // This will be implemented in the submissions modal
    showSubmissionsModal(assignmentId);
}

function editAssignment(assignmentId) {
    window.location.href = `create_assignment.html?edit=${assignmentId}`;
}

async function deleteAssignment(assignmentId) {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('../php/api/delete_assignment.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ assignment_id: assignmentId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Assignment deleted successfully', 'success');
            loadTeacherAssignments(); // Refresh the list
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to delete assignment', 'error');
    }
}

function filterAssignments() {
    const filter = document.getElementById('assignmentFilter').value;
    // Implementation for filtering assignments
    console.log('Filter by:', filter);
}

// Utility functions
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function showNotification(message, type) {
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