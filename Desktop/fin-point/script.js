// 1. Data structure containing all 37 job roles
const jobRoles = [
    {
        title: "Financial Analyst",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, Business, Mathematics, or related field",
            "1–3+ years of financial/analytical experience",
            "Experience with financial statements and financial reporting",
            "Experience with budgeting and forecasting",
            "Strong Excel skills",
            "Experience with financial modelling is often preferred",
            "Experience with ERP/accounting systems may be required"
        ],
        skills: ["Financial analysis", "Financial modelling", "Budgeting and forecasting", "Excel", "Data analysis", "Financial reporting", "Variance analysis", "Research", "Attention to detail", "Presentation and communication", "Problem-solving"],
        certifications: ["CFA", "ACCA", "CIMA", "CPA/CA"]
    },
    {
        title: "Senior Financial Analyst",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, Business, or related field",
            "Usually 3–7+ years of relevant experience",
            "Strong financial modelling experience",
            "Experience preparing forecasts and budgets",
            "Experience analysing business performance",
            "Experience presenting financial information to management",
            "Advanced Excel skills",
            "Experience with BI/ERP systems is advantageous"
        ],
        skills: ["Advanced financial modelling", "Forecasting", "Budgeting", "FP&A", "Financial statement analysis", "Variance analysis", "Scenario analysis", "Excel", "Power BI/Tableau", "Strategic thinking", "Stakeholder management", "Communication"],
        certifications: []
    },
    {
        title: "FP&A Analyst",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, or related field",
            "2–5+ years of finance/FP&A experience",
            "Experience with budgeting and forecasting",
            "Experience preparing management reports",
            "Strong Excel skills",
            "Financial modelling experience"
        ],
        skills: ["Financial planning", "Forecasting", "Budgeting", "Financial modelling", "Variance analysis", "Management reporting", "Excel", "Data analysis", "Business partnering", "Communication"],
        certifications: []
    },
    {
        title: "FP&A Manager",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, or related field",
            "5–8+ years of finance experience",
            "Previous FP&A or financial-management experience",
            "Experience managing budgets and forecasts",
            "Experience presenting to senior leadership",
            "Team-management experience may be required",
            "Professional accounting qualification often preferred"
        ],
        skills: ["Financial planning", "Strategic planning", "Budget management", "Forecasting", "Financial modelling", "Leadership", "Management reporting", "Business partnering", "Advanced Excel", "BI tools", "Presentation skills"],
        certifications: []
    },
    {
        title: "Senior Financial Auditor",
        requirements: [
            "Bachelor's degree in Accounting, Finance, Business, or related field",
            "3–7+ years of audit experience",
            "Experience conducting financial audits",
            "Knowledge of accounting standards",
            "Experience reviewing financial statements",
            "Experience documenting audit findings",
            "Professional certification is frequently preferred or required"
        ],
        skills: ["Financial auditing", "Internal controls", "Risk assessment", "Financial statements", "Accounting", "Audit documentation", "Data analysis", "Excel", "Attention to detail", "Critical thinking", "Report writing", "Communication"],
        certifications: ["ACCA", "CPA", "CA", "CIA"]
    },
    {
        title: "Internal Auditor",
        requirements: [
            "Bachelor's degree in Accounting, Finance, Business, or related discipline",
            "2–5+ years of audit/internal-control experience",
            "Knowledge of internal controls and risk management",
            "Experience conducting internal audits",
            "Experience writing audit reports",
            "Professional certification may be preferred"
        ],
        skills: ["Internal auditing", "Risk assessment", "Internal controls", "Compliance", "Financial analysis", "Process analysis", "Excel", "Data analytics", "Investigation", "Report writing", "Communication"],
        certifications: ["CIA", "ACCA", "CPA", "CA"]
    },
    {
        title: "IT Auditor",
        requirements: [
            "Bachelor's degree in IT, Accounting, Finance, Information Systems, Cybersecurity, or related field",
            "2–5+ years of IT audit/control experience",
            "Understanding of IT systems and controls",
            "Knowledge of cybersecurity and data controls",
            "Experience with audit frameworks",
            "Professional certification may be preferred"
        ],
        skills: ["IT auditing", "Internal controls", "IT risk", "Cybersecurity", "Data analysis", "Systems analysis", "Compliance", "Risk assessment", "Documentation", "Excel", "Communication"],
        certifications: ["CISA", "CIA", "CISSP"]
    },
    {
        title: "Risk Analyst",
        requirements: [
            "Bachelor's degree in Finance, Economics, Mathematics, Statistics, Business, or related field",
            "1–5+ years of risk/financial-analysis experience",
            "Understanding of financial and operational risk",
            "Experience analysing data and risk indicators",
            "Strong Excel skills",
            "Risk-management experience is advantageous"
        ],
        skills: ["Risk analysis", "Financial analysis", "Data analysis", "Statistical analysis", "Excel", "Risk modelling", "Scenario analysis", "Problem-solving", "Research", "Communication"],
        certifications: []
    },
    {
        title: "Senior Risk Analyst",
        requirements: [
            "Bachelor's degree in Finance, Economics, Mathematics, Statistics, or related field",
            "3–7+ years of relevant experience",
            "Experience with risk models and risk reporting",
            "Strong analytical background",
            "Experience communicating risk information to management",
            "Advanced Excel/data-analysis skills"
        ],
        skills: ["Risk modelling", "Financial risk", "Scenario analysis", "Data analysis", "Statistical analysis", "Forecasting", "Risk reporting", "Excel", "Power BI/Tableau", "Critical thinking", "Stakeholder management"],
        certifications: []
    },
    {
        title: "Financial Risk Manager",
        requirements: [
            "Bachelor's degree in Finance, Economics, Mathematics, Statistics, or related field",
            "5–10+ years of relevant experience",
            "Strong financial-risk experience",
            "Experience developing risk frameworks",
            "Experience managing risk reporting",
            "Management/leadership experience",
            "Professional certification may be preferred"
        ],
        skills: ["Financial risk management", "Risk modelling", "Scenario analysis", "Stress testing", "Financial analysis", "Risk governance", "Leadership", "Reporting", "Strategic thinking", "Stakeholder management"],
        certifications: ["FRM", "CFA", "PRM"]
    },
    {
        title: "Compliance Analyst",
        requirements: [
            "Bachelor's degree in Finance, Business, Law, Accounting, Economics, or related field",
            "1–5+ years of compliance/regulatory experience",
            "Knowledge of relevant regulations",
            "Experience with compliance monitoring and reporting",
            "Strong documentation skills"
        ],
        skills: ["Regulatory compliance", "Risk assessment", "Research", "Policy analysis", "Documentation", "Data analysis", "Attention to detail", "Investigation", "Report writing", "Communication"],
        certifications: []
    },
    {
        title: "Compliance Manager",
        requirements: [
            "Bachelor's degree in Finance, Law, Business, Accounting, or related field",
            "5–10+ years of compliance experience",
            "Experience managing compliance programmes",
            "Strong regulatory knowledge",
            "Leadership experience",
            "Professional qualification may be preferred"
        ],
        skills: ["Compliance management", "Regulatory analysis", "Risk management", "Policy development", "Internal controls", "Investigation", "Leadership", "Reporting", "Communication", "Stakeholder management"],
        certifications: []
    },
    {
        title: "Investment Analyst",
        requirements: [
            "Bachelor's degree in Finance, Economics, Accounting, Mathematics, or related field",
            "1–5+ years of investment/financial-analysis experience",
            "Strong financial modelling skills",
            "Knowledge of valuation methods",
            "Experience analysing investments and markets",
            "Advanced Excel skills"
        ],
        skills: ["Financial modelling", "Investment analysis", "Valuation", "Market research", "Financial statement analysis", "Excel", "Forecasting", "Scenario analysis", "Research", "Presentation", "Critical thinking"],
        certifications: ["CFA"]
    },
    {
        title: "Real Estate Investment Analyst",
        requirements: [
            "Bachelor's degree in Finance, Real Estate, Economics, Accounting, or related field",
            "1–5+ years of relevant experience",
            "Experience analysing property investments",
            "Knowledge of real-estate financial modelling",
            "Understanding of property markets",
            "Experience with investment valuations"
        ],
        skills: ["Real-estate financial modelling", "Property valuation", "Investment analysis", "Market research", "Cash-flow modelling", "IRR/NPV analysis", "Excel", "Financial analysis", "Due diligence", "Presentation skills"],
        certifications: []
    },
    {
        title: "Credit Analyst",
        requirements: [
            "Bachelor's degree in Finance, Economics, Accounting, Business, or related field",
            "1–5+ years of financial/credit-analysis experience",
            "Experience analysing financial statements",
            "Knowledge of credit risk",
            "Strong Excel skills"
        ],
        skills: ["Credit analysis", "Financial statement analysis", "Risk assessment", "Financial modelling", "Excel", "Research", "Data analysis", "Decision-making", "Attention to detail"],
        certifications: []
    },
    {
        title: "Treasury Analyst",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, or related field",
            "1–5+ years of finance/treasury experience",
            "Understanding of cash management",
            "Experience with financial reporting",
            "Strong Excel skills"
        ],
        skills: ["Cash-flow management", "Liquidity analysis", "Financial analysis", "Banking relationships", "Forecasting", "Excel", "Risk management", "Reporting", "Attention to detail"],
        certifications: []
    },
    {
        title: "Treasury Manager",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, or related field",
            "5–10+ years of finance/treasury experience",
            "Experience managing cash and liquidity",
            "Experience with banking and financing",
            "Leadership experience",
            "Professional accounting qualification may be preferred"
        ],
        skills: ["Treasury management", "Cash management", "Liquidity management", "Financial risk", "Debt management", "Forecasting", "Leadership", "Financial modelling", "Negotiation", "Strategic planning"],
        certifications: []
    },
    {
        title: "Forensic Accountant",
        requirements: [
            "Bachelor's degree in Accounting, Finance, or related field",
            "2–7+ years of accounting/audit experience",
            "Experience investigating financial irregularities",
            "Strong knowledge of accounting principles",
            "Experience analysing financial records",
            "Professional qualification is often advantageous"
        ],
        skills: ["Forensic accounting", "Financial investigation", "Data analysis", "Auditing", "Fraud detection", "Financial reporting", "Excel", "Research", "Critical thinking", "Documentation", "Report writing"],
        certifications: ["CPA/CA", "ACCA", "CFE"]
    },
    {
        title: "Senior Accountant",
        requirements: [
            "Bachelor's degree in Accounting, Finance, or related field",
            "3–7+ years of accounting experience",
            "Experience with financial statements",
            "Knowledge of accounting standards",
            "Experience with accounting/ERP software",
            "Professional accounting qualification may be required/preferred"
        ],
        skills: ["Financial accounting", "Financial reporting", "Reconciliation", "Month-end/year-end closing", "Excel", "ERP systems", "Tax knowledge", "Attention to detail", "Analysis", "Communication"],
        certifications: ["ACCA", "CPA", "CA", "CIMA"]
    },
    {
        title: "Financial Controller",
        requirements: [
            "Bachelor's degree in Accounting or Finance",
            "7–12+ years of relevant experience",
            "Senior accounting/finance experience",
            "Strong financial-reporting knowledge",
            "Experience managing accounting teams",
            "Professional accounting qualification usually preferred"
        ],
        skills: ["Financial reporting", "Accounting", "Financial controls", "Budgeting", "Forecasting", "Audit", "Leadership", "Compliance", "ERP systems", "Strategic financial management"],
        certifications: ["CPA", "ACCA", "CA", "CIMA"]
    },
    {
        title: "Finance Manager",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, or related field",
            "5–10+ years of finance experience",
            "Management experience",
            "Experience with budgeting and forecasting",
            "Financial reporting experience",
            "Professional qualification often preferred"
        ],
        skills: ["Financial management", "Budgeting", "Forecasting", "Financial analysis", "Reporting", "Leadership", "Strategic planning", "Excel", "Risk management", "Communication"],
        certifications: []
    },
    {
        title: "Finance Director",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, or related field",
            "8–15+ years of finance experience",
            "Senior management experience",
            "Strong financial strategy experience",
            "Experience managing finance teams",
            "Professional qualification generally advantageous"
        ],
        skills: ["Financial strategy", "Leadership", "Financial planning", "Budget management", "Forecasting", "Risk management", "Corporate finance", "Executive communication", "Decision-making", "Business strategy"],
        certifications: []
    },
    {
        title: "Business Analyst",
        requirements: [
            "Bachelor's degree in Business, Finance, Economics, Information Systems, or related field",
            "2–5+ years of business-analysis experience",
            "Experience gathering business requirements",
            "Experience analysing business processes/data",
            "Strong Excel skills",
            "Experience with BI tools may be preferred"
        ],
        skills: ["Business analysis", "Requirements gathering", "Process improvement", "Data analysis", "Excel", "Power BI/Tableau", "Documentation", "Problem-solving", "Stakeholder management", "Communication"],
        certifications: []
    },
    {
        title: "Business Intelligence Analyst",
        requirements: [
            "Bachelor's degree in Business, Finance, Economics, Statistics, Data Analytics, or related field",
            "1–5+ years of analytics experience",
            "Experience with reporting/dashboard tools",
            "Strong Excel skills",
            "SQL may be required depending on the employer"
        ],
        skills: ["Data analysis", "Business intelligence", "Dashboard development", "Excel", "Power BI", "Tableau", "SQL", "Data visualisation", "Reporting", "Critical thinking"],
        certifications: []
    },
    {
        title: "Data Analyst",
        requirements: [
            "Bachelor's degree in Data Analytics, Statistics, Mathematics, Economics, Finance, Business, or related field",
            "1–5+ years of experience depending on seniority",
            "Experience analysing datasets",
            "Experience creating reports/dashboards",
            "Strong Excel skills",
            "SQL/BI tools commonly requested"
        ],
        skills: ["Data analysis", "Excel", "SQL", "Power BI/Tableau", "Data visualisation", "Statistics", "Reporting", "Problem-solving", "Critical thinking"],
        certifications: []
    },
    {
        title: "Operations Analyst",
        requirements: [
            "Bachelor's degree in Business, Finance, Economics, Operations, or related field",
            "1–5+ years of analytical/operations experience",
            "Experience analysing operational performance",
            "Strong Excel skills",
            "Experience with reporting systems"
        ],
        skills: ["Operations analysis", "Data analysis", "Process improvement", "Excel", "Reporting", "KPI analysis", "Problem-solving", "Communication"],
        certifications: []
    },
    {
        title: "Revenue Analyst",
        requirements: [
            "Bachelor's degree in Finance, Economics, Business, Mathematics, or related field",
            "1–5+ years of analytical experience",
            "Experience with revenue forecasting",
            "Experience analysing pricing and sales performance",
            "Strong Excel skills"
        ],
        skills: ["Revenue analysis", "Forecasting", "Pricing analysis", "Financial modelling", "Excel", "Data analysis", "Market analysis", "Reporting"],
        certifications: []
    },
    {
        title: "Pricing Analyst",
        requirements: [
            "Bachelor's degree in Finance, Economics, Mathematics, Statistics, Business, or related field",
            "1–5+ years of analytical experience",
            "Experience analysing pricing/data",
            "Strong Excel skills",
            "Statistical/data-analysis experience"
        ],
        skills: ["Pricing analysis", "Data analysis", "Financial modelling", "Market research", "Statistics", "Excel", "Forecasting", "Problem-solving"],
        certifications: []
    },
    {
        title: "Procurement Analyst",
        requirements: [
            "Bachelor's degree in Supply Chain, Business, Finance, Economics, or related field",
            "1–5+ years of procurement/supply-chain experience",
            "Experience analysing suppliers and costs",
            "Strong Excel skills",
            "Procurement systems experience may be preferred"
        ],
        skills: ["Procurement analysis", "Cost analysis", "Supplier analysis", "Negotiation", "Excel", "Data analysis", "Contract management", "Reporting", "Communication"],
        certifications: []
    },
    {
        title: "Supply Chain Analyst",
        requirements: [
            "Bachelor's degree in Supply Chain, Business, Logistics, Finance, Economics, or related field",
            "1–5+ years of relevant experience",
            "Experience with supply-chain data",
            "Experience with forecasting and inventory analysis",
            "Strong Excel skills"
        ],
        skills: ["Supply-chain analysis", "Forecasting", "Inventory analysis", "Data analysis", "Excel", "Process improvement", "Reporting", "Problem-solving"],
        certifications: []
    },
    {
        title: "Fraud Analyst",
        requirements: [
            "Bachelor's degree in Finance, Accounting, Economics, Business, Data Analytics, or related field",
            "1–5+ years of fraud/risk/financial-analysis experience",
            "Experience identifying suspicious transactions or activities",
            "Strong analytical skills",
            "Data-analysis experience"
        ],
        skills: ["Fraud detection", "Risk analysis", "Data analysis", "Investigation", "Transaction analysis", "Excel", "Pattern recognition", "Critical thinking", "Report writing"],
        certifications: []
    },
    {
        title: "Real Estate Analyst",
        requirements: [
            "Bachelor's degree in Finance, Real Estate, Economics, Accounting, or related field",
            "1–5+ years of relevant experience",
            "Knowledge of property markets",
            "Experience analysing property financials",
            "Strong Excel/financial-modelling skills"
        ],
        skills: ["Property analysis", "Financial modelling", "Market research", "Property valuation", "Cash-flow analysis", "Investment analysis", "Excel", "Reporting", "Presentation"],
        certifications: []
    },
    {
        title: "Property Accountant",
        requirements: [
            "Bachelor's degree/diploma in Accounting or Finance",
            "2–5+ years of accounting experience",
            "Property/accounting experience is often preferred",
            "Experience with reconciliations and financial reporting",
            "Knowledge of property-management systems is advantageous"
        ],
        skills: ["Property accounting", "Financial reporting", "Reconciliation", "Accounts payable/receivable", "Budgeting", "Excel", "Accounting software", "Attention to detail", "Communication"],
        certifications: []
    },
    {
        title: "Real Estate Asset Management Analyst",
        requirements: [
            "Bachelor's degree in Finance, Real Estate, Economics, Accounting, or related field",
            "2–5+ years of investment/property experience",
            "Financial-modelling experience",
            "Knowledge of property performance",
            "Understanding of investment returns"
        ],
        skills: ["Asset management", "Financial modelling", "Property analysis", "Investment analysis", "Portfolio analysis", "Valuation", "Excel", "Forecasting", "Reporting"],
        certifications: []
    },
    {
        title: "Real Estate Portfolio Analyst",
        requirements: [
            "Bachelor's degree in Finance, Real Estate, Economics, Accounting, or related field",
            "2–5+ years of analytical/investment experience",
            "Experience analysing multiple properties/assets",
            "Financial-modelling experience",
            "Strong Excel skills"
        ],
        skills: ["Portfolio analysis", "Financial modelling", "Property analysis", "Performance analysis", "Risk analysis", "Forecasting", "Excel", "Reporting", "Data analysis"],
        certifications: []
    },
    {
        title: "Real Estate Valuation Analyst",
        requirements: [
            "Bachelor's degree in Real Estate, Finance, Economics, Accounting, or related field",
            "1–5+ years of valuation/financial-analysis experience",
            "Knowledge of property valuation methods",
            "Experience with market research",
            "Strong Excel skills"
        ],
        skills: ["Property valuation", "Financial modelling", "Market research", "Comparable analysis", "Cash-flow analysis", "Investment analysis", "Excel", "Report writing"],
        certifications: []
    },
    {
        title: "Real Estate Acquisitions Analyst",
        requirements: [
            "Bachelor's degree in Finance, Real Estate, Economics, Business, or related field",
            "1–5+ years of investment/real-estate experience",
            "Experience analysing acquisition opportunities",
            "Financial modelling experience"
        ],
        skills: ["Acquisitions analysis", "Financial modelling", "Property valuation", "Market research", "Due diligence", "Investment analysis", "Excel", "Negotiation", "Presentation"],
        certifications: []
    }
];

// 2. DOM Elements
const modal = document.getElementById("jobsModal");
const jobsLink = document.getElementById("jobs-link");
const closeBtn = document.querySelector(".close-btn");
const roleSelect = document.getElementById("roleSelect");
const roleDetails = document.getElementById("roleDetails");
const jobForm = document.getElementById("jobApplicationForm");

// 3. Populate the Dropdown on Page Load
window.addEventListener('DOMContentLoaded', () => {
    jobRoles.forEach((role, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = role.title;
        roleSelect.appendChild(option);
    });
});

// 4. Open Modal
jobsLink.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
});

// 5. Close Modal Functions
const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore background scrolling
    jobForm.reset(); // Clear form
    roleDetails.innerHTML = '<p class="placeholder-text">Please select a role to view the details.</p>'; // Reset details
};

closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// 6. Handle Role Selection Change
roleSelect.addEventListener("change", function() {
    const selectedIndex = this.value;
    
    if (selectedIndex === "") {
        roleDetails.innerHTML = '<p class="placeholder-text">Please select a role to view the details.</p>';
        return;
    }

    const role = jobRoles[selectedIndex];

    // Build HTML for Requirements
    let requirementsHTML = `<h4>Typical Job Requirements</h4><ul>`;
    role.requirements.forEach(req => {
        requirementsHTML += `<li>${req}</li>`;
    });
    requirementsHTML += `</ul>`;

    // Build HTML for Skills
    let skillsHTML = `<h4>Skills</h4><ul>`;
    role.skills.forEach(skill => {
        skillsHTML += `<li>${skill}</li>`;
    });
    skillsHTML += `</ul>`;

    // Build HTML for Certifications (if any)
    let certsHTML = "";
    if (role.certifications && role.certifications.length > 0) {
        certsHTML = `<h4>Useful Certifications</h4><ul>`;
        role.certifications.forEach(cert => {
            certsHTML += `<li>${cert}</li>`;
        });
        certsHTML += `</ul>`;
    }

    // Inject into DOM
    roleDetails.innerHTML = requirementsHTML + skillsHTML + certsHTML;
});

// 7. Handle Form Submission
jobForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedRole = roleSelect.options[roleSelect.selectedIndex].text;
    const name = document.getElementById("applicantName").value;
    const email = document.getElementById("applicantEmail").value;
    
    // Simulate form submission
    alert(`Thank you, ${name}! Your application for the "${selectedRole}" position has been received. We will contact you at ${email} shortly.`);
    closeModal();
});

// 8. Mobile Menu Toggle Functionality (HAMBURGER FIX)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-links a');

// Toggle menu open/close
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Change the icon from bars to X when open
    const icon = mobileMenuBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close the menu when a link is clicked (improves mobile UX)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});