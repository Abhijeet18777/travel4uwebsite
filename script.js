// ========================================
// TRAVEL & TOURISM WEBSITE - MAIN SCRIPT
// ========================================

// ========================================
// USER AUTHENTICATION & PROFILE
// ========================================

// Navbar authentication logic
window.addEventListener('DOMContentLoaded', async () => {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        
        if (data.loggedIn) {
            // Show user name and logout
            const li = document.createElement('li');
            li.innerHTML = `<span style="color:#0077b6;font-weight:600;">Hi, ${data.name}</span>`;
            navLinks.appendChild(li);
            
            const logoutLi = document.createElement('li');
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'Logout';
            logoutBtn.style.background = '#d90429';
            logoutBtn.style.color = '#fff';
            logoutBtn.style.border = 'none';
            logoutBtn.style.padding = '0.5rem 1.2rem';
            logoutBtn.style.borderRadius = '20px';
            logoutBtn.style.cursor = 'pointer';
            logoutBtn.style.fontWeight = '500';
            logoutBtn.addEventListener('click', async () => {
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = 'index.html';
            });
            logoutLi.appendChild(logoutBtn);
            navLinks.appendChild(logoutLi);
        } else {
            // Show login/register links if not present
            if (!document.querySelector('a[href="login.html"]')) {
                const loginLi = document.createElement('li');
                loginLi.innerHTML = '<a href="login.html">Login</a>';
                navLinks.appendChild(loginLi);
            }
            if (!document.querySelector('a[href="register.html"]')) {
                const regLi = document.createElement('li');
                regLi.innerHTML = '<a href="register.html">Register</a>';
                navLinks.appendChild(regLi);
            }
        }
    } catch (e) {
        console.error('Auth check failed:', e);
    }
});

// Login form handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const msg = document.getElementById('loginMessage');
        msg.textContent = '';
        msg.style.background = '';
        
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                msg.textContent = 'Login successful! Redirecting...';
                msg.style.background = 'rgba(76, 175, 80, 0.2)';
                msg.style.color = '#4caf50';
                setTimeout(() => window.location.href = 'index.html', 1000);
            } else {
                msg.textContent = data.error || 'Login failed.';
                msg.style.background = 'rgba(244, 67, 54, 0.2)';
                msg.style.color = '#f44336';
            }
        } catch (error) {
            msg.textContent = 'Network error. Please try again.';
            msg.style.background = 'rgba(244, 67, 54, 0.2)';
            msg.style.color = '#f44336';
        }
    });
}

// Register form handling
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const msg = document.getElementById('registerMessage');
        msg.textContent = '';
        msg.style.background = '';
        
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                msg.textContent = 'Registration successful! Welcome aboard!';
                msg.style.background = 'rgba(76, 175, 80, 0.2)';
                msg.style.color = '#4caf50';
                setTimeout(() => window.location.href = 'index.html', 1500);
            } else {
                msg.textContent = data.error || 'Registration failed.';
                msg.style.background = 'rgba(244, 67, 54, 0.2)';
                msg.style.color = '#f44336';
            }
        } catch (error) {
            msg.textContent = 'Network error. Please try again.';
            msg.style.background = 'rgba(244, 67, 54, 0.2)';
            msg.style.color = '#f44336';
        }
    });
}

// Password reset form handling
const resetForm = document.getElementById('resetForm');
if (resetForm) {
    resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value.trim();
        const password = document.getElementById('resetPassword').value.trim();
        const msg = document.getElementById('resetMessage');
        msg.textContent = '';
        
        try {
            const res = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                msg.textContent = 'Password reset successful! You can now log in.';
                msg.style.color = '#0077b6';
                resetForm.reset();
            } else {
                msg.textContent = data.error || 'Reset failed.';
                msg.style.color = '#d90429';
            }
        } catch (error) {
            msg.textContent = 'Network error. Please try again.';
            msg.style.color = '#d90429';
        }
    });
}

// Profile page authentication check
async function checkAuth() {
    try {
        const res = await fetch('/api/me');
        const data = await res.json();
        
        if (!data.loggedIn) {
            window.location.href = 'login.html';
        } else {
            const profileInfo = document.getElementById('profileInfo');
            const profileName = document.getElementById('profileName');
            
            if (profileInfo) {
                profileInfo.innerHTML = `<strong>Name:</strong> ${data.name}<br><strong>Email:</strong> ${data.email || ''}`;
            }
            if (profileName) {
                profileName.value = data.name;
            }
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = 'login.html';
    }
}

// Profile update form handling
const updateProfileForm = document.getElementById('updateProfileForm');
if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('profileName').value.trim();
        const password = document.getElementById('profilePassword').value.trim();
        const msg = document.getElementById('profileMessage');
        msg.textContent = '';
        
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password })
            });
            const data = await res.json();
            
            if (data.success) {
                msg.textContent = 'Profile updated!';
                msg.style.color = '#0077b6';
                checkAuth();
            } else {
                msg.textContent = data.error || 'Update failed.';
                msg.style.color = '#d90429';
            }
        } catch (error) {
            msg.textContent = 'Network error. Please try again.';
            msg.style.color = '#d90429';
        }
    });
}

// Logout functionality for profile page
const logoutLink = document.getElementById('logoutLink');
if (logoutLink) {
    logoutLink.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = 'login.html';
        }
    });
}

// Initialize profile page if on profile.html
if (window.location.pathname.includes('profile.html')) {
    checkAuth();
}

// ========================================
// MESSAGES & CONTACT FUNCTIONALITY
// ========================================

// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const newsletter = document.getElementById('newsletter').checked;
        const terms = document.getElementById('terms').checked;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!terms) {
            showFormMessage('Please agree to the Terms & Conditions.', 'error');
            return;
        }
        
        // Email validation
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const formData = {
                name,
                email,
                phone: phone || '',
                subject,
                destination: '',
                travelers: '',
                budget: '',
                message,
                newsletter,
                timestamp: new Date().toISOString()
            };
            
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();
            
            if (data.success) {
                showFormMessage('Thank you for contacting us! We will get back to you within 24 hours.', 'success');
                contactForm.reset();
                
                // Reset checkboxes
                document.getElementById('newsletter').checked = false;
                document.getElementById('terms').checked = false;
            } else {
                showFormMessage(data.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showFormMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Helper function to show form messages
function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Newsletter form validation
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMessage = document.getElementById('newsletterMessage');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value.trim();
        if (!email) {
            newsletterMessage.textContent = 'Please enter your email.';
            newsletterMessage.style.color = '#d90429';
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            newsletterMessage.textContent = 'Please enter a valid email address.';
            newsletterMessage.style.color = '#d90429';
            return;
        }
        newsletterMessage.textContent = 'Thank you for subscribing!';
        newsletterMessage.style.color = '#0077b6';
        newsletterForm.reset();
    });
}

// ========================================
// UI/UX FEATURES
// ========================================

// Animated stats counter
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length > 0) {
    statNumbers.forEach(stat => {
        const updateCount = () => {
            const target = +stat.getAttribute('data-target');
            const count = +stat.innerText;
            const increment = Math.ceil(target / 100);
            if (count < target) {
                stat.innerText = count + increment > target ? target : count + increment;
                setTimeout(updateCount, 20);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    });
}

// Gallery auto-scroll slider
const gallery = document.querySelector('.gallery-container');
if (gallery) {
    let scrollAmount = 0;
    setInterval(() => {
        scrollAmount += 320;
        if (scrollAmount > gallery.scrollWidth - gallery.clientWidth) {
            scrollAmount = 0;
        }
        gallery.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// UTILITIES
// ========================================

// Add loading states to buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.setAttribute('data-original-text', button.textContent);
    button.addEventListener('click', function() {
        if (this.form && this.form.checkValidity()) {
            this.disabled = true;
            this.textContent = 'Loading...';
            
            // Re-enable after form submission
            setTimeout(() => {
                this.disabled = false;
                this.textContent = this.getAttribute('data-original-text') || 'Submit';
            }, 3000);
        }
    });
}); 