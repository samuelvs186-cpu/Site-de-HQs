// BASE DE DADOS DE EXEMPLO
const comicsDatabase = [
    {
        id: 1,
        title: "Capitão Incrível",
        author: "João Silva",
        genre: "acao",
        rating: 4.8,
        description: "Siga as aventuras épicas do Capitão Incrível enquanto ele defende o mundo de ameaças cósmicas.",
        pages: 50,
        image: "🦸"
    },
    {
        id: 2,
        title: "Mistério Noturno",
        author: "Maria Santos",
        genre: "suspense",
        rating: 4.5,
        description: "Uma história repleta de suspense e reviravoltas que mantém o leitor preso até o final.",
        pages: 45,
        image: "🌙"
    },
    {
        id: 3,
        title: "Amor no Universo",
        author: "Carlos Souza",
        genre: "romance",
        rating: 4.3,
        description: "Um romance intergaláctico que transcende os limites do espaço e do tempo.",
        pages: 40,
        image: "💕"
    },
    {
        id: 4,
        title: "Jornada Fantástica",
        author: "Ana Costa",
        genre: "fantasia",
        rating: 4.7,
        description: "Explore mundos mágicos e enfrente criaturas lendárias nesta epopeia fantástica.",
        pages: 60,
        image: "🧙"
    },
    {
        id: 5,
        title: "Aventura Perdida",
        author: "Pedro Oliveira",
        genre: "aventura",
        rating: 4.4,
        description: "Embarque em uma jornada emocionante através de terras desconhecidas.",
        pages: 55,
        image: "🗺️"
    },
    {
        id: 6,
        title: "Poder Oculto",
        author: "Lucia Ferreira",
        genre: "acao",
        rating: 4.6,
        description: "Descubra poderes extraordinários e lute contra forças do mal.",
        pages: 50,
        image: "⚡"
    },
    {
        id: 7,
        title: "Segredos da Noite",
        author: "Roberto Lima",
        genre: "suspense",
        rating: 4.2,
        description: "Desvende mistérios sombrios em uma noite cheia de segredos.",
        pages: 48,
        image: "🔮"
    },
    {
        id: 8,
        title: "Corações Conectados",
        author: "Fernanda Gomes",
        genre: "romance",
        rating: 4.5,
        description: "Dois corações se encontram e descobrem o verdadeiro significado do amor.",
        pages: 42,
        image: "💑"
    }
];

// ELEMENTOS DO DOM
const comicsGrid = document.getElementById('comicsGrid');
const modal = document.getElementById('readModal');
const closeModal = document.querySelector('.close-modal');
const searchInput = document.getElementById('searchInput');
const generoFilter = document.getElementById('generoFilter');
const ordenarFilter = document.getElementById('ordenarFilter');
const searchBtn = document.querySelector('.search-btn');

// VARIÁVEIS GLOBAIS
let currentComic = null;
let currentPage = 1;
let filteredComics = [...comicsDatabase];

// INICIALIZAR
document.addEventListener('DOMContentLoaded', () => {
    renderComics(comicsDatabase);
    setupEventListeners();
});

// CONFIGURAR OUVINTES DE EVENTOS
function setupEventListeners() {
    closeModal.addEventListener('click', closeReadModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeReadModal();
    });
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    generoFilter.addEventListener('change', applyFilters);
    ordenarFilter.addEventListener('change', applyFilters);
    
    // USER MENU ELEMENTS
    const userBtn = document.getElementById('userBtn');
    const userMenu = document.getElementById('userMenu');
    const avatarInput = document.getElementById('avatarInput');
    const avatarFileInput = document.getElementById('avatarFileInput');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const customizeBtn = document.getElementById('customizeBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userBtn && userMenu) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = userMenu.classList.toggle('visible');
            userBtn.setAttribute('aria-expanded', isVisible);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target) && e.target !== userBtn) {
                userMenu.classList.remove('visible');
                userBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // abrir modal e solicitar arquivo
            const avatarModal = document.getElementById('avatarModal');
            if (avatarModal) {
                avatarModal.style.display = 'block';
                avatarModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
            // prefer visible input inside modal, fallback to hidden one
            if (avatarFileInput) {
                avatarFileInput.click();
            } else if (avatarInput) {
                avatarInput.click();
            }
        });

        // ouvir mudanças no input visível (modal)
        if (avatarFileInput) {
            avatarFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    const dataUrl = ev.target.result;
                    const avatarPreview = document.getElementById('avatarPreview');
                    if (avatarPreview) avatarPreview.src = dataUrl;
                    // armazenar temporariamente até confirmação
                    window.tempAvatar = dataUrl;
                };
                reader.readAsDataURL(file);
            });
        }
        // keep fallback for hidden input if present
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    const dataUrl = ev.target.result;
                    const avatarPreview = document.getElementById('avatarPreview');
                    if (avatarPreview) avatarPreview.src = dataUrl;
                    window.tempAvatar = dataUrl;
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // AVATAR MODAL CONTROLS
    const avatarModalEl = document.getElementById('avatarModal');
    const avatarPreviewEl = document.getElementById('avatarPreview');
    const avatarConfirmBtn = document.getElementById('avatarConfirmBtn');
    const avatarCancelBtn = document.getElementById('avatarCancelBtn');
    const closeAvatarModalBtn = document.getElementById('closeAvatarModal');

    function closeAvatarModal() {
        const modalEl = document.getElementById('avatarModal');
        if (modalEl) {
            modalEl.style.display = 'none';
            modalEl.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
        if (avatarInput) avatarInput.value = '';
        const avatarFileInputEl = document.getElementById('avatarFileInput');
        if (avatarFileInputEl) avatarFileInputEl.value = '';
        window.tempAvatar = null;
        if (avatarPreviewEl) avatarPreviewEl.src = '';
    }

    if (avatarConfirmBtn) {
        avatarConfirmBtn.addEventListener('click', () => {
            // if we already have a temp data URL, use it
            if (window.tempAvatar) {
                applyAvatar(window.tempAvatar);
                return;
            }

            // otherwise try to read the selected file from visible input
            const avatarFileInputEl = document.getElementById('avatarFileInput');
            const fallbackInput = document.getElementById('avatarInput');
            const file = (avatarFileInputEl && avatarFileInputEl.files && avatarFileInputEl.files[0]) || (fallbackInput && fallbackInput.files && fallbackInput.files[0]);
            if (!file) {
                alert('Nenhum arquivo selecionado para confirmar.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(ev) {
                const dataUrl = ev.target.result;
                applyAvatar(dataUrl);
            };
            reader.readAsDataURL(file);
        });
    }

    async function applyAvatar(dataUrl) {
        const avatarImg = document.getElementById('userAvatar');
        const userBtnAvatar = document.getElementById('userBtnAvatar');
        const userBtn = document.getElementById('userBtn');

        async function trySet(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                return false;
            }
        }

        try {
            // tentativa direta
            if (await trySet('userAvatar', dataUrl)) {
                if (avatarImg) avatarImg.src = dataUrl;
                if (userBtnAvatar) {
                    userBtnAvatar.src = dataUrl;
                    userBtnAvatar.style.display = 'block';
                }
                if (userBtn) userBtn.classList.add('has-avatar');
                closeAvatarModal();
                alert('Foto de perfil atualizada.');
                return;
            }

            // se falhar por cota, tentar comprimir em etapas
            const attempts = [ {size:1024, q:0.85}, {size:800, q:0.8}, {size:512, q:0.7}, {size:320, q:0.6} ];
            for (const a of attempts) {
                try {
                    const compressed = await compressDataUrl(dataUrl, a.size, a.q);
                    if (await trySet('userAvatar', compressed)) {
                        if (avatarImg) avatarImg.src = compressed;
                        if (userBtnAvatar) {
                            userBtnAvatar.src = compressed;
                            userBtnAvatar.style.display = 'block';
                        }
                        if (userBtn) userBtn.classList.add('has-avatar');
                        closeAvatarModal();
                        alert('Foto de perfil atualizada (compactada).');
                        return;
                    }
                } catch (err) {
                    // ignore and try next
                    console.warn('compress attempt failed', err);
                }
            }

            // última tentativa falhou
            alert('Não foi possível salvar a imagem: arquivo muito grande. Tente outra imagem menor.');
            console.error('Erro ao aplicar avatar: Falha ao armazenar em localStorage após compressões.');
        } catch (err) {
            console.error('Erro ao aplicar avatar:', err);
            alert('Erro ao salvar a foto. Veja o console para detalhes.');
        }
    }

    // compress DataURL via canvas
    function compressDataUrl(dataUrl, maxDim, quality) {
        return new Promise((resolve, reject) => {
            try {
                const img = new Image();
                img.onload = () => {
                    try {
                        let { width, height } = img;
                        const ratio = Math.min(1, maxDim / Math.max(width, height));
                        const w = Math.round(width * ratio);
                        const h = Math.round(height * ratio);
                        const canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, w, h);
                        const out = canvas.toDataURL('image/jpeg', quality);
                        resolve(out);
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = (e) => reject(e || new Error('Erro ao carregar imagem para compressão'));
                img.src = dataUrl;
                // se dataUrl for de origem cruzada, force anonymous? dataUrl should be same-origin
            } catch (err) {
                reject(err);
            }
        });
    }

    if (avatarCancelBtn) {
        avatarCancelBtn.addEventListener('click', () => {
            closeAvatarModal();
        });
    }

    if (closeAvatarModalBtn) {
        closeAvatarModalBtn.addEventListener('click', () => {
            closeAvatarModal();
        });
    }

    // fechar modal ao clicar fora
    document.addEventListener('click', (e) => {
        if (e.target === avatarModalEl) closeAvatarModal();
    });

    if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
            const color = prompt('Insira a cor primária (hex), por exemplo #7c3aed:', localStorage.getItem('primaryColor') || '');
            if (color && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color.trim())) {
                document.documentElement.style.setProperty('--primary-color', color.trim());
                localStorage.setItem('primaryColor', color.trim());
            } else if (color !== null) {
                alert('Cor inválida. Use formato hexadecimal, por exemplo #7c3aed');
            }
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            alert('Abrindo configurações...');
            location.hash = '#settings';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userName');
                // opcional: preservar favoritos, tema
                // atualizar UI imediatamente
                const avatarImg = document.getElementById('userAvatar');
                const userBtn = document.getElementById('userBtn');
                const userBtnAvatar = document.getElementById('userBtnAvatar');
                if (avatarImg) avatarImg.src = '';
                if (userBtnAvatar) userBtnAvatar.src = '';
                if (userBtn) userBtn.classList.remove('has-avatar');
                alert('Você foi desconectado.');
                location.reload();
            }
        });
    }

    // carregar avatar/tema salvos
    loadUserPreferences();
}

