document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elementlerini Seçme
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    
    const cardContainer = document.getElementById('category-cards-container');
    const menuDisplay = document.getElementById('menu-content-display');
    const backButton = document.getElementById('back-to-categories');
    const categoryTitle = document.getElementById('category-title');
    const categoryItemsList = document.getElementById('category-items-list');
    const cardBoxes = document.querySelectorAll('.card-box');

    let menuData = {};

    // 2. Verileri Yükleme Fonksiyonu
    function loadMenuData() {
        // Doğru yolu kontrol edin: /js/menuData.json veya js/menuData.json
        fetch('js/menuData.json') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('JSON dosyası yüklenemedi: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                menuData = data;
            })
            .catch(error => {
                console.error('Menü verileri yüklenirken hata oluştu:', error);
                alert('Menü verileri yüklenemedi. Lütfen konsolu kontrol edin.');
            });
    }

    // 3. Menüyü Gösterme Fonksiyonu
    function displayCategory(categoryKey) {
        const categoryData = menuData[categoryKey];
        if (!categoryData) {
            console.error('Bilinmeyen kategori anahtarı:', categoryKey);
            return;
        }

        // Kategori adını başlık için düzenleme (ör: sicakicecekler -> Sıcak İçecekler)
        let displayTitle = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
        displayTitle = displayTitle.replace(/([A-Z])/g, ' $1').trim(); // camelCase'i ayır

        categoryTitle.textContent = displayTitle;
        categoryItemsList.innerHTML = '';
        
        // Kartları gizle, menüyü göster
        cardContainer.classList.add('hidden'); 
        menuDisplay.classList.remove('hidden'); 
        
        // Menü öğelerini oluşturma
        categoryData.forEach(item => {
            const itemHTML = `
                <div class="menu-item">
                    <div>
                        <h3>${item.ad}</h3>
                        <p class="description">${item.aciklama}</p>
                    </div>
                    <p class="price">${item.fiyat}</p>
                </div>
            `;
            categoryItemsList.innerHTML += itemHTML;
        });
        
        // Menü alanına kaydır (mobil cihazlarda faydalıdır)
        menuDisplay.scrollIntoView({ behavior: 'smooth' });
    }

    // 4. Olay Dinleyicileri (Event Listeners)

    // A. Mobil Menü Açma/Kapama
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // B. Kategori Kartlarına Tıklama Olayı
    cardBoxes.forEach(card => {
        card.addEventListener('click', function() {
            const categoryKey = this.getAttribute('data-category');
            if (categoryKey && menuData[categoryKey]) {
                displayCategory(categoryKey);
                // Mobil menü açıksa kapat
                navbar.classList.remove('active'); 
            }
        });
    });

    // C. Geri Düğmesine Tıklama Olayı
    backButton.addEventListener('click', function() {
        menuDisplay.classList.add('hidden'); // Menüyü gizle
        cardContainer.classList.remove('hidden'); // Kartları göster 
        
        // Kartlar alanına kaydır
        cardContainer.scrollIntoView({ behavior: 'smooth' });
    });

    // Uygulamayı Başlat
    loadMenuData();
});