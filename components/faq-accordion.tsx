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
    answer: 'Bạn có thể đặt vé xe trực tuyến thông qua website của chúng tôi bằng cách chọn điểm đi, điểm đến, ngày đi và số lượng hành khách. Sau đó, chọn chuyến xe phù hợp và thanh toán.'
  },
  {
    question: 'Tôi có thể thanh toán bằng những phương thức nào?',
    answer: 'Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau bao gồm: thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng, và các ví điện tử phổ biến.'
  },
  {
    question: 'Làm thế nào để hủy vé đã đặt?',
    answer: 'Bạn có thể hủy vé đã đặt trong tài khoản của mình hoặc liên hệ với bộ phận hỗ trợ khách hàng. Lưu ý rằng việc hủy vé có thể phát sinh phí tùy theo thời điểm hủy.'
  },
  {
    question: 'Tôi có thể thay đổi thông tin hành khách sau khi đặt vé không?',
    answer: 'Có, bạn có thể thay đổi thông tin hành khách trước 24 giờ so với giờ khởi hành. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để được hướng dẫn.'
  },
  {
    question: 'Hành lý được phép mang theo là bao nhiêu?',
    answer: 'Mỗi hành khách được phép mang theo một kiện hành lý xách tay không quá 7kg và một kiện hành lý ký gửi không quá 20kg. Các quy định cụ thể có thể khác nhau tùy theo tuyến đường.'
  }
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

