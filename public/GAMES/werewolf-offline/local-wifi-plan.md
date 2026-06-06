# Kế hoạch Kỹ thuật: Phase 2 - Local Wi-Fi Mode (Ma Sói)

Tài liệu này phân tích kiến trúc hiện tại và đề xuất phương án kỹ thuật để đưa tựa game "Ma Sói Offline" lên môi trường mạng nội bộ (Local Wi-Fi), cho phép Quản trò (GM) và Người chơi (Player) dùng thiết bị riêng biệt.

## 1. Kiến trúc hiện tại của offline mode
- **Môi trường:** Single-device, offline, local-first. Vanilla JS (ES Modules), không framework.
- **State Management:** Cấu trúc một chiều (Unidirectional). `game-state.js` đóng vai trò reducer, nhận action và trả về bản copy của state mới (`gameState`).
- **View Layer:** `ui-renderer.js` re-render toàn bộ DOM dựa trên `gameState.screen`.
- **Event Handling:** Sử dụng Event Delegation (`data-action`) tập trung tại `app.js`.
- **Lưu trữ:** Lưu toàn bộ state vào `localStorage` qua `storage-adapter.js` sau mỗi lần state thay đổi.

## 2. Những module có thể tái sử dụng cho local Wi-Fi
Phần lớn Core Logic đều có thể giữ nguyên do đã được thiết kế theo hướng functional (thuần tuý, không dính dáng UI hay Side-effect):
- `game-state.js`: Chứa toàn bộ logic khởi tạo, chia vai, đổi phase, xử lý thắng thua.
- `role-config.js` & `preset-builder.js`: Định nghĩa các loại vai trò và sinh preset số lượng người chơi.
- `phase-manager.js`: Luồng đi phase mặc định (Đêm, Sói, Tiên tri,...).
- `shared-components.js`: Các component UI tĩnh như hiển thị badge, escape HTML.
- `style.css`: Giao diện đã được thiết kế Responsive sẵn, card người chơi và màu sắc sẽ được dùng lại cho màn hình Client.

## 3. Những phần cần refactor trước khi thêm network
- **Tách biệt Entry Point (app.js):** Hiện tại `app.js` gắn trực tiếp UI Event vào State Mutation. Cần phải refactor để tách ra thành 2 luồng: 
  - `Offline Mode`: Giữ nguyên.
  - `Network Mode`: UI Event không gọi thẳng hàm state mà sẽ phát ra một `Intent` (ví dụ: `dispatch({ type: 'NEXT_PHASE' })`).
- **Tách Controller cho GM và Player:** Cần có hệ thống định tuyến (Routing) nhẹ để xác định người mở app đang là Host (GM) hay là Client (Player) để render các file View tương ứng (Tránh việc bắt Client phải load UI của GM Dashboard).
- **Hệ thống ID:** Thay vì tạo id `player-timestamp-index` cứng, cần tích hợp `clientId` thật từ kết nối mạng (peerId/socketId) để xác thực.

## 4. Đề xuất mô hình local Wi-Fi
Sử dụng mô hình **Host-Client (Peer-to-Peer Topology)** để không cần chạy Backend Node.js riêng:
1. **Host (Quản trò):**
   - Ấn nút "Tạo phòng qua Wi-Fi". 
   - Ứng dụng khởi tạo một Network Host (ví dụ thông qua PeerJS/WebRTC).
   - Hệ thống sinh ra một Mã phòng (Room Code) gồm 4-6 ký tự, kèm theo một Mã QR.
2. **Client (Người chơi):**
   - Mở game, ấn "Vào phòng", nhập Mã phòng hoặc quét QR Code.
   - Nhập Tên hiển thị (Nickname) và kết nối tới Host.
3. **Luồng chơi:**
   - Host nhìn thấy danh sách người vào phòng ở sảnh (Lobby).
   - Host chốt danh sách, bấm "Bắt đầu", Host chia vai và bắn dữ liệu xuống cho các Client.
   - Client lúc này nhìn thấy màn hình điện thoại của riêng mình, chỉ hiển thị Vai trò và Trạng thái (Sống/Chết) của bản thân.
   - Host giữ màn hình GM Dashboard để đi Phase như bản offline cũ.

## 5. Đề xuất State Sync (Đồng bộ dữ liệu)
Không được gửi nguyên cục `gameState` cho mọi người. Dữ liệu cần chia làm 2 tầng:

### Host State (Chỉ GM nắm giữ)
Là `gameState` tổng hiện tại, chứa thông tin mọi role, mọi ghi chú, số phiếu của mọi người, và thông tin bảo mật.

