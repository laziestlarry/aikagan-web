import type { Metadata } from 'next';
import FeedbackFormTR from './FeedbackFormTR';
export const metadata:Metadata={title:'Geri Bildirim',description:'Araçları denediniz mi? Neyi beğendiğinizi, nerede zorlandığınızı ve neyi değiştirmemizi istediğinizi bize yazın.',alternates:{canonical:'https://aikagan.com/tr/feedback',languages:{'tr-TR':'https://aikagan.com/tr/feedback',en:'https://aikagan.com/feedback'}}};
export default function FeedbackTR(){return <FeedbackFormTR/>}

