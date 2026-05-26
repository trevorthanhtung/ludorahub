// Dữ liệu mẫu (Mock Data) cho các tựa game
const games = [
    {
        id: "game1",
        title: "Caro",
        description: "Trò chơi cờ Caro truyền thống. Thử thách trí tuệ với bạn bè!",
        folderPath: "../GAMES/Caro/index.html", 
        image: null // Nếu chưa có hình, sẽ hiển thị placeholder
    },
    {
        id: "game2",
        title: "Xếp Hình",
        description: "Game xếp khối gạch Tetris kinh điển.",
        folderPath: "../GAMES/XepHinh/index.html",
        image: null
    },
    {
        id: "game3",
        title: "Rắn Săn Mồi",
        description: "Điều khiển rắn ăn mồi để lớn lên nhưng đừng chạm vào tường!",
        folderPath: "../GAMES/RanSanMoi/index.html",
        image: null
    }
];

// Hàm render giao diện các thẻ game
function renderGames() {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Xóa nội dung cũ

    games.forEach(game => {
        // Tạo thẻ a bọc ngoài để click chuyển trang
        const card = document.createElement('a');
        card.className = 'game-card';
        card.href = game.folderPath;

        // Xử lý hình ảnh (Nếu chưa có ảnh thì tạo Placeholder tên game)
        let imageHTML = '';
        if (game.image) {
            imageHTML = `<img src="${game.image}" alt="${game.title}">`;
        } else {
            // Placeholder lấy chữ cái đầu của tên game
            const firstLetter = game.title.charAt(0).toUpperCase();
            imageHTML = `<div class="img-placeholder">${firstLetter}</div>`;
        }

        // Nội dung của Card
        card.innerHTML = `
            <div class="card-image-wrapper">
                ${imageHTML}
            </div>
            <div class="card-content">
                <h2 class="card-title">${game.title}</h2>
                <p class="card-desc">${game.description}</p>
            </div>
        `;

        // Thêm thẻ vào lưới
        gameGrid.appendChild(card);
    });
}

// Chạy hàm render khi trang đã load xong
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
});
