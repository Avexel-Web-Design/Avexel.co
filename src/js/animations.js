// Reveal elements on scroll
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Counter animation
const counters = document.querySelectorAll('.counter');

const runCounter = (counter) => {
    const target = +counter.dataset.target;
    let updateCount;

    // If target is less than 50, let's animate downward from 100.
    if (target < 50) {
        let count = 100;
        const decrement = (100 - target) / 100;

        updateCount = () => {
            if (count > target) {
                count -= decrement;
                counter.innerText = Math.floor(count);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        }
    } else { // Regular count up for other counters
        let count = 0;
        const increment = target / 100;

        updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        }
    }

    updateCount();
}

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCounter(entry.target);
        }
    });
}

const observer = new IntersectionObserver(observerCallback);
counters.forEach(counter => observer.observe(counter));
