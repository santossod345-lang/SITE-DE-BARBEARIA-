export const siteConfig = {
  name: 'Barbearia Alves',
  description: 'Barbearia premium com atendimento exclusivo e agendamento integrado ao ClientFlow.',
  bookingUrl: process.env.NEXT_PUBLIC_CLIENTFLOW_BOOKING_URL || 'https://app.clientflow.com',
  address: 'Av. Ítalo Bernardes, 303 - Jardim das Rosas, Ibirité - MG, 32432-140',
  phone: '(31) 997529550',
  hours: 'Segunda a sábado',
  mapEmbedUrl: 'https://www.google.com/maps?q=Av.+%C3%8Dtalo+Bernardes%2C+303+-+Jardim+das+Rosas%2C+Ibirit%C3%A9+-+MG%2C+32432-140&output=embed',
  instagramUrl: 'https://instagram.com/luuiz.dev',
  instagramHandle: '@luuiz.dev',
  professionals: [
    {
      name: 'Bruno',
      role: 'Barbeiro Especialista',
      bio: 'Com mais de 8 anos de experiência, Bruno é especialista em cortes modernos e degradês impecáveis. Apaixonado por transformar o visual dos clientes.',
      specialties: ['Degradê', 'Corte Social', 'Pigmentação', 'Design de Barba'],
      whatsapp: '5531997529550',
      initial: 'B',
    },
    {
      name: 'Paulo',
      role: 'Barbeiro & Barberista',
      bio: 'Paulo traz 6 anos de experiência e é referência em barba completa e acabamentos de precisão. Seu foco é a excelência em cada detalhe.',
      specialties: ['Barba Completa', 'Corte Executivo', 'Hidratação', 'Navalha'],
      whatsapp: '5531997529550',
      initial: 'P',
    },
  ],
};
