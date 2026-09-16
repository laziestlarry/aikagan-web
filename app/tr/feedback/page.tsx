import type { Metadata } from 'next';
import FeedbackFormTR from './FeedbackFormTR';
export const metadata:Metadata={title:'Geri Bildirim',description:'Ücretsiz araçlarda neyin işe yaradığını, karışık olduğunu veya eksik kaldığını Türkçe bildirin.',alternates:{canonical:'https://aikagan.com/tr/feedback',languages:{'tr-TR':'https://aikagan.com/tr/feedback',en:'https://aikagan.com/feedback'}}};
export default function FeedbackTR(){return <FeedbackFormTR/>}