### Player View State (Gửi xuống cho Client)
Hàm trích xuất `extractPlayerState(gameState, clientId)` sẽ bóc tách và gửi payload an toàn:
```json
{
  "screen": "waiting" | "role-reveal" | "voting" | "dead",
  "myPlayer": { "id": "123", "name": "Đen", "roleId": "werewolf", "alive": true },
  "publicState": {
    "phase": "Đêm",
    "players": [
       { "id": "123", "name": "Đen", "alive": true },
       { "id": "456", "name": "Trắng", "alive": false }
       // TUYỆT ĐỐI KHÔNG CHỨA roleId CỦA NGƯỜI KHÁC
    ]
  }
}
```

### Event/Action qua Network
- **Client -> Host:** `JOIN_ROOM`, `RECONNECT`, `SUBMIT_VOTE` (Khi mở phase treo cổ, Client bấm nút tự Vote người khác trên đt của họ).
- **Host -> Client:** `STATE_SYNC` (Bắn state mới nhất xuống), `KICK_PLAYER`.

## 6. Rủi ro bảo mật & Chống lộ role
1. **Lộ role qua Network Tab:** Web App rất dễ bị người chơi "f12" để soi Network Payload. Nếu Host gửi nhầm `roleId` của mọi người trong object `publicState`, sẽ hỏng game. Phải kiểm thử cực kỳ nghiêm ngặt hàm `extractPlayerState()`.
2. **Ngắt kết nối giữa chừng (Disconnect):** Wi-Fi có thể rớt. Host phải lưu trữ ánh xạ `clientId <-> role` vào LocalStorage của Host. Nếu Client rớt mạng và vào lại, họ phải khôi phục được vai trò cũ thay vì bị tính là người mới. (Client sinh ra 1 UUID cục bộ để làm Session ID).
3. **Nhìn trộm màn hình chéo:** Màn hình Client cần có chức năng "Bấm giữ để xem vai" hoặc làm tối màn hình, tránh người kế bên lén nhìn.

## 7. Lộ trình Triển khai Phase 2
- **Phase 2.1: Core Networking & Lobby (Đã chuẩn bị Refactor - Hoàn tất)**
  - Tách UI Home: "Chơi 1 máy" vs "Chơi qua Wi-Fi" (Dự kiến).
  - Đã tách `action-dispatcher.js` để định tuyến action. Toàn bộ logic DOM Event trong `app.js` đã chuyển thành action objects truyền qua Dispatcher.
  - Đã tạo `app-modes.js` chứa các mode: `offline`, `host`, `client`. Mode `offline` hiện tại đang sử dụng dispatcher nội bộ.
  - Các Action mang tính hệ thống như Tạo game, Bỏ phiếu, Next Phase, Giết/Hồi sinh đều đã đi qua Dispatcher. Các Side-effect (như `window.confirm` và thao tác với LocalStorage khi lưu Preset) vẫn giữ nguyên tại `app.js` để đảm bảo Dispatcher chỉ làm nhiệm vụ thuần đổi State.

- **Phase 2.1.1: Làm cứng hệ thống Action (Hoàn tất)**
  - Chuẩn hóa toàn bộ string event thành constant nằm tại `src/action-types.js`.
  - Tách từ điển map UI event sang Action Constant nằm tại `src/action-map.js`.
  - Bổ sung Guard trong `src/action-dispatcher.js` để chặn action không hợp lệ, không gây crash app và không mutate state bừa bãi.
  - Loại bỏ hoàn toàn string raw trong việc routing event, giảm thiểu rủi ro khi truyền action qua network giữa Client và Host.

- **Phase 2.2: Sync Role & Trạng thái**
  - Tích hợp công nghệ Network (WebRTC/PeerJS).
  - Tách UI Home: "Chơi 1 máy" vs "Chơi qua Wi-Fi".
  - Xây dựng UI Tạo phòng (Host) và Vào phòng (Client).
  - Client vào phòng hiển thị danh sách Lobby thời gian thực.
  - Host chốt danh sách, chia vai, bắn State Sync đầu tiên xuống Client.
  - Xây dựng UI cho Client: Hiện vai, báo Sống/Chết.
  - Host thao tác "Next Phase", "Giết", "Hồi sinh", tất cả Client tự nhận sự thay đổi trên màn hình.

- **Phase 2.3: Tương tác từ Client (Bỏ phiếu)**
  - Đưa tính năng Vote (vừa làm ở Phase 1.2) xuống máy Client.
  - Host mở Phase "Bỏ phiếu", màn hình Client sẽ hiện lên danh sách để họ tự bấm Vote.
  - Host nhận kết quả Vote tổng hợp, chốt và Treo cổ.

## 8. Nguyên tắc "Không phá vỡ Offline Mode"
- Đảm bảo tính tương thích ngược: Bản offline vẫn phải hoạt động mượt mà và độc lập. Các hàm của Phase 2 sẽ được viết riêng vào module mạng (`network-manager.js`) và chỉ can thiệp (wrapper) vào `game-state` chứ không sửa đổi các flow hiện tại của bản 1 máy.
