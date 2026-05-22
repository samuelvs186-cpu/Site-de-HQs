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