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
    const updateMsg = document.getElementById('update-msg');

    const DEFAULT_USERS = [
        { login: 'givaldo', pass: 'giva01', firstAccess: true },
        { login: 'brshrek', pass: 'Jesus321*', firstAccess: true } // Corrigido: Jesus321*! (User said Jesus321*! but input was Jesus321*)
    ];

    // Note: The user said Jesus321*!, let me double check the previous prompt.
    // Login: givaldo, Senha: giva01
    // Login: brshrek, Senha: Jesus321*!

    // Re-initializing with correct defaults if needed
    if (!localStorage.getItem('auth_users')) {
        localStorage.setItem('auth_users', JSON.stringify([
            { login: 'givaldo', pass: 'giva01', firstAccess: true },
            { login: 'brshrek', pass: 'Jesus321*!', firstAccess: true }
        ]));
    }

    let authenticatedUserIndex = -1;

    const getUsers = () => JSON.parse(localStorage.getItem('auth_users'));

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userVal = document.getElementById('login-user').value;
        const passVal = document.getElementById('login-pass').value;
        const users = getUsers();

        authenticatedUserIndex = users.findIndex(u => u.login === userVal && u.pass === passVal);

        if (authenticatedUserIndex !== -1) {
            const user = users[authenticatedUserIndex];
            loginError.style.display = 'none';
            
            if (user.firstAccess) {
                loginOverlay.classList.add('hidden');
                updateOverlay.classList.remove('hidden');
                updateMsg.textContent = `Olá ${user.login}, atualize seu acesso para continuar.`;
                document.getElementById('new-user').value = user.login;
            } else {
                loginOverlay.classList.add('hidden');
            }
        } else {
            loginError.style.display = 'block';
        }
    });

    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUser = document.getElementById('new-user').value;
        const newPass = document.getElementById('new-pass').value;
        const users = getUsers();

        users[authenticatedUserIndex] = {
            login: newUser,
            pass: newPass,
            firstAccess: false
        };

        localStorage.setItem('auth_users', JSON.stringify(users));
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
