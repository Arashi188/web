// Exam Results System
let examResults = null;
let questions = [];

document.addEventListener('DOMContentLoaded', function() {
    loadExamResults();
});

async function loadExamResults() {
    try {
        // Get attempt ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const attemptId = urlParams.get('attempt_id');
        
        if (!attemptId) {
            showError('No exam results specified');
            setTimeout(() => window.location.href = 'student-exam.html', 3000);
            return;
        }
        
        // Load results from API
        const response = await fetch(`../php/api/get_exam_results.php?attempt_id=${attemptId}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        examResults = data.results;
        questions = data.questions;
        
        // Update UI
        updateResultsUI();
        displayQuestions();
        updateInsights();
        
        // Animate progress circle
        animateProgressCircle();
        
    } catch (error) {
        console.error('Error loading exam results:', error);
        showError('Failed to load exam results');
    }
}

function updateResultsUI() {
    // Update header information
    document.getElementById('examTitle').textContent = examResults.exam_title;
    document.getElementById('resultSubject').textContent = examResults.subject_name;
    document.getElementById('dateTaken').textContent = formatDateTime(examResults.submitted_at);
    document.getElementById('timeSpent').textContent = formatTime(examResults.time_spent);
    
    // Update score breakdown
    document.getElementById('totalMarks').textContent = examResults.total_marks;
    document.getElementById('marksObtained').textContent = examResults.marks_obtained;
    document.getElementById('scorePercentage').textContent = `${examResults.percentage}%`;
    
    // Update grade and status
    const grade = calculateGrade(examResults.percentage);
    const gradeElement = document.getElementById('examGrade');
    gradeElement.textContent = grade;
    gradeElement.className = `grade-badge grade-${grade}`;
    
    const status = examResults.percentage >= (examResults.passing_percentage || 40) ? 'passed' : 'failed';
    const statusElement = document.getElementById('examStatus');
    statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    statusElement.className = `status-badge status-${status}`;
}

function animateProgressCircle() {
    const percentage = examResults.percentage;
    const circle = document.getElementById('progressCircle');
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    // Animate the circle
    circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 500);
}

function displayQuestions() {
    const container = document.getElementById('questionsContainer');
    
    if (!questions || questions.length === 0) {
        container.innerHTML = '<p>No questions data available.</p>';
        return;
    }
    
    container.innerHTML = questions.map((question, index) => `
        <div class="question-item ${getQuestionStatus(question)}" data-question-id="${question.id}">
            <div class="question-header">
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-marks">
                    <span class="marks-obtained">${question.marks_obtained || 0}</span>
                    <span class="marks-total">/ ${question.marks}</span>
                </div>
            </div>
            
            <div class="question-text">${question.question_text}</div>
            
            <div class="answer-section">
                ${question.question_type === 'multiple_choice' || question.question_type === 'true_false' ? `
                    <div class="answer-box correct-answer">
                        <h5>Correct Answer</h5>
                        <div class="answer-content">${getCorrectAnswerText(question)}</div>
                    </div>
                    <div class="answer-box your-answer ${question.marks_obtained === question.marks ? 'correct' : 'incorrect'}">
                        <h5>Your Answer</h5>
                        <div class="answer-content">${question.student_answer || 'Not answered'}</div>
                    </div>
                ` : `
                    <div class="answer-box your-answer ${question.marks_obtained === question.marks ? 'correct' : 'incorrect'}">
                        <h5>Your Answer</h5>
                        <div class="answer-content">${question.student_answer || 'Not answered'}</div>
                    </div>
                `}
            </div>
            
            ${question.explanation ? `
                <div class="feedback-section">
                    <h5>Explanation</h5>
                    <p>${question.explanation}</p>
                </div>
            ` : ''}
            
            ${question.teacher_feedback ? `
                <div class="feedback-section">
                    <h5>Teacher Feedback</h5>
                    <p>${question.teacher_feedback}</p>
                </div>
            ` : ''}
            
            ${question.explanation || question.teacher_feedback ? `
                <button class="view-solution-btn" onclick="viewSolution(${index})">
                    <i class="fas fa-lightbulb"></i> View Detailed Solution
                </button>
            ` : ''}
        </div>
    `).join('');
}

function getQuestionStatus(question) {
    if (question.marks_obtained === null) return 'ungraded';
    if (question.marks_obtained === question.marks) return 'correct';
    return 'incorrect';
}

function getCorrectAnswerText(question) {
    if (question.question_type === 'multiple_choice') {
        const options = {
            'A': question.option_a,
            'B': question.option_b,
            'C': question.option_c,
            'D': question.option_d,
            'E': question.option_e
        };
        return options[question.correct_answer] || question.correct_answer;
    } else if (question.question_type === 'true_false') {
        return question.correct_answer === 'true' ? 'True' : 'False';
    }
    return question.correct_answer || 'No correct answer provided';
}

function filterQuestions(filterType) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const questions = document.querySelectorAll('.question-item');
    
    questions.forEach(question => {
        switch (filterType) {
            case 'all':
                question.style.display = 'block';
                break;
            case 'correct':
                question.style.display = question.classList.contains('correct') ? 'block' : 'none';
                break;
            case 'incorrect':
                question.style.display = question.classList.contains('incorrect') ? 'block' : 'none';
                break;
            case 'ungraded':
                question.style.display = question.classList.contains('ungraded') ? 'block' : 'none';
                break;
        }
    });
}

function updateInsights() {
    // Calculate statistics
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => q.marks_obtained === q.marks).length;
    const incorrectAnswers = questions.filter(q => q.marks_obtained !== null && q.marks_obtained < q.marks).length;
    const ungraded = questions.filter(q => q.marks_obtained === null).length;
    
    // Accuracy rate
    const accuracyRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    document.getElementById('accuracyRate').textContent = `${accuracyRate}%`;
    
    // Performance trend
    const performanceTrend = examResults.percentage >= 70 ? 'Excellent' :
                            examResults.percentage >= 50 ? 'Good' :
                            examResults.percentage >= 40 ? 'Needs Improvement' : 'Poor';
    document.getElementById('performanceTrend').textContent = performanceTrend;
    
    // Time management
    const timePerQuestion = examResults.time_spent / totalQuestions;
    const timeManagement = timePerQuestion < 60 ? 'Excellent' :
                          timePerQuestion < 120 ? 'Good' :
                          timePerQuestion < 180 ? 'Fair' : 'Needs Improvement';
    document.getElementById('timeManagement').textContent = timeManagement;
    
    // Recommendations
    let recommendations = [];
    if (ungraded > 0) {
        recommendations.push('Awaiting teacher grading');
    }
    if (incorrectAnswers > totalQuestions * 0.3) {
        recommendations.push('Review weak topics');
    }
    if (accuracyRate < 70) {
        recommendations.push('Practice more questions');
    }
    if (recommendations.length === 0) {
        recommendations.push('Keep up the good work!');
    }
    
    document.getElementById('recommendations').textContent = recommendations.join(', ');
}

function viewSolution(questionIndex) {
    const question = questions[questionIndex];
    
    let solutionContent = `
        <h4>Question ${questionIndex + 1}</h4>
        <div class="question-text">${question.question_text}</div>
        
        <div class="solution-details">
            <div class="detail-item">
                <span>Question Type:</span>
                <strong>${question.question_type.replace('_', ' ').toUpperCase()}</strong>
            </div>
            <div class="detail-item">
                <span>Marks:</span>
                <strong>${question.marks}</strong>
            </div>
            <div class="detail-item">
                <span>Your Score:</span>
                <strong>${question.marks_obtained || 0}/${question.marks}</strong>
            </div>
        </div>
    `;
    
    if (question.question_type === 'multiple_choice') {
        const options = [
            { letter: 'A', text: question.option_a },
            { letter: 'B', text: question.option_b },
            { letter: 'C', text: question.option_c },
            { letter: 'D', text: question.option_d },
            { letter: 'E', text: question.option_e }
        ].filter(opt => opt.text);
        
        solutionContent += `
            <div class="options-list">
                <h5>Options:</h5>
                ${options.map(opt => `
                    <div class="option ${opt.letter === question.correct_answer ? 'correct' : ''} 
                         ${opt.letter === question.student_answer ? 'selected' : ''}">
                        <span class="option-letter">${opt.letter}</span>
                        <span class="option-text">${opt.text}</span>
                        ${opt.letter === question.correct_answer ? '<span class="correct-badge">Correct</span>' : ''}
                        ${opt.letter === question.student_answer && opt.letter !== question.correct_answer ? 
                          '<span class="incorrect-badge">Your Answer</span>' : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (question.correct_answer && question.question_type !== 'multiple_choice') {
        solutionContent += `
            <div class="correct-answer-box">
                <h5>Correct Answer:</h5>
                <div class="answer">${getCorrectAnswerText(question)}</div>
            </div>
        `;
    }
    
    if (question.explanation) {
        solutionContent += `
            <div class="explanation-box">
                <h5>Explanation:</h5>
                <div class="explanation">${question.explanation}</div>
            </div>
        `;
    }
    
    if (question.teacher_feedback) {
        solutionContent += `
            <div class="feedback-box">
                <h5>Teacher Feedback:</h5>
                <div class="feedback">${question.teacher_feedback}</div>
            </div>
        `;
    }
    
    document.getElementById('solutionContent').innerHTML = solutionContent;
    document.getElementById('solutionModal').style.display = 'block';
}

// Utility Functions
function calculateGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Action Functions
function printResults() {
    window.print();
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: `My Exam Results: ${examResults.exam_title}`,
            text: `I scored ${examResults.percentage}% on ${examResults.exam_title}!`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showNotification('Results link copied to clipboard!', 'success');
    }
}

function retakeExam() {
    if (confirm('Are you sure you want to retake this exam? Your previous score will be kept in history.')) {
        window.location.href = `take_exam.html?exam_id=${examResults.exam_id}`;
    }
}

function viewSolutions() {
    // Scroll to questions section
    document.querySelector('.questions-review').scrollIntoView({ behavior: 'smooth' });
}

function goToExams() {
    window.location.href = 'student-exam.html';
}

function closeSolutionModal() {
    document.getElementById('solutionModal').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f8d7da;
        color: #721c24;
        padding: 2rem;
        border-radius: 10px;
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
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
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
    `;
    
    notification.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('solutionModal');
    if (event.target === modal) {
        closeSolutionModal();
    }
}