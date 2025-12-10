// Configuración del canvas de estrellas
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

// Ajustar el tamaño del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Clase para las estrellas
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * canvas.width;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        
        // Colores del logo Aethernal (rosa, naranja, dorado, azul, púrpura)
        const colors = [
            'rgba(255, 20, 147, ',    // Rosa/Magenta
            'rgba(255, 107, 53, ',    // Naranja
            'rgba(255, 215, 0, ',     // Dorado
            'rgba(65, 105, 225, ',    // Azul
            'rgba(139, 58, 156, ',    // Púrpura
            'rgba(255, 255, 255, '    // Blanco
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.z -= this.speed;
        
        if (this.z <= 0) {
            this.reset();
            this.z = canvas.width;
        }
    }

    draw() {
        const x = (this.x - canvas.width / 2) * (canvas.width / this.z);
        const y = (this.y - canvas.height / 2) * (canvas.width / this.z);
        const s = this.size * (canvas.width / this.z);
        
        const centerX = canvas.width / 2 + x;
        const centerY = canvas.height / 2 + y;
        
        // Calcular opacidad basada en la distancia
        const opacity = Math.min(1, (canvas.width - this.z) / canvas.width);
        
        // Dibujar la estrella
        ctx.fillStyle = this.color + opacity + ')';
        ctx.beginPath();
        ctx.arc(centerX, centerY, s, 0, Math.PI * 2);
        ctx.fill();
        
        // Añadir efecto de brillo para estrellas más cercanas
        if (this.z < canvas.width / 3) {
            ctx.fillStyle = this.color + (opacity * 0.3) + ')';
            ctx.beginPath();
            ctx.arc(centerX, centerY, s * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Crear array de estrellas
const numStars = window.innerWidth < 768 ? 200 : 400;
const stars = [];

for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

// Función de animación
function animate() {
    // Limpiar canvas con efecto de desvanecimiento
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar estrellas
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animate);
}

// Iniciar animación
animate();

// Funcionalidad de copiar IP
const copyBtn = document.getElementById('copy-btn');
const serverIp = document.getElementById('server-ip');
const copyFeedback = document.getElementById('copy-feedback');

copyBtn.addEventListener('click', async () => {
    const ipText = serverIp.textContent;
    
    try {
        // Intentar usar la API del portapapeles
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(ipText);
        } else {
            // Fallback para navegadores más antiguos
            const textArea = document.createElement('textarea');
            textArea.value = ipText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        // Mostrar feedback
        copyFeedback.classList.add('show');
        
        // Animación del botón
        copyBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            copyBtn.style.transform = 'scale(1)';
        }, 100);
        
        // Ocultar feedback después de 2 segundos
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
        
    } catch (err) {
        console.error('Error al copiar:', err);
        copyFeedback.textContent = 'Error al copiar';
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
            copyFeedback.textContent = '¡IP copiada!';
        }, 2000);
    }
});

// Efecto parallax suave en el movimiento del mouse
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function updateParallax() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    
    const cards = document.querySelectorAll('.info-card, .ip-container');
    cards.forEach((card, index) => {
        const depth = (index + 1) * 5;
        card.style.transform = `
            translateX(${targetX * depth}px) 
            translateY(${targetY * depth}px)
        `;
    });
    
    requestAnimationFrame(updateParallax);
}

// Iniciar efecto parallax solo en dispositivos no móviles
if (window.innerWidth > 768) {
    updateParallax();
}

// Animación de entrada para las tarjetas
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Efecto de partículas al hacer hover en los botones
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        createParticles(e.currentTarget);
    });
});

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    // Colores de partículas del logo
    const particleColors = [
        'rgba(255, 20, 147, 0.8)',
        'rgba(255, 107, 53, 0.8)',
        'rgba(255, 215, 0, 0.8)'
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = particleColors[Math.floor(Math.random() * particleColors.length)];
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const startX = rect.left + Math.random() * rect.width;
        const startY = rect.top + Math.random() * rect.height;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = startX;
        let y = startY;
        let opacity = 1;
        
        function animateParticle() {
            x += vx;
            y += vy;
            opacity -= 0.02;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        animateParticle();
    }
}

// Ajustar número de estrellas según el tamaño de la ventana
window.addEventListener('resize', () => {
    const newNumStars = window.innerWidth < 768 ? 200 : 400;
    
    if (newNumStars > stars.length) {
        for (let i = stars.length; i < newNumStars; i++) {
            stars.push(new Star());
        }
    } else if (newNumStars < stars.length) {
        stars.length = newNumStars;
    }
});

// Prevenir el comportamiento por defecto en dispositivos táctiles
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.btn') || e.target.closest('.copy-btn')) {
        e.preventDefault();
    }
}, { passive: false });

// Funcionalidad del indicador de scroll
const scrollIndicator = document.getElementById('scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        // Hacer scroll hasta el final de la página (footer)
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });

    // Ocultar el indicador cuando se hace scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// Funcionalidad del botón scroll to top
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Barra de progreso de scroll
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

console.log('🌌 Aethernal - Página cargada correctamente');
console.log('✨ Animación de estrellas activa');
console.log('🚀 ¡Bienvenido al universo de Minecraft!');
