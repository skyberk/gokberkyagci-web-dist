// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');
const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

// Set initial icon states based on current theme
const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
if (currentTheme === 'dark') {
  lightIcon.classList.remove('hidden');
  darkIcon.classList.add('hidden');
  lightIconMobile.classList.remove('hidden');
  darkIconMobile.classList.add('hidden');
} else {
  darkIcon.classList.remove('hidden');
  lightIcon.classList.add('hidden');
  darkIconMobile.classList.remove('hidden');
  lightIconMobile.classList.add('hidden');
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  if (newTheme === 'dark') {
    lightIcon.classList.remove('hidden');
    darkIcon.classList.add('hidden');
    lightIconMobile.classList.remove('hidden');
    darkIconMobile.classList.add('hidden');
  } else {
    darkIcon.classList.remove('hidden');
    lightIcon.classList.add('hidden');
    darkIconMobile.classList.remove('hidden');
    lightIconMobile.classList.add('hidden');
  }
  
  // Reinitialize Vanta with new theme colors
  setTimeout(initVanta, 50);
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleMobile.addEventListener('click', toggleTheme);

// Section switching functionality
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section-content');
  const navLinks = document.querySelectorAll('.navbar .menu li a');

  sections.forEach(section => {
    if (section.id === sectionId) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Update active nav link
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.textContent.toLowerCase().includes(sectionId.replace('-section', ''))) {
      link.classList.add('active');
    }
  });
}

// Add click handlers for navigation
document.querySelectorAll('.navbar .menu li a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const text = link.textContent.toLowerCase();
    if (text.includes('home')) {
      showSection('home-section');
    } else if (text.includes('about')) {
      showSection('about-section');
    } else if (text.includes('skills')) {
      showSection('skills-section');
    } else if (text.includes('contact')) {
      showSection('contact-section');
    }
  });
});

// Reinitialize Vanta when theme changes
let vantaEffect = null;

function initVanta() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  
  // Destroy existing Vanta instance if it exists
  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
  }
  
  if (currentTheme === 'dark') {
    vantaEffect = VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0x1a1a1a,
      color: 0x3b82f6,
      points: 10.0,
      maxDistance: 20.0,
      spacing: 15.0
    });
  } else {
    vantaEffect = VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0xededed,
      color: 0x0,
      points: 8.0,
      maxDistance: 18.0,
      spacing: 20.0
    });
  }
}

// Contact form functionality
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const formMessage = document.getElementById('form-message');
const nameInput = document.getElementById('name');

// Auto-capitalize each word in name field
nameInput.addEventListener('input', (e) => {
  const value = e.target.value;
  const words = value.split(' ');
  const capitalizedWords = words.map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  e.target.value = capitalizedWords.join(' ');
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const subject = formData.get('subject').trim();
  const message = formData.get('message').trim();

  // Basic validation
  if (!name || !email || !subject || !message) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  btnLoading.classList.remove('hidden');
  hideMessage();

  try {
    const response = await fetch('https://sample.azurewebsites.net/api/MailSender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message
      })
    });

    if (response.ok) {
      showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending message:', error);
    showMessage('Failed to send message. Please try again later.', 'error');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    btnLoading.classList.add('hidden');
  }
});

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.classList.remove('hidden', 'alert-success', 'alert-error');
  
  if (type === 'success') {
    formMessage.classList.add('alert', 'alert-success');
  } else if (type === 'error') {
    formMessage.classList.add('alert', 'alert-error');
  }
}

function hideMessage() {
  formMessage.classList.add('hidden');
}

// Initialize Vanta on load
initVanta();
