document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();

    // Elements
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    const htmlElement = document.documentElement;
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // -----------------------------------------
    // Theme Management (Dark/Light Mode)
    // -----------------------------------------
    
    // Check local storage or system preference
    const checkTheme = () => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlElement.classList.add('dark');
            updateIcons('sun');
        } else {
            htmlElement.classList.remove('dark');
            updateIcons('moon');
        }
    };

    // Update icons
    const updateIcons = (iconName) => {
        if(themeIcon && themeIconMobile) {
            themeIcon.setAttribute('data-feather', iconName);
            themeIconMobile.setAttribute('data-feather', iconName);
            feather.replace();
            
            // Adjust colors for the icon
            if(iconName === 'sun') {
                themeIcon.classList.remove('text-slate-700');
                themeIcon.classList.add('text-amber-400');
                themeIconMobile.classList.remove('text-slate-700');
                themeIconMobile.classList.add('text-amber-400');
            } else {
                themeIcon.classList.add('text-slate-700');
                themeIcon.classList.remove('text-amber-400');
                themeIconMobile.classList.add('text-slate-700');
                themeIconMobile.classList.remove('text-amber-400');
            }
        }
    };

    // Toggle Theme
    const toggleTheme = () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
            updateIcons('moon');
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
            updateIcons('sun');
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleMobileBtn.addEventListener('click', toggleTheme);
    
    // Run on load
    checkTheme();

    // -----------------------------------------
    // Mobile Menu Toggle
    // -----------------------------------------
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenu.classList.contains('hidden') ? 'menu' : 'x';
        mobileMenuBtn.innerHTML = `<i data-feather="${icon}"></i>`;
        feather.replace();
    });

    // Close menu when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = `<i data-feather="menu"></i>`;
            feather.replace();
        });
    });

    // -----------------------------------------
    // Navbar Scroll Effect
    // -----------------------------------------
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
            navbar.classList.remove('py-2');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.add('py-2');
        }
    });

    // -----------------------------------------
    // FAQ Accordion Logic
    // -----------------------------------------
    const faqButtons = document.querySelectorAll('.faq-button');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('i');
            const parent = button.parentElement;
            
            // Close all others
            document.querySelectorAll('.faq-content').forEach(item => {
                if (item !== content) {
                    item.classList.add('hidden');
                }
            });
            document.querySelectorAll('.faq-button i').forEach(item => {
                if (item !== icon) {
                    item.style.transform = 'rotate(0deg)';
                }
            });
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('border-primary', 'dark:border-indigo-500', 'shadow-md');
                }
            });

            // Toggle current
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
                parent.classList.add('border-primary', 'dark:border-indigo-500', 'shadow-md');
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
                parent.classList.remove('border-primary', 'dark:border-indigo-500', 'shadow-md');
            }
        });
    });
    // -----------------------------------------
    // Auth Modal Logic
    // -----------------------------------------
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const openLoginBtns = document.querySelectorAll('.open-login-modal');
    const openSignupBtns = document.querySelectorAll('.open-signup-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const openSignupFromLogin = document.getElementById('open-signup-from-login');
    const openLoginFromSignup = document.getElementById('open-login-from-signup');

    const showModal = (modal) => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const hideModal = (modal) => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    openLoginBtns.forEach(btn => btn.addEventListener('click', () => showModal(loginModal)));
    openSignupBtns.forEach(btn => btn.addEventListener('click', () => showModal(signupModal)));

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            hideModal(document.getElementById(modalId));
        });
    });

    // Toggle between login and signup
    if(openSignupFromLogin) {
        openSignupFromLogin.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(loginModal);
            showModal(signupModal);
        });
    }

    if(openLoginFromSignup) {
        openLoginFromSignup.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal(signupModal);
            showModal(loginModal);
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === signupModal) hideModal(signupModal);
    });

    // Auth Form Logic (Real Backend Integration)
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const [name, email, password] = signupForm.querySelectorAll('input');
            
            try {
                const response = await fetch('http://localhost:5000/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name.value, email: email.value, password: password.value })
                });
                
                const result = await response.json();
                if (response.ok) {
                    alert('Signup Successful!');
                    hideModal(signupModal);
                } else {
                    alert(result.error || 'Signup Failed');
                }
            } catch (err) {
                alert('Backend Error: Make sure your Python server is running on port 5000.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const [email, password] = loginForm.querySelectorAll('input');
            
            try {
                const response = await fetch('http://localhost:5000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.value, password: password.value })
                });
                
                const result = await response.json();
                if (response.ok) {
                    alert(`Welcome, ${result.user.full_name}! Login Successful.`);
                    hideModal(loginModal);
                    // Redirect to dashboard (uncomment when ready)
                    // window.location.href = 'student-dashboard.html';
                } else {
                    alert(result.error || 'Login Failed');
                }
            } catch (err) {
                alert('Backend Error: Make sure your Python server is running on port 5000.');
            }
        });
    }
});
