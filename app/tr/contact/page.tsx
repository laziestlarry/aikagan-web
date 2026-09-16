import type { Metadata } from 'next';
import ContactFormTR from './ContactFormTR';

export const metadata:Metadata={title:'İletişim ve Uygulama Talebi',description:'Ürün, dosya erişimi veya uygulama desteği ihtiyacınızı Türkçe anlatın. Göndermeden önce hangi sonucun oluşacağını görün.',alternates:{canonical:'https://aikagan.com/tr/contact',languages:{'tr-TR':'https://aikagan.com/tr/contact',en:'https://aikagan.com/contact'}}};
export default function ContactTR(){return <ContactFormTR/>}
