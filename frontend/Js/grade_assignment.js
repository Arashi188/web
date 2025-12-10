// Assignment Grading System
let currentAssignmentId = null;
let submissions = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Get assignment ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get('assignment_id');
    
    if (assignmentId) {
        currentAssignmentId = assignmentId;
        loadAssignmentDetails(assignmentId);
        loadSubmissions(assignmentId);
    } else {
        showNotification('No assignment selected', 'error');
        setTimeout(() => {
            window.location.href = 'assignments.html';
        }, 2000);
    }
});

async function loadAssignmentDetails(assignmentId) {
    try {
        const response = await fetch(`../php/api/get_assignment_details.php?id=${assignmentId}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Update assignment info
        document.getElementById('assignmentTitle').textContent = `Grade: ${data.title}`;
        document.getElementById('detailSubject').textContent = data.subject_name;
        document.getElementById('detailClass').textContent = data.class_name;
        document.getElementById('detailTotalMarks').textContent = data.total_marks;
        document.getElementById('detailDueDate').textContent = formatDateTime(data.due_date);
        document.getElementById('detailSubmissions').textContent = `${data.submission_count} / ${data.total_students}`;
        document.getElementById('detailGraded').textContent = data.graded_count || 0;
        
        // Store max marks for grading
        document.getElementById('maxMarks').textContent = data.total_marks;
        
    } catch (error) {
        console.error('Error loading assignment details:', error);
        showNotification('Failed to load assignment details', 'error');
    }
}

async function loadSubmissions(assignmentId) {
    try {
        const response = await fetch(`../php/api/get_submissions.php?assignment_id=${assignmentId}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        submissions = data.submissions;
        displaySubmissions(submissions);
        
    } catch (error) {
        console.error('Error loading submissions:', error);
        showNotification('Failed to load submissions', 'error');
    }
}

function displaySubmissions(submissionsList) {
    const container = document.getElementById('submissionsList');
    
    if (!submissionsList || submissionsList.length === 0) {
        container.innerHTML = `
            <div class="no-submissions">
                <i class="fas fa-inbox"></i>
                <h3>No Submissions Yet</h3>
                <p>Students haven't submitted this assignment yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = submissionsList.map((submission, index) => `
        <div class="submission-item" data-index="${index}">
            <div class="student-info">
                <div class="student-name">${submission.student_name}</div>
                <div class="student-meta">
                    <span>Roll No: ${submission.roll_number}</span>
                    <span>Submitted: ${formatDateTime(submission.submitted_at)}</span>
                    ${submission.marks_obtained ? `<span>Score: ${submission.marks_obtained}/${submission.total_marks}</span>` : ''}
                </div>
            </div>
            <div class="submission-meta">
                <div class="submission-date">${formatDate(submission.submitted_at)}</div>
                <div class="submission-status status-${submission.status}">
                    ${getStatusText(submission.status)}
                </div>
                <button class="btn btn-primary btn-small" onclick="openGradingModal(${index})">
                    ${submission.marks_obtained ? '<i class="fas fa-edit"></i> Regrade' : '<i class="fas fa-check"></i> Grade'}
                </button>
            </div>
        </div>
    `).join('');
}

function openGradingModal(index) {
    currentIndex = index;
    const submission = submissions[index];
    
    // Set modal title
    document.getElementById('gradingModalTitle').textContent = `Grade: ${submission.student_name}`;
    
    // Set student info
    document.getElementById('studentName').textContent = submission.student_name;
    document.getElementById('studentDetails').textContent = 
        `Roll No: ${submission.roll_number} | Submitted: ${formatDateTime(submission.submitted_at)}`;
    
    // Set assignment instructions
    document.getElementById('assignmentInstructions').innerHTML = 
        submission.assignment_description || 'No instructions provided';
    
    // Show assignment attachment if exists
    const assignmentAttachment = document.getElementById('assignmentAttachment');
    if (submission.assignment_attachment) {
        assignmentAttachment.innerHTML = `
            <div class="attachment-item">
                <i class="fas fa-paperclip"></i>
                <a href="${submission.assignment_attachment}" target="_blank">Download Assignment File</a>
            </div>
        `;
    } else {
        assignmentAttachment.innerHTML = '';
    }
    
    // Set student submission
    document.getElementById('studentSubmission').innerHTML = 
        submission.submission_text || 'No text submission';
    
    // Show student attachment if exists
    const submissionAttachment = document.getElementById('submissionAttachment');
    if (submission.submission_attachment) {
        submissionAttachment.innerHTML = `
            <div class="attachment-item">
                <i class="fas fa-paperclip"></i>
                <a href="${submission.submission_attachment}" target="_blank">Download Student's File</a>
            </div>
        `;
    } else {
        submissionAttachment.innerHTML = '';
    }
    
    // Set form values
    document.getElementById('submissionId').value = submission.submission_id;
    document.getElementById('marksObtained').value = submission.marks_obtained || '';
    document.getElementById('teacherFeedback').value = submission.teacher_feedback || '';
    
    // Update percentage
    updateGradePercentage();
    
    // Show modal
    document.getElementById('gradingModal').style.display = 'block';
}

function updateGradePercentage() {
    const marksObtained = parseFloat(document.getElementById('marksObtained').value);
    const maxMarks = parseFloat(document.getElementById('maxMarks').textContent);
    
    if (!isNaN(marksObtained) && maxMarks > 0) {
        const percentage = ((marksObtained / maxMarks) * 100).toFixed(1);
        document.getElementById('gradePercentage').value = `${percentage}%`;
    } else {
        document.getElementById('gradePercentage').value = '';
    }
}

async function submitGrade(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const marksObtained = parseFloat(formData.get('marks_obtained'));
    const maxMarks = parseFloat(document.getElementById('maxMarks').textContent);
    
    if (marksObtained > maxMarks) {
        showNotification(`Marks cannot exceed ${maxMarks}`, 'error');
        return;
    }
    
    try {
        const response = await fetch('../php/api/submit_grade.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Grade submitted successfully', 'success');
            
            // Update the submission in our array
            submissions[currentIndex].marks_obtained = marksObtained;
            submissions[currentIndex].teacher_feedback = formData.get('teacher_feedback');
            submissions[currentIndex].status = 'graded';
            
            // Update display
            displaySubmissions(submissions);
            
            // Update assignment stats
            loadAssignmentDetails(currentAssignmentId);
            
            // Close modal
            closeGradingModal();
            
            // Auto-advance to next ungraded submission
            autoAdvanceToNext();
            
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to submit grade', 'error');
    }
}

function autoAdvanceToNext() {
    // Find next ungraded submission
    const nextIndex = submissions.findIndex((sub, index) => 
        index > currentIndex && !sub.marks_obtained
    );
    
    if (nextIndex !== -1) {
        setTimeout(() => {
            openGradingModal(nextIndex);
        }, 1000);
    }
}

function skipGrading() {
    closeGradingModal();
    autoAdvanceToNext();
}

function closeGradingModal() {
    document.getElementById('gradingModal').style.display = 'none';
    document.getElementById('gradingForm').reset();
}

function filterSubmissions() {
    const filter = document.getElementById('submissionFilter').value;
    
    let filteredSubmissions = submissions;
    
    switch (filter) {
        case 'ungraded':
            filteredSubmissions = submissions.filter(sub => !sub.marks_obtained);
            break;
        case 'graded':
            filteredSubmissions = submissions.filter(sub => sub.marks_obtained);
            break;
        case 'late':
            filteredSubmissions = submissions.filter(sub => sub.status === 'late');
            break;
    }
    
    displaySubmissions(filteredSubmissions);
}

// Utility functions
function getStatusText(status) {
    switch (status) {
        case 'submitted': return 'Submitted';
        case 'graded': return 'Graded';
        case 'late': return 'Late';
        default: return 'Not Submitted';
    }
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Event listeners
document.getElementById('marksObtained').addEventListener('input', updateGradePercentage);

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('gradingModal');
    if (event.target === modal) {
        closeGradingModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (document.getElementById('gradingModal').style.display === 'block') {
        // Escape to close modal
        if (event.key === 'Escape') {
            closeGradingModal();
        }
        // Ctrl + Enter to submit
        if (event.ctrlKey && event.key === 'Enter') {
            document.getElementById('gradingForm').dispatchEvent(new Event('submit'));
        }
    }
});

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