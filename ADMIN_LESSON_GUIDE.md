# 📚 Hướng dẫn Quản lý Bài học - Admin

## ✨ Các cải tiến mới trong form tạo bài học

### 1. **Slug - Đường dẫn URL tự động** 💡

**Slug là gì?**
- Là phần đường dẫn URL thân thiện cho bài học
- Tự động được tạo từ tiêu đề bài học

**Ví dụ:**
```
Tiêu đề: "Phương trình bậc nhất một ẩn"
Slug tự động: "phuong-trinh-bac-nhat-mot-an"
URL: https://your-site.com/lessons/phuong-trinh-bac-nhat-mot-an
```

**Quy tắc:**
- ✅ Chỉ dùng chữ thường (a-z)
- ✅ Chỉ dùng số (0-9)
- ✅ Dùng dấu gạch ngang (-) thay khoảng trắng
- ❌ Không dấu tiếng Việt
- ❌ Không ký tự đặc biệt (@, #, $, v.v.)

**Tính năng:**
- 🤖 **Tự động tạo**: Khi bạn nhập tiêu đề, slug sẽ tự động được tạo
- ✏️ **Có thể chỉnh sửa**: Bạn vẫn có thể sửa slug nếu muốn
- 💡 **Gợi ý rõ ràng**: Có hướng dẫn ngay bên dưới ô nhập liệu

---

### 2. **Ảnh bìa (Thumbnail)** 🖼️

**2 cách để thêm ảnh bìa:**

#### **Cách 1: Dùng đường dẫn URL** 🔗
- Nhấn nút "🔗 Dùng đường dẫn URL"
- Dán link ảnh vào ô
- Ví dụ:
  - `https://imgur.com/abc123.jpg`
  - `https://i.ibb.co/xyz/image.png`
  - Link Google Drive (phải public)

**Ưu điểm:**
- ✅ Nhanh chóng
- ✅ Không tốn dung lượng server
- ✅ Dễ thay đổi

**Cách lấy link Google Drive:**
1. Upload ảnh lên Google Drive
2. Chuột phải → Chia sẻ → Bất kỳ ai có link
3. Copy link và dán vào form

#### **Cách 2: Tải ảnh lên** 📤
- Nhấn nút "📤 Tải ảnh lên"
- Chọn file ảnh từ máy tính
- Xem trước ngay sau khi chọn

**Khuyến nghị:**
- Kích thước: 800x600px (tỷ lệ 4:3)
- Định dạng: JPG hoặc PNG
- Dung lượng: Dưới 500KB để load nhanh

---

### 3. **Video bài giảng** 🎥

**2 cách để thêm video:**

#### **Cách 1: Dùng đường dẫn URL** 🔗
- Nhấn nút "🔗 Dùng đường dẫn URL"
- Dán link video vào ô

**Các loại link được hỗ trợ:**

**YouTube:**
```
https://youtube.com/watch?v=abc123
https://youtu.be/abc123
```

**Google Drive:**
```
https://drive.google.com/file/d/FILE_ID/view
```

**Video trực tiếp:**
```
https://example.com/videos/lesson1.mp4
```

**Ưu điểm:**
- ✅ Không tốn băng thông
- ✅ YouTube/Drive có CDN tốt
- ✅ Hỗ trợ nhiều định dạng

#### **Cách 2: Tải video lên** 📤
- Nhấn nút "📤 Tải video lên"
- Chọn file video từ máy tính

**Lưu ý:**
- ⚠️ File video thường rất lớn (hàng trăm MB)
- ⚠️ Tốn thời gian upload
- ⚠️ Cần server có dung lượng lưu trữ

**Khuyến nghị:**
- 💡 Nên dùng YouTube hoặc Google Drive
- 💡 Upload lên YouTube → Lấy link → Dán vào form
- 💡 Nếu video riêng tư: Dùng Google Drive với link chia sẻ

---

## 📋 Quy trình tạo bài học mới

### Bước 1: Nhập thông tin cơ bản
1. **Tiêu đề**: Nhập tên bài học (VD: "Phương trình bậc hai")
2. **Slug**: Tự động tạo, có thể chỉnh sửa nếu cần
3. **Mô tả**: Viết mô tả ngắn về bài học

### Bước 2: Thiết lập chi tiết
1. **Lớp**: Chọn khối lớp (6, 7, 8, hoặc 9)
2. **Thời lượng**: Nhập số phút dự kiến
3. **Độ khó**: Chọn Dễ/Trung bình/Khó

### Bước 3: Thêm media
1. **Ảnh bìa**: Chọn URL hoặc Upload
2. **Video**: Chọn URL hoặc Upload

### Bước 4: Nội dung và công khai
1. **Nội dung**: Nhập nội dung HTML
2. **Công khai**: Tick ✓ để học sinh nhìn thấy

### Bước 5: Lưu
- Nhấn "💾 Lưu bài học" để hoàn tất

---

## 💡 Mẹo sử dụng

### Về Slug:
- ✅ Giữ slug ngắn gọn nhưng mô tả rõ
- ✅ Slug tốt: `phuong-trinh-bac-2`, `hinh-hoc-tam-giac`
- ❌ Slug không tốt: `bai-hoc-1`, `lesson-123`

### Về ảnh bìa:
- ✅ Dùng ảnh liên quan đến chủ đề bài học
- ✅ Ảnh rõ ràng, dễ nhìn
- ✅ Thống nhất phong cách giữa các bài học
- 💡 Nguồn ảnh miễn phí: Unsplash, Pexels, Pixabay

### Về video:
- ✅ Nên dùng YouTube cho dễ quản lý
- ✅ Tạo playlist trên YouTube cho từng lớp
- ✅ Đặt tên video rõ ràng
- 💡 YouTube cho phép unlisted (không public nhưng có link vẫn xem được)

---

## ❓ Câu hỏi thường gặp

**Q: Slug có bắt buộc không?**
A: Có, slug là bắt buộc vì nó tạo URL cho bài học.

**Q: Slug có được tự động tạo không?**
A: Có! Khi bạn gõ tiêu đề, slug tự động được tạo. Bạn có thể chỉnh sửa nếu muốn.

**Q: Có thể dùng video từ YouTube không?**
A: Có! Chỉ cần copy link video YouTube và dán vào ô Video URL.

**Q: Upload ảnh/video có giới hạn dung lượng không?**
A: Hiện tại ảnh nên dưới 500KB, video thì nên dùng URL thay vì upload trực tiếp.

**Q: Làm sao để ảnh Google Drive hiển thị được?**
A: Phải set quyền "Anyone with the link can view" trong Google Drive.

**Q: Có thể thay đổi slug sau khi tạo không?**
A: Có thể, nhưng sẽ thay đổi URL bài học. Học sinh đã bookmark sẽ mất link cũ.

---

## 🔧 Xử lý sự cố

**Ảnh không hiển thị:**
- ✅ Kiểm tra link có mở được trong tab mới không
- ✅ Đảm bảo link kết thúc bằng .jpg, .png, hoặc .gif
- ✅ Với Google Drive, kiểm tra quyền truy cập

**Video không play:**
- ✅ Kiểm tra link YouTube có chính xác không
- ✅ Đảm bảo video không bị private/deleted
- ✅ Thử mở link trong trình duyệt ẩn danh

**Slug bị lỗi:**
- ✅ Đảm bảo không có dấu tiếng Việt
- ✅ Không dùng ký tự đặc biệt
- ✅ Chỉ dùng chữ thường, số, và dấu gạch ngang

---

**Chúc bạn quản lý bài học hiệu quả! 🎓**
