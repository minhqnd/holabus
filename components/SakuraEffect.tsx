import { useEffect } from 'react';

export const SakuraEffect = () => {
  useEffect(() => {
    const createSakura = () => {
      const sakura = document.createElement('div');
      sakura.className = 'sakura';
      
      // Random vị trí xuất hiện
      const startPositionLeft = Math.random() * window.innerWidth;
      
      // Random kích thước
      const size = Math.random() * 15 + 10;
      
      sakura.style.cssText = `
        left: ${startPositionLeft}px;
        width: ${size}px;
        height: ${size}px;
      `;

      document.body.appendChild(sakura);

      // Xóa lá sau khi animation kết thúc
      setTimeout(() => {
        sakura.remove();
      }, 10000);
    };

    // Tạo lá mới mỗi 300ms
    const interval = setInterval(createSakura, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}; 