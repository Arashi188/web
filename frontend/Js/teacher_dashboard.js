// Teacher Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    loadTeacherDashboard();
    loadQuickGradeData();
});

async function loadTeacherDashboard() {
    try {
        const response = await fetch('../php/api/teacher_dashboard.php');
        const data = await response.json();
        
        if (data.error) {
            showNotification(data.error, 'error');
            return;
        }
        
        // Update dashboard stats
        document.getElementById('teacherName').textContent = data.teacher_name;
        document.getElementById('totalStudents').textContent = data.stats.total_students;
        document.getElementById('totalSubjects').textContent = data.stats.total_subjects;
        document.getElementById('pendingGrades').textContent = data.stats.pending_grades;
        document.getElementById('todaysClasses').textContent = data.stats.todays_classes;
        
        // Load recent activity
        loadRecentActivity(data.recent_activity);
        
        // Load upcoming deadlines
        loadUpcomingDeadlines(data.upcoming_deadlines);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

function loadRecentActivity(activities = null) {
    const container = document.getElementById('recentActivity');
    
    if (activities) {
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>No recent activity</p>';
    }
}

function loadUpcomingDeadlines(deadlines = null) {
    const container = document.getElementById('upcomingDeadlines');
    
    if (deadlines && deadlines.length > 0) {
        container.innerHTML = deadlines.map(deadline => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${getDeadlineColor(deadline.priority)}">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="activity-content">
                    <h4>${deadline.title}</h4>
                    <p>Due: ${deadline.due_date}</p>
                </div>
                <div class="status-badge status-${deadline.priority}">
                    ${deadline.priority}
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>No upcoming deadlines</p>';
    }
}

function getActivityIcon(type) {
    const icons = {
        'grade': 'fa-edit',
        'attendance': 'fa-clipboard-check',
        'announcement': 'fa-bullhorn',
        'student': 'fa-user-graduate'
    };
    return icons[type] || 'fa-bell';
}

function getDeadlineColor(priority) {
    const colors = {
        'high': '#e74c3c',
        'medium': '#f39c12',
        'low': '#3498db'
    };
    return colors[priority] || '#95a5a6';
}

// Quick Grade Modal Functions
async function loadQuickGradeData() {
    try {
        const response = await fetch('../php/api/teacher_classes.php');
        const data = await response.json();
        
        if (data.classes) {
            const classSelect = document.getElementById('gradeClass');
            classSelect.innerHTML = '<option value="">Select Class</option>' +
                data.classes.map(cls => 
                    `<option value="${cls.id}">${cls.class_name} ${cls.section ? `- ${cls.section}` : ''}</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error loading class data:', error);
    }
}

document.getElementById('gradeClass').addEventListener('change', async function() {
    const classId = this.value;
    const subjectSelect = document.getElementById('gradeSubject');
    const studentSelect = document.getElementById('gradeStudent');
    
    if (!classId) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        studentSelect.innerHTML = '<option value="">Select Student</option>';
        return;
    }
    
    try {
        // Load subjects for this class
        const subjectResponse = await fetch(`../php/api/class_subjects.php?class_id=${classId}`);
        const subjectData = await subjectResponse.json();
        
        subjectSelect.innerHTML = '<option value="">Select Subject</option>' +
            subjectData.subjects.map(sub => 
                `<option value="${sub.id}">${sub.subject_name}</option>`
            ).join('');
        
        // Load students for this class
        const studentResponse = await fetch(`../php/api/class_students.php?class_id=${classId}`);
        const studentData = await studentResponse.json();
        
        studentSelect.innerHTML = '<option value="">Select Student</option>' +
            studentData.students.map(student => 
                `<option value="${student.id}">${student.first_name} ${student.last_name} (${student.roll_number})</option>`
            ).join('');
            
    } catch (error) {
        console.error('Error loading class details:', error);
    }
});

function showAddGradeModal() {
    document.getElementById('gradeModal').style.display = 'block';
}

function closeGradeModal() {
    document.getElementById('gradeModal').style.display = 'none';
    document.getElementById('quickGradeForm').reset();
}

document.getElementById('quickGradeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('../php/api/add_grade.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Grade added successfully!', 'success');
            closeGradeModal();
            loadTeacherDashboard(); // Refresh dashboard
        } else {
            showNotification(result.error, 'error');
        }
    } catch (error) {
        showNotification('Failed to add grade', 'error');
    }
});

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('gradeModal');
    if (event.target === modal) {
        closeGradeModal();
    }
}