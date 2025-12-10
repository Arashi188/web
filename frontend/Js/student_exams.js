// Student Exams Management
document.addEventListener('DOMContentLoaded', function() {
    loadExamStatistics();
    loadUpcomingExams();
    loadActiveExams();
    loadExamHistory();
});

// Load exam statistics
async function loadExamStatistics() {
    try {
        const response = await fetch('../php/api/student_exam_stats.php');
        const stats = await response.json();
        
        if (stats.error) {
            console.error('Error:', stats.error);
            return;
        }
        
        document.getElementById('upcomingCount').textContent = stats.upcoming || 0;
        document.getElementById('completedCount').textContent = stats.completed || 0;
        document.getElementById('averageScore').textContent = stats.average_score ? stats.average_score + '%' : '-';
        document.getElementById('pendingCount').textContent = stats.pending || 0;
        
    } catch (error) {
        console.error('Error loading exam statistics:', error);
    }
}

// Load upcoming exams
async function loadUpcomingExams() {
    try {
        const response = await fetch('../php/api/student_exams.php?type=upcoming');
        const exams = await response.json();
        
        const container = document.getElementById('upcomingExams');
        
        if (!exams || exams.length === 0) {
            container.innerHTML = `
                <div class="no-exams">
                    <i class="fas fa-calendar"></i>
                    <h3>No Upcoming Exams</h3>
                    <p>You don't have any scheduled exams at the moment</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = exams.map(exam => `
            <div class="exam-card upcoming">
                <div class="exam-title">${exam.title}</div>
                <div class="exam-meta">
                    <span><i class="fas fa-book"></i> ${exam.subject_name}</span>
                    <span><i class="fas fa-clock"></i> ${exam.duration_minutes} mins</span>
                </div>
                <div class="exam-meta">
                    <span><i class="fas fa-calendar"></i> ${formatExamDate(exam.start_date)}</span>
                    <span>Total Marks: ${exam.total_marks}</span>
                </div>
                <div class="exam-actions">
                    <button class="btn btn-secondary btn-small" onclick="viewExamDetails(${exam.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    ${exam.start_date && new Date(exam.start_date) > new Date() ? 
                        `<button class="btn btn-primary btn-small" disabled>
                            <i class="fas fa-lock"></i> Starts Soon
                        </button>` :
                        `<button class="btn btn-primary btn-small" onclick="startExam(${exam.id})">
                            <i class="fas fa-play"></i> Start Exam
                        </button>`
                    }
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading upcoming exams:', error);
        document.getElementById('upcomingExams').innerHTML = `
            <div class="no-exams">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Exams</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Load active exams (in progress)
async function loadActiveExams() {
    try {
        const response = await fetch('../php/api/student_exams.php?type=active');
        const exams = await response.json();
        
        const container = document.getElementById('activeExams');
        
        if (!exams || exams.length === 0) {
            container.innerHTML = `
                <div class="no-exams">
                    <i class="fas fa-play-circle"></i>
                    <h3>No Active Exams</h3>
                    <p>You don't have any exams in progress</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = exams.map(exam => `
            <div class="exam-card active">
                <div class="exam-title">${exam.title}</div>
                <div class="exam-meta">
                    <span><i class="fas fa-book"></i> ${exam.subject_name}</span>
                    <span><i class="fas fa-clock"></i> ${formatTimeLeft(exam.time_left)} left</span>
                </div>
                <div class="exam-meta">
                    <span><i class="fas fa-history"></i> Started: ${formatDate(exam.start_time)}</span>
                    <span>Progress: ${exam.progress || 0}%</span>
                </div>
                <div class="exam-actions">
                    <button class="btn btn-warning btn-small" onclick="continueExam(${exam.id})">
                        <i class="fas fa-redo"></i> Continue
                    </button>
                    <button class="btn btn-danger btn-small" onclick="cancelExam(${exam.id})">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading active exams:', error);
        document.getElementById('activeExams').innerHTML = '';
    }
}

// Load exam history
async function loadExamHistory() {
    try {
        const response = await fetch('../php/api/student_exams.php?type=history');
        const history = await response.json();
        
        const container = document.getElementById('examHistory');
        
        if (!history || history.length === 0) {
            container.innerHTML = `
                <div class="no-exams">
                    <i class="fas fa-history"></i>
                    <h3>No Exam History</h3>
                    <p>You haven't completed any exams yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = history.map(item => `
            <div class="history-item" onclick="viewExamResults(${item.attempt_id})">
                <div class="history-info">
                    <h4>${item.exam_title}</h4>
                    <p>${item.subject_name} • ${formatDate(item.submitted_at)} • ${item.duration_minutes} mins</p>
                </div>
                <div class="history-score">
                    <div class="score-value">${item.percentage}%</div>
                    <div class="score-label">${item.total_marks_obtained}/${item.total_marks} marks</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading exam history:', error);
        container.innerHTML = `
            <div class="no-exams">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading History</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Start exam function
function startExam(examId) {
    if (confirm('Are you ready to start the exam? Once started, the timer will begin and you cannot pause.')) {
        window.location.href = `take_exam.html?exam_id=${examId}`;
    }
}

// Continue exam
function continueExam(examId) {
    if (confirm('Continue your exam from where you left off?')) {
        window.location.href = `take_exam.html?exam_id=${examId}&continue=true`;
    }
}

// Cancel exam
async function cancelExam(examId) {
    if (confirm('Are you sure you want to cancel this exam? Your progress will be lost.')) {
        try {
            const response = await fetch(`../php/api/cancel_exam.php?exam_id=${examId}`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Exam cancelled successfully', 'success');
                loadActiveExams();
                loadExamStatistics();
            } else {
                showNotification(result.error, 'error');
            }
        } catch (error) {
            showNotification('Failed to cancel exam', 'error');
        }
    }
}

// View exam details
async function viewExamDetails(examId) {
    try {
        const response = await fetch(`../php/api/get_exam_details.php?id=${examId}`);
        const exam = await response.json();
        
        if (exam.error) {
            throw new Error(exam.error);
        }
        
        document.getElementById('examModalTitle').textContent = exam.title;
        
        const content = `
            <div class="detail-item">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${exam.subject_name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Class:</span>
                <span class="detail-value">${exam.class_name}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${exam.duration_minutes} minutes</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Total Marks:</span>
                <span class="detail-value">${exam.total_marks}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">${formatDateTime(exam.start_date) || 'Anytime'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">End Date:</span>
                <span class="detail-value">${formatDateTime(exam.end_date) || 'No deadline'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Passing Marks:</span>
                <span class="detail-value">${exam.passing_marks || 'Not specified'}</span>
            </div>
            ${exam.description ? `
            <div class="instructions-box">
                <h5>Description:</h5>
                <p>${exam.description}</p>
            </div>
            ` : ''}
            ${exam.instructions ? `
            <div class="instructions-box">
                <h5>Instructions:</h5>
                <p>${exam.instructions}</p>
            </div>
            ` : ''}
        `;
        
        document.getElementById('examDetailsContent').innerHTML = content;
        document.getElementById('examDetailsModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading exam details:', error);
        showNotification('Failed to load exam details', 'error');
    }
}

// View exam results
function viewExamResults(attemptId) {
    window.location.href = `exam_results.html?attempt_id=${attemptId}`;
}

// Close exam details modal
function closeExamDetailsModal() {
    document.getElementById('examDetailsModal').style.display = 'none';
}

// Utility functions
function formatExamDate(dateString) {
    if (!dateString) return 'Anytime';
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatDateTime(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatTimeLeft(seconds) {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('examDetailsModal');
    if (event.target === modal) {
        closeExamDetailsModal();
    }
}