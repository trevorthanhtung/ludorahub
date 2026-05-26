HƯỚNG DẪN CHỈNH SỬA GAME "BẠN CÓ DÁM CHƠI"
==========================================

1. CÁC FILE CHÍNH
-----------------
- BẠN CÓ DÁM CHƠI.html
  File mở game trên trình duyệt.

- style.css
  File giao diện: màu sắc, font chữ, kích thước nút, popup, màn hình.

- script.js
  File logic game: quay người chơi, chọn Sự Thật / Thử Thách, chống lặp câu hỏi,
  chế độ chơi, combo, lịch sử lượt, âm thanh.

- questions.js
  File dữ liệu câu hỏi mặc định.
  Muốn thêm / sửa / xóa câu hỏi mặc định thì sửa trong file này.


2. CÁCH MỞ GAME
---------------
Mở file:

BẠN CÓ DÁM CHƠI.html

Bằng trình duyệt Chrome / Edge.

Nếu vừa sửa file mà trình duyệt chưa hiện thay đổi, bấm:

Ctrl + F5

để tải lại trang bỏ qua cache.


3. CÁCH SỬA BỘ CÂU HỎI MẶC ĐỊNH
-------------------------------
Mở file:

questions.js

Trong file này có 3 nhóm:

- truth: Sự Thật
- dare: Thử Thách
- penalty: Hình Phạt

Mỗi câu hỏi có dạng:

{
    id: "truth_001",
    text: "Trong nhóm này, ai làm bạn cười nhiều nhất?",
    type: "truth",
    difficulty: "easy",
    rarity: "common"
}

Ý nghĩa:

- id
  Mã riêng của câu hỏi. Không được trùng nhau.

- text
  Nội dung câu hỏi / thử thách / hình phạt hiện lên màn hình.

- type
  Loại câu hỏi.
  Giá trị hợp lệ: truth, dare, penalty.

- difficulty
  Độ khó.
  Giá trị hợp lệ: easy, medium, hard, insane.

- rarity
  Độ hiếm.
  Giá trị hợp lệ: common, rare, epic, legendary.


4. THÊM 1 CÂU SỰ THẬT MỚI
-------------------------
Tìm nhóm:

truth: [
    ...
]

Thêm câu mới vào bên trong dấu ngoặc vuông.

Ví dụ:

{
    id: "truth_041",
    text: "Ai trong nhóm có khả năng giữ bí mật tốt nhất?",
    type: "truth",
    difficulty: "medium",
    rarity: "rare"
}

Lưu ý:
- Nếu câu đúng không phải câu cuối cùng trong danh sách, nhớ thêm dấu phẩy "," sau câu.
- Câu cuối cùng trong danh sách không bắt buộc có dấu phẩy.
- id phải tăng lên và không trùng với câu cũ.


5. THÊM 1 THỬ THÁCH MỚI
-----------------------
Tìm nhóm:

dare: [
    ...
]

Ví dụ:

{
    id: "dare_041",
    text: "Chọn 2 người và tạo một màn chào sân thật hoành tráng.",
    type: "dare",
    difficulty: "medium",
    rarity: "rare"
}


6. THÊM 1 HÌNH PHẠT MỚI
-----------------------
Tìm nhóm:

penalty: [
    ...
]

Ví dụ:

{
    id: "penalty_031",
    text: "Đứng nghiêm 10 giây và nói lời xin lỗi cả nhóm.",
    type: "penalty",
    difficulty: "easy",
    rarity: "common"
}


7. ĐỘ KHÓ NÊN DÙNG NHƯ THẾ NÀO
------------------------------
- easy
  Nhẹ, vui, ai cũng làm được.

- medium
  Cần tương tác với người khác hoặc hơi ngại một chút.

- hard
  Khó hơn, có thể hơi xấu hổ, cần diễn / nói trước nhóm.

- insane
  Rất căng, chỉ nên dùng ít để giữ game vui và không quá áp lực.


8. ĐỘ HIẾM NÊN DÙNG NHƯ THẾ NÀO
-------------------------------
Game random theo tỉ lệ:

- common: 55%
- rare: 25%
- epic: 15%
- legendary: 5%

Gợi ý:

- common
  Câu dễ ra thường xuyên, an toàn cho nhóm đông.

- rare
  Câu vui hơn, hơi đặc biệt hơn.

- epic
  Câu mạnh hơn, ít ra hơn.

- legendary
  Câu đặc biệt, nên để ít và thật đáng nhớ.


9. CÂU TỰ NHẬP TRONG GAME
-------------------------
Trong popup CÀI ĐẶT có phần:

Tự nhập câu hỏi / thử thách / phạt

Cách dùng:

- Mỗi dòng là 1 câu riêng.
- Nhập 5 dòng thì game có thêm 5 câu.
- Ở "Nhập Sự Thật..." chỉ nhập câu Sự Thật.
- Ở "Nhập Thử Thách..." chỉ nhập Thử Thách.
- Ở "Nhập Hình Phạt..." chỉ nhập Hình Phạt.

Ví dụ trong ô Sự Thật:

Bạn từng nói dối ai trong nhóm chưa?
Ai trong nhóm làm bạn ấn tượng nhất?
Nếu lập team 3 người, bạn chọn ai?

Game sẽ tính đây là 3 câu Sự Thật riêng.


10. NGUỒN DỮ LIỆU SỬ DỤNG
-------------------------
Trong CÀI ĐẶT có 2 lựa chọn:

- Dữ liệu có sẵn
  Dùng bộ câu hỏi mặc định trong questions.js.

- Dữ liệu tự nhập
  Dùng các câu được nhập trực tiếp trong popup CÀI ĐẶT.

Nếu bật cả 2:
Game sẽ trộn cả câu mặc định và câu tự nhập.

Nếu chỉ bật "Dữ liệu tự nhập":
Game ưu tiên bộ câu người dùng nhập.


11. LƯU Ý KHI SỬA FILE
----------------------
- Không xóa dòng này trong HTML:

<script src="./questions.js"></script>
<script src="./script.js"></script>

- questions.js phải được load trước script.js.

- Khi sửa questions.js, cần giữ đúng dấu ngoặc, dấu phẩy và dấu nháy.

- Nếu sửa xong game bị trắng / không chạy:
  1. Kiểm tra lại câu vừa thêm có thiếu dấu phẩy không.
  2. Kiểm tra id có bị trùng không.
  3. Kiểm tra text có đóng dấu nháy "..." đúng không.
  4. Bấm Ctrl + F5 để tải lại.


12. SỐ LƯỢNG CÂU HIỆN TẠI
-------------------------
Bộ câu mặc định hiện tại:

- Sự Thật: 40 câu
- Thử Thách: 40 câu
- Hình Phạt: 30 câu

Tổng cộng: 110 câu
