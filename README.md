# Toàn bộ mã nguồn HTML, CSS, JS và Hình ảnh website Sơn MY HOUR

Toàn bộ dữ liệu website từ **https://my-hour-home.base44.app/** đã được tải về đầy đủ trong thư mục `website_download/`.

## 1. Cấu trúc thư mục tải về (`website_download/`)

```
website_download/
│
├── index.html                           # Trang chủ (Homepage)
│
├── gioi-thieu/                          # /gioi-thieu
│   └── index.html                       # Trang Giới thiệu (đầy đủ nội dung & CSS)
│
├── san-pham/                            # /san-pham
│   ├── index.html                       # Danh mục tất cả sản phẩm
│   ├── son-noi-that/index.html          # Nhóm Sơn nội thất
│   ├── son-ngoai-that/index.html        # Nhóm Sơn ngoại thất
│   ├── son-chong-tham/index.html        # Nhóm Sơn chống thấm
│   ├── son-lot/index.html               # Nhóm Sơn lót
│   ├── son-chong-nong/index.html        # Nhóm Sơn chống nóng
│   ├── san-pham-khac/index.html         # Nhóm Sản phẩm khác
│   └── [tên-san-pham]/index.html        # 20 trang chi tiết từng sản phẩm
│
├── du-an/                               # /du-an
│   └── index.html                       # Trang Dự án & Công trình thực tế
│
├── cam-hung-mau-sac/                    # /cam-hung-mau-sac
│   └── index.html                       # Trang Cảm hứng màu sắc
│
├── tin-tuc/                             # /tin-tuc
│   ├── index.html                       # Danh sách Tin tức
│   ├── gia-son-nha/index.html           # Bài viết: Giá sơn nhà hiện nay
│   ├── quy-trinh-son-nha/index.html     # Bài viết: Quy trình sơn nhà
│   └── cac-loai-son-nha/index.html      # Bài viết: Các loại sơn nhà
│
├── nha-phan-phoi/                       # /nha-phan-phoi
│   └── index.html                       # Trang Hệ thống nhà phân phối
│
├── dang-ky-dai-ly/                      # /dang-ky-dai-ly
│   └── index.html                       # Trang Đăng ký đại lý
│
├── lien-he/                             # /lien-he
│   └── index.html                       # Trang Liên hệ
│
├── assets/                              # Toàn bộ CSS & JS bundle
│   ├── index-BDqGYMxC.css               # File CSS chính (Tailwind styling)
│   └── index-BG3fZPr5.js                # File Javascript chính (React app)
│
├── static/js/                           # Script bổ trợ
│   └── badge.js                         
│
├── images/                              # 64 hình ảnh tải về từ server CDN
│
├── pages_index.json                     # Danh mục metadata 38 trang đã tải
├── server.js                            # Máy chủ HTTP cục bộ
└── start_preview.bat                    # File chạy xem website offline với 1 click
```

---

## 2. Cách xem website (Hỗ trợ cả 2 cách 100%)

### Cách 1: Mở trực tiếp bằng cách nhấp đúp file (Đã hỗ trợ chuyển trang mượt mà)
- Mở file [index.html](file:///c:/Users/Admin/Documents/sơn%20myhouse/website_download/index.html) bằng cách nhấp đúp trực tiếp.
- Tất cả các liên kết chuyển trang (Giới thiệu, Sản phẩm, Tin tức, Liên hệ, ...) đã được cấu hình đường dẫn tương đối (relative path) tự động chuyển giữa các file con mà không bao giờ bị lỗi `file:///C:/...` hay `ERR_FILE_NOT_FOUND`.

### Cách 2: Xem qua máy chủ nội bộ (Khuyên dùng)
- Nhấp đúp vào file [start_preview.bat](file:///c:/Users/Admin/Documents/sơn%20myhouse/start_preview.bat) ở thư mục gốc.
- Trình duyệt sẽ tự động mở `http://localhost:3000`. Bạn có thể duyệt qua tất cả menu, sản phẩm, tin tức, hình ảnh mượt mà offline không cần mạng internet.
