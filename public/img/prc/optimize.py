from PIL import Image
import os

def optimize_images(folder_path):
    # Kích thước mục tiêu
    target_size = (350, 160)
    
    # Duyệt qua tất cả các file trong thư mục
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            file_path = os.path.join(folder_path, filename)
            
            try:
                # Mở ảnh
                with Image.open(file_path) as img:
                    # Chuyển đổi ảnh sang RGB nếu là RGBA
                    if img.mode == 'RGBA':
                        img = img.convert('RGB')
                    
                    # Resize và crop ảnh về kích thước mong muốn
                    # Đầu tiên resize để giữ tỷ lệ
                    img.thumbnail((max(target_size[0], target_size[0] * img.size[1] / img.size[0]),
                                max(target_size[1], target_size[1] * img.size[0] / img.size[1])))
                    
                    # Tính toán vị trí để crop
                    left = (img.size[0] - target_size[0]) / 2
                    top = (img.size[1] - target_size[1]) / 2
                    right = left + target_size[0]
                    bottom = top + target_size[1]
                    
                    # Crop ảnh
                    img = img.crop((left, top, right, bottom))
                    
                    # Lưu ảnh với chất lượng thấp hơn
                    output_path = os.path.join(folder_path, f"optimized_{filename}")
                    img.save(output_path, quality=70, optimize=True)
                    
                print(f"Đã xử lý thành công: {filename}")
                
            except Exception as e:
                print(f"Lỗi khi xử lý {filename}: {str(e)}")

if __name__ == "__main__":
    # Thay đổi đường dẫn này thành đường dẫn thư mục chứa ảnh của bạn
    folder_path = "."  # Thư mục hiện tại
    optimize_images(folder_path)
