document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const iframe = document.getElementById('main-frame');
    const siteTitle = document.getElementById('active-site-title');
    const refreshBtn = document.getElementById('refresh-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    // --- Lógica de Autenticação ---
    const loginOverlay = document.getElementById('login-overlay');
    const updateOverlay = document.getElementById('update-overlay');
    const loginForm = document.getElementById('login-form');
    const updateForm = document.getElementById('update-form');
    const loginError = document.getElementById('login-error');

    const DEFAULT_USERS = [
        { login: 'givaldo', pass: 'giva01' },
        { login: 'brshrek', pass: 'Jesus321*!' }
    ];

    // Inicializa usuários no localStorage se não existirem
    if (!localStorage.getItem('auth_users')) {
        localStorage.setItem('auth_users', JSON.stringify(DEFAULT_USERS));
        localStorage.setItem('first_access', 'true');
    }

    const getUsers = () => JSON.parse(localStorage.getItem('auth_users'));
    const isFirstAccess = () => localStorage.getItem('first_access') === 'true';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userVal = document.getElementById('login-user').value;
        const passVal = document.getElementById('login-pass').value;
        const users = getUsers();

        const authenticatedUser = users.find(u => u.login === userVal && u.pass === passVal);

        if (authenticatedUser) {
            loginError.style.display = 'none';
            if (isFirstAccess()) {
                loginOverlay.classList.add('hidden');
                updateOverlay.classList.remove('hidden');
            } else {
                loginOverlay.classList.add('hidden');
            }
        } else {
            loginError.style.display = 'block';
        }
    });

    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser1 = document.getElementById('new-user1').value;
        const newPass1 = document.getElementById('new-pass1').value;
        const newUser2 = document.getElementById('new-user2').value;
        const newPass2 = document.getElementById('new-pass2').value;

        const newUsers = [
            { login: newUser1, pass: newPass1 },
            { login: newUser2, pass: newPass2 }
        ];

        localStorage.setItem('auth_users', JSON.stringify(newUsers));
        localStorage.setItem('first_access', 'false');
        updateOverlay.classList.add('hidden');
    });

    // Controles de Zoom
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const zoomLevelDisplay = document.getElementById('zoom-level');
    
    let currentZoom = 1;

    // Toggle Sidebar
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Navegação entre sites (Otimizada)
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.external-link')) return;

            const url = item.getAttribute('data-url');
            const name = item.getAttribute('data-name');

            if (iframe.src === url) return;

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Troca instantânea ou com fade mínimo
            iframe.style.opacity = '0.5'; 
            iframe.src = url;
            siteTitle.textContent = name;
            
            iframe.onload = () => {
                iframe.style.opacity = '1';
                resetZoom(); // Reseta zoom ao trocar de site para evitar confusão
            };
        });
    });

    // Lógica de Zoom
    const updateZoom = () => {
        iframe.style.transform = `scale(${currentZoom})`;
        zoomLevelDisplay.textContent = `${Math.round(currentZoom * 100)}%`;
        
        // Ajusta largura e altura para compensar o scale e não sobrar muito espaço vazio
        // ou cortar conteúdo. O transform-origin está em top left.
        iframe.style.width = `${100 / currentZoom}%`;
        iframe.style.height = `${100 / currentZoom}%`;
    };

    const resetZoom = () => {
        currentZoom = 1;
        updateZoom();
    };

    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 2) {
            currentZoom += 0.1;
            updateZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 0.5) {
            currentZoom -= 0.1;
            updateZoom();
        }
    });

    zoomResetBtn.addEventListener('click', resetZoom);

    // Botão de recarregar
    refreshBtn.addEventListener('click', () => {
        iframe.style.opacity = '0.5';
        iframe.src = iframe.src;
        iframe.onload = () => iframe.style.opacity = '1';
    });

    // Botão de tela cheia
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    });
});