// RENDERIZAR GRID DE HQs
function renderComics(comics) {
    comicsGrid.innerHTML = '';
    comics.forEach(comic => {
        const card = createComicCard(comic);
        comicsGrid.appendChild(card);
    });
}

// CRIAR CARD DE HQ
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.innerHTML = `
        <div class="comic-cover">${comic.image}</div>
        <div class="comic-info">
            <div class="comic-title">${comic.title}</div>
            <div class="comic-author">${comic.author}</div>
            <div class="comic-rating">
                <i class="fas fa-star"></i>
                <span>${comic.rating}</span>
            </div>
        </div>
    `;
    card.addEventListener('click', () => openReadModal(comic));
    return card;
}

// ABRIR MODAL DE LEITURA
function openReadModal(comic) {
    currentComic = comic;
    currentPage = 1;
    
    document.getElementById('modalTitle').textContent = comic.title;
    document.getElementById('modalAutor').textContent = `Por ${comic.author}`;
    document.getElementById('modalRating').textContent = comic.rating;
    document.getElementById('modalDesc').textContent = comic.description;
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${comic.pages}`;
    document.getElementById('comicImage').textContent = `${comic.image} Página ${currentPage}`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setupModalControls();
}

// FECHAR MODAL DE LEITURA
function closeReadModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentComic = null;
}

// CONFIGURAR CONTROLES DO MODAL
function setupModalControls() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    prevBtn.onclick = () => previousPage();
    nextBtn.onclick = () => nextPage();
}

// PRÓXIMA PÁGINA
function nextPage() {
    if (currentComic && currentPage < currentComic.pages) {
        currentPage++;
        updatePageDisplay();
    }
}

// PÁGINA ANTERIOR
function previousPage() {
    if (currentComic && currentPage > 1) {
        currentPage--;
        updatePageDisplay();
    }
}

// ATUALIZAR EXIBIÇÃO DA PÁGINA
function updatePageDisplay() {
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${currentComic.pages}`;
    document.getElementById('comicImage').textContent = `${currentComic.image} Página ${currentPage}`;
}

// REALIZAR BUSCA
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.trim() === '') {
        filteredComics = [...comicsDatabase];
    } else {
        filteredComics = comicsDatabase.filter(comic => 
            comic.title.toLowerCase().includes(searchTerm) ||
            comic.author.toLowerCase().includes(searchTerm)
        );
    }
    applyFilters();
}

// APLICAR FILTROS
function applyFilters() {
    let filtered = [...filteredComics];
    
    // FILTRO POR GÊNERO
    const genero = generoFilter.value;
    if (genero !== 'todos') {
        filtered = filtered.filter(comic => comic.genre === genero);
    }
    
    // ORDENAÇÃO
    const ordenar = ordenarFilter.value;
    switch(ordenar) {
        case 'popular':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'alfabetico':
            filtered.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
            break;
        case 'nota':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'recente':
        default:
            // Manter ordem original (simulando recência)
            break;
    }
    
    renderComics(filtered);
}

// ADICIONAR ÀS FAVORITAS
function addToFavorites() {
    if (currentComic) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.find(fav => fav.id === currentComic.id)) {
            favorites.push(currentComic);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${currentComic.title} adicionado aos favoritos!`);
        } else {
            alert(`${currentComic.title} já está nos favoritos!`);
        }
    }
}

// BOTÃO DE FAVORITAR NO MODAL
const favBtn = document.querySelector('.btn-secondary');
if (favBtn) {
    favBtn.addEventListener('click', addToFavorites);
}

// CARREGAR AVATAR E TEMA DO LOCALSTORAGE
function loadUserPreferences() {
    const avatarData = localStorage.getItem('userAvatar');
    const avatarImg = document.getElementById('userAvatar');
    const userBtnAvatar = document.getElementById('userBtnAvatar');
    const userBtn = document.getElementById('userBtn');
    if (avatarData) {
        if (avatarImg) avatarImg.src = avatarData;
        if (userBtnAvatar) {
            userBtnAvatar.src = avatarData;
            userBtnAvatar.style.display = 'block';
        }
        if (userBtn) userBtn.classList.add('has-avatar');
    } else {
        if (avatarImg) avatarImg.src = '';
        if (userBtnAvatar) {
            userBtnAvatar.src = '';
            userBtnAvatar.style.display = 'none';
        }
        if (userBtn) userBtn.classList.remove('has-avatar');
    }

    const primaryColor = localStorage.getItem('primaryColor');
    if (primaryColor) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
}