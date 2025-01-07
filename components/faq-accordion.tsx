'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Làm thế nào để đặt vé xe?',
    answer: 'Bạn có thể đặt vé xe trực tuyến thông qua website của chúng tôi bằng cách chọn điểm đi, điểm đến, ngày đi... Sau đó, chọn chuyến xe phù hợp và thanh toán, hệ thống sẽ tự động xử lý và gửi vé cho bạn qua email.'
  },
  {
    question: 'Làm thế nào để hủy vé đã đặt?',
    answer: 'Bạn có thể hủy vé đã đặt qua liên hệ với bộ phận hỗ trợ khách hàng. Lưu ý rằng việc hủy vé có thể phát sinh phí tùy theo thời điểm hủy.'
  },
  {
    question: 'Có cần in vé khi lên xe không?',
    answer: 'Không cần thiết, bạn có thể sử dụng vé điện tử hiển thị trên điện thoại hoặc mã đặt vé để làm thủ tục lên xe.'
  },
  {
    question: 'Tôi có thể thay đổi thông tin hành khách sau khi đặt vé không?',
    answer: 'Có, bạn có thể thay đổi thông tin hành khách trước 24 giờ so với giờ khởi hành. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để được hướng dẫn.'
  },
  {
    question: 'Hành lý được phép mang theo là bao nhiêu?',
    answer: 'Mỗi hành khách được phép mang theo một kiện hành lý xách tay không quá 7kg và một kiện hành lý ký gửi không quá 20kg. Các quy định cụ thể có thể khác nhau tùy theo tuyến đường.'
  },
  {
    question: 'Tôi cần có mặt tại bến xe trước giờ khởi hành bao lâu?',
    answer: 'Hành khách nên có mặt tại bến xe ít nhất 30 phút trước giờ khởi hành để làm thủ tục và lên xe đúng giờ.'
  },
  {
    question: 'Nếu xe bị hủy chuyến, tôi có được hoàn tiền không?',
    answer: 'Trong trường hợp xe bị hủy chuyến do lỗi từ chúng tôi hoặc hết vé, bạn sẽ được hoàn tiền hoặc hỗ trợ đổi chuyến xe khác theo nhu cầu.'
  },
]

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="rounded-3xl bg-white p-6 shadow-lg">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

