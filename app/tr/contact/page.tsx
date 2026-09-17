import type { Metadata } from 'next';
import ContactFormTR from './ContactFormTR';

export const metadata:Metadata={title:'İletişim ve Uygulama Talebi',description:'Bir ürün hakkında soru sormak, dosyanıza ulaşmak veya işiniz için yardım almak mı istiyorsunuz? Bize Türkçe yazabilirsiniz.',alternates:{canonical:'https://aikagan.com/tr/contact',languages:{'tr-TR':'https://aikagan.com/tr/contact',en:'https://aikagan.com/contact'}}};
export default function ContactTR(){return <ContactFormTR/>}
