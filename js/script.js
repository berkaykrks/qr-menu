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
        // menuData.json dosyasını js klasöründen çeker
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
                // Kullanıcıya da bir mesaj gösterilebilir:
                // alert('Menü verileri yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
            });
    }

    // 3. Menüyü Gösterme Fonksiyonu (GÜNCELLENMİŞ)
    function displayCategory(categoryKey) {
        const categoryData = menuData[categoryKey];
        if (!categoryData) {
            console.error('Bilinmeyen kategori anahtarı:', categoryKey);
            return;
        }

        // Kategori adını başlık için düzenleme 
        let displayTitle = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
        displayTitle = displayTitle.replace(/([A-Z])/g, ' $1').trim();
        displayTitle = displayTitle.replace('icecekler', 'İçecekler'); // Özel durum düzeltmesi

        categoryTitle.textContent = displayTitle;
        categoryItemsList.innerHTML = '';
        
        // Kartları gizle, menüyü göster
        cardContainer.classList.add('hidden'); 
        menuDisplay.classList.remove('hidden'); 
        
        // Menü öğelerini oluşturma ve FOTOĞRAF EKLEME
        categoryData.forEach(item => {
            // Fotoğraf URL'si kontrolü
            const hasImage = item.fotograf_url && item.fotograf_url.trim() !== '';

            const itemHTML = `
                <div class="menu-item ${hasImage ? 'with-image' : 'no-image'}">
                    
                    ${hasImage ? `
                        <div class="item-image-container">
                            <img src="${item.fotograf_url}" alt="${item.ad}" class="item-image">
                        </div>
                    ` : ''}

                    <div class="menu-item-content">
                        <div class="item-text-info">
                            <h3>${item.ad}</h3>
                            <p class="description">${item.aciklama}</p>
                        </div>
                        <p class="price">${item.fiyat}</p>
                    </div>
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