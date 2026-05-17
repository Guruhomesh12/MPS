document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      });
    }, revealOptions);
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  
    // Sticky Header Scroll Effect
    const header = document.getElementById('main-header');
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollPosition = window.scrollY;
      
      // Add slight shadow when scrolled down
      if (currentScrollPosition > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        header.style.padding = '0';
      } else {
        header.style.boxShadow = 'var(--shadow-sm)';
      }
      
      lastScrollPosition = currentScrollPosition;
    });
  
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    const overlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    function openMenu() {
      mobileMenu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    mobileMenuBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    
    // Agent-HQ Webhook Integration
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
      serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(serviceForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const inquiry_type = formData.get('inquiry_type');
        const message = formData.get('message');
        
        const payload = {
          sender: `${name} (${phone})`,
          content: `Inquiry Type: ${inquiry_type}\n\nMessage: ${message}`
        };

        // Fire payload to Agent HQ local backend
        fetch('http://localhost:5000/api/webhooks/website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.error("Agent-HQ Integration Error:", err));
        
        // Wait briefly for the fetch to queue, then submit to the original form handler
        setTimeout(() => {
          serviceForm.submit();
        }, 400);
      });
    }
  });
