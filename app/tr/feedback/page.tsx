import type { Metadata } from 'next';
import FeedbackFormTR from './FeedbackFormTR';
export const metadata:Metadata={title:'Geri Bildirim',description:'Deneyiminizi bizimle paylaşın. Faydalı bulduğunuz özellikleri ve geliştirmemizi istediğiniz noktaları görüşlerinizle şekillendirin.',alternates:{canonical:'https://aikagan.com/tr/feedback',languages:{'tr-TR':'https://aikagan.com/tr/feedback',en:'https://aikagan.com/feedback'}}};
export default function FeedbackTR(){return <FeedbackFormTR/>}

