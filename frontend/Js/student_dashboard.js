// Updated Student Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadStudentDashboard();
    loadPendingAssignments();
    loadUpcomingExams();
});

async function loadStudentDashboard() {
    try {
        const response = await fetch('../php/api/student_dashboard.php');
        const data = await response.json();
        
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }
        
        // Update basic info
        document.getElementById('studentName').textContent = data.student_name;
        document.getElementById('studentClass').textContent = data.class_name;
        document.getElementById('rollNumber').textContent = data.roll_number;
        
        // Update stats
        document.getElementById('overallAverage').textContent = data.overall_average ? data.overall_average + '%' : '-';
        document.getElementById('attendancePercent').textContent = data.attendance_percent ? data.attendance_percent + '%' : '-';
        document.getElementById('totalSubjects').textContent = data.total_subjects || '-';
        document.getElementById('notificationCount').textContent = data.notification_count || '0';
        
        // Load recent grades
        loadRecentGrades(data.recent_grades);
        
        // Load upcoming events
        loadUpcomingEvents(data.upcoming_events);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadPendingAssignments() {
    try {
        const response = await fetch('../php/api/student_assignments.php?status=pending');
        const assignments = await response.json();
        
        const container = document.getElementById('pendingAssignments');
        
        if (!assignments || assignments.length === 0) {
            container.innerHTML = '<p>No pending assignments.</p>';
            return;
        }
        
        container.innerHTML = assignments.map(assignment => `
            <div class="assignment-item">
                <div class="assignment-info">
                    <h4>${assignment.title}</h4>
                    <p>${assignment.subject_name} • ${assignment.description || 'No description'}</p>
                </div>
                <div class="assignment-due">
                    <div class="due-date">${formatDate(assignment.due_date)}</div>
                    <div class="due-label">Due Date</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

async function loadUpcomingExams() {
    try {
        const response = await fetch('../php/api/student_exams.php?type=upcoming&limit=3');
        const exams = await response.json();
        
        const container = document.getElementById('upcomingExams');
        
        if (!exams || exams.length === 0) {
            container.innerHTML = '<p>No upcoming exams.</p>';
            return;
        }
        
        container.innerHTML = exams.map(exam => `
            <div class="exam-item">
                <div class="exam-info">
                    <h4>${exam.title}</h4>
                    <p>${exam.subject_name} • ${exam.duration_minutes} minutes</p>
                </div>
                <div class="exam-date">
                    <div class="exam-time">${formatExamDate(exam.start_date)}</div>
                    <div class="exam-duration">${exam.total_marks} marks</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading upcoming exams:', error);
    }
}

function loadRecentGrades(grades) {
    const container = document.getElementById('recentGrades');
    
    if (!grades || grades.length === 0) {
        container.innerHTML = '<p>No recent grades available.</p>';
        return;
    }
    
    // Your existing grades loading code here
}

function loadUpcomingEvents(events) {
    const container = document.getElementById('upcomingEvents');
    
    if (!events || events.length === 0) {
        container.innerHTML = '<p>No upcoming events.</p>';
        return;
    }
    
    // Your existing events loading code here
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatExamDate(dateString) {
    if (!dateString) return 'Anytime';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}