// Exam Taking System
let examData = null;
let questions = [];
let currentQuestionIndex = 0;
let answers = {};
let timerInterval = null;
let startTime = null;
let totalTime = 0;
let examStarted = false;
let isFullscreen = false;

// DOM Elements
const elements = {
    examTitle: document.getElementById('examTitle'),
    examSubject: document.getElementById('examSubject'),
    timerDisplay: document.getElementById('timer'),
    progressFill: document.getElementById('progressFill'),
    questionNumbers: document.getElementById('questionNumbers'),
    currentQuestionNumber: document.getElementById('currentQuestionNumber'),
    questionMarks: document.getElementById('questionMarks'),
    questionsContainer: document.getElementById('questionsContainer'),
    navButtons: document.getElementById('navButtons'),
    totalQuestions: document.getElementById('totalQuestions'),
    summaryAnswered: document.getElementById('summaryAnswered'),
    summaryUnanswered: document.getElementById('summaryUnanswered'),
    summaryTimeLeft: document.getElementById('summaryTimeLeft'),
    summaryTotalMarks: document.getElementById('summaryTotalMarks'),
    answeredCount: document.getElementById('answeredCount'),
    autoSaveIndicator: document.getElementById('autoSaveIndicator'),
    saveStatus: document.getElementById('saveStatus'),
    lastSave: document.getElementById('lastSave')
};

document.addEventListener('DOMContentLoaded', function() {
    loadExamData();
    setupEventListeners();
    initializeLocalStorage();
});

async function loadExamData() {
    try {
        // Get exam ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const examId = urlParams.get('exam_id');
        const isPractice = urlParams.get('practice') === 'true';

        if (!examId) {
            showError('No exam specified');
            return;
        }

        // Load exam data
        const endpoint = isPractice ? 
            `../php/api/get_practice_exam.php?id=${examId}` :
            `../php/api/get_exam.php?id=${examId}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        examData = data.exam;
        questions = data.questions;

        // Update UI
        updateExamHeader();
        createQuestionNavigation();
        loadQuestion(currentQuestionIndex);
        updateSummary();

        // Check for existing answers
        loadSavedAnswers();

        // Setup auto-save
        startAutoSave();

    } catch (error) {
        console.error('Error loading exam:', error);
        showError('Failed to load exam. Please try again.');
    }
}

function updateExamHeader() {
    elements.examTitle.textContent = examData.title;
    elements.examSubject.textContent = 
        `Subject: ${examData.subject_name} | Duration: ${examData.duration_minutes} minutes`;
    
    // Set total marks
    elements.summaryTotalMarks.textContent = examData.total_marks;
    elements.totalQuestions.textContent = questions.length;
}

function createQuestionNavigation() {
    elements.questionNumbers.innerHTML = '';
    
    questions.forEach((question, index) => {
        const button = document.createElement('button');
        button.className = 'question-number';
        button.textContent = index + 1;
        button.dataset.index = index;
        
        button.addEventListener('click', () => {
            if (examStarted) {
                loadQuestion(index);
            }
        });
        
        elements.questionNumbers.appendChild(button);
    });
    
    updateQuestionNavigation();
}

function loadQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    currentQuestionIndex = index;
    const question = questions[index];
    
    // Update UI
    elements.currentQuestionNumber.textContent = index + 1;
    elements.questionMarks.textContent = `${question.marks} marks`;
    
    // Update navigation
    updateQuestionNavigation();
    
    // Load question content
    loadQuestionContent(question);
}

function loadQuestionContent(question) {
    let content = '';
    
    // Question text
    content += `
        <div class="question-content">
            <div class="question-text">${question.question_text}</div>
    `;
    
    // Based on question type
    switch(question.question_type) {
        case 'multiple_choice':
            content += loadMultipleChoice(question);
            break;
        case 'true_false':
            content += loadTrueFalse(question);
            break;
        case 'short_answer':
            content += loadShortAnswer(question);
            break;
        case 'essay':
            content += loadEssay(question);
            break;
    }
    
    content += `</div>`;
    elements.questionsContainer.innerHTML = content;
    
    // Load existing answer if exists
    loadExistingAnswer(question.id);
}

function loadMultipleChoice(question) {
    const options = [
        { letter: 'A', text: question.option_a },
        { letter: 'B', text: question.option_b },
        { letter: 'C', text: question.option_c, optional: true },
        { letter: 'D', text: question.option_d, optional: true },
        { letter: 'E', text: question.option_e, optional: true }
    ].filter(opt => opt.text); // Remove empty options

    let html = '<div class="question-options">';
    
    options.forEach(option => {
        html += `
            <div class="option-item" data-answer="${option.letter}">
                <div class="option-letter">${option.letter}</div>
                <div class="option-text">${option.text}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Add click handlers
    setTimeout(() => {
        document.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', function() {
                const answer = this.dataset.answer;
                saveAnswer(question.id, answer);
                
                // Update UI
                document.querySelectorAll('.option-item').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                
                updateQuestionNavigation();
                updateSummary();
            });
        });
    }, 0);
    
    return html;
}

function loadTrueFalse(question) {
    const html = `
        <div class="question-options">
            <div class="option-item" data-answer="true">
                <div class="option-letter">T</div>
                <div class="option-text">True</div>
            </div>
            <div class="option-item" data-answer="false">
                <div class="option-letter">F</div>
                <div class="option-text">False</div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', function() {
                const answer = this.dataset.answer;
                saveAnswer(question.id, answer);
                
                document.querySelectorAll('.option-item').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                
                updateQuestionNavigation();
                updateSummary();
            });
        });
    }, 0);
    
    return html;
}

function loadShortAnswer(question) {
    return `
        <div class="text-answer-container">
            <textarea class="text-answer" id="answer-${question.id}" 
                      placeholder="Type your answer here..." 
                      rows="4"></textarea>
        </div>
    `;
}

function loadEssay(question) {
    return `
        <div class="text-answer-container">
            <textarea class="text-answer" id="answer-${question.id}" 
                      placeholder="Write your essay here..." 
                      rows="8"></textarea>
        </div>
    `;
}

function loadExistingAnswer(questionId) {
    const answer = answers[questionId];
    if (!answer) return;
    
    const question = questions[currentQuestionIndex];
    
    if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        // Select the option
        const option = document.querySelector(`.option-item[data-answer="${answer}"]`);
        if (option) {
            option.classList.add('selected');
        }
    } else {
        // Set text area value
        const textarea = document.getElementById(`answer-${questionId}`);
        if (textarea) {
            textarea.value = answer;
        }
    }
}

function saveAnswer(questionId, answer) {
    answers[questionId] = answer;
    updateLocalStorage();
    updateLastSaveTime();
}

function saveTextAnswer() {
    const question = questions[currentQuestionIndex];
    const textarea = document.getElementById(`answer-${question.id}`);
    
    if (textarea) {
        const answer = textarea.value.trim();
        if (answer) {
            saveAnswer(question.id, answer);
        } else {
            delete answers[question.id];
        }
        
        updateQuestionNavigation();
        updateSummary();
    }
}

function startExam() {
    examStarted = true;
    startTime = new Date();
    
    // Hide instructions, show questions
    document.getElementById('examInstructions').style.display = 'none';
    document.getElementById('questionsContainer').style.display = 'block';
    document.getElementById('navButtons').style.display = 'flex';
    document.getElementById('startBtn').style.display = 'none';
    
    // Start timer
    startTimer();
    
    // Update UI
    document.getElementById('examHeader').classList.add('exam-active');
    
    // Prevent leaving page
    setupBeforeUnload();
}

function startTimer() {
    const duration = examData.duration_minutes * 60; // Convert to seconds
    let timeLeft = duration;
    
    // Load saved time if exists
    const savedTime = localStorage.getItem(`exam_time_${examData.id}`);
    if (savedTime) {
        const elapsed = Math.floor((new Date() - new Date(parseInt(savedTime))) / 1000);
        timeLeft = Math.max(0, duration - elapsed);
    }
    
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            endExam();
            return;
        }
        
        timeLeft--;
        totalTime = duration - timeLeft;
        
        // Update timer display
        updateTimerDisplay(timeLeft);
        
        // Update progress bar
        const percentage = ((duration - timeLeft) / duration) * 100;
        elements.progressFill.style.width = `${percentage}%`;
        
        // Update summary
        elements.summaryTimeLeft.textContent = formatTime(timeLeft);
        
        // Save time every 30 seconds
        if (totalTime % 30 === 0) {
            localStorage.setItem(`exam_time_${examData.id}`, Date.now() - (totalTime * 1000));
        }
        
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    elements.timerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${secs.toString().padStart(2, '0')}`;
}

function endExam() {
    clearInterval(timerInterval);
    examStarted = false;
    
    // Auto-submit if time's up
    if (totalTime >= examData.duration_minutes * 60) {
        showNotification('Time is up! Submitting your exam...', 'warning');
        setTimeout(submitExam, 2000);
    }
}

function submitExam() {
    if (!examStarted) return;
    
    // Save any pending text answers
    saveTextAnswer();
    
    // Show confirmation modal
    showConfirmationModal();
}

function showConfirmationModal() {
    const unanswered = questions.filter(q => !answers[q.id]).length;
    
    document.getElementById('unansweredCountModal').textContent = unanswered;
    document.getElementById('answeredCountModal').textContent = questions.length - unanswered;
    document.getElementById('timeUsedModal').textContent = formatTime(totalTime);
    
    document.getElementById('confirmationModal').style.display = 'block';
}

function closeConfirmationModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

async function confirmSubmit() {
    closeConfirmationModal();
    
    try {
        // Submit answers
        const response = await fetch('../php/api/submit_exam.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                exam_id: examData.id,
                answers: answers,
                time_spent: totalTime
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear local storage
            clearLocalStorage();
            
            // Redirect to results page
            window.location.href = `exam_results.html?attempt_id=${result.attempt_id}`;
        } else {
            showError('Failed to submit exam: ' + result.error);
        }
    } catch (error) {
        showError('Network error. Please check your connection and try again.');
    }
}

function updateQuestionNavigation() {
    document.querySelectorAll('.question-number').forEach((button, index) => {
        button.classList.remove('current', 'answered', 'unanswered');
        
        if (index === currentQuestionIndex) {
            button.classList.add('current');
        }
        
        const question = questions[index];
        if (answers[question.id]) {
            button.classList.add('answered');
        } else {
            button.classList.add('unanswered');
        }
    });
}

function updateSummary() {
    const answered = Object.keys(answers).length;
    const total = questions.length;
    
    elements.summaryAnswered.textContent = answered;
    elements.summaryUnanswered.textContent = total - answered;
    elements.answeredCount.textContent = `${answered}/${total} answered`;
    
    // Update warning
    const warning = document.getElementById('summaryWarning');
    if (answered < total) {
        warning.style.display = 'flex';
    } else {
        warning.style.display = 'none';
    }
}

function nextQuestion() {
    // Save current answer if text input
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.question_type === 'short_answer' || currentQuestion.question_type === 'essay') {
        saveTextAnswer();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

function previousQuestion() {
    // Save current answer if text input
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.question_type === 'short_answer' || currentQuestion.question_type === 'essay') {
        saveTextAnswer();
    }
    
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

// Local Storage Management
function initializeLocalStorage() {
    // Load saved answers
    const saved = localStorage.getItem(`exam_answers_${examData?.id}`);
    if (saved) {
        answers = JSON.parse(saved);
    }
}

function updateLocalStorage() {
    localStorage.setItem(`exam_answers_${examData.id}`, JSON.stringify(answers));
}

function clearLocalStorage() {
    localStorage.removeItem(`exam_answers_${examData.id}`);
    localStorage.removeItem(`exam_time_${examData.id}`);
}

function startAutoSave() {
    // Auto-save text answers when user stops typing
    document.addEventListener('input', function(event) {
        if (event.target.classList.contains('text-answer')) {
            debounce(saveTextAnswer, 1000)();
        }
    });
    
    // Auto-save every 30 seconds
    setInterval(() => {
        if (Object.keys(answers).length > 0) {
            updateLocalStorage();
            updateLastSaveTime();
        }
    }, 30000);
}

function updateLastSaveTime() {
    const now = new Date();
    elements.lastSave.textContent = `Last saved: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

// Event Listeners
function setupEventListeners() {
    // Text answer auto-save
    document.addEventListener('blur', function(event) {
        if (event.target.classList.contains('text-answer')) {
            saveTextAnswer();
        }
    }, true);
    
    // Fullscreen
    document.addEventListener('fullscreenchange', function() {
        isFullscreen = !!document.fullscreenElement;
        document.getElementById('fullscreenBtn').innerHTML = 
            isFullscreen ? '<i class="fas fa-compress"></i> Exit Fullscreen' : 
                          '<i class="fas fa-expand"></i> Fullscreen';
    });
    
    // Network status
    window.addEventListener('online', function() {
        elements.saveStatus.textContent = 'Auto-save enabled';
        elements.autoSaveIndicator.style.color = '';
        document.getElementById('emergencyModal').style.display = 'none';
    });
    
    window.addEventListener('offline', function() {
        elements.saveStatus.textContent = 'Offline - saving locally';
        elements.autoSaveIndicator.style.color = '#ffc107';
        document.getElementById('emergencyModal').style.display = 'block';
    });
}

// Utility Functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function toggleSummary() {
    const summary = document.querySelector('.exam-summary');
    const content = summary.querySelector('.summary-content');
    const warning = summary.querySelector('.summary-warning');
    
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    warning.style.display = warning.style.display === 'none' ? 'flex' : 'none';
}

function setupBeforeUnload() {
    window.addEventListener('beforeunload', function(e) {
        if (examStarted && Object.keys(answers).length > 0) {
            e.preventDefault();
            e.returnValue = 'You have unsaved answers. Are you sure you want to leave?';
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #f8d7da;
        color: #721c24;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 500px;
        border: 1px solid #f5c6cb;
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
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'warning') {
        notification.style.background = '#f39c12';
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