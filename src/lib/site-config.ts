export const siteConfig = {
  name: 'Barbearia do Alves',
  description: 'Barbearia premium com atendimento exclusivo e agendamento integrado ao ClientFlow.',
  bookingUrl: process.env.NEXT_PUBLIC_CLIENTFLOW_BOOKING_URL || 'https://app.clientflow.com',
  address: 'Rua Exemplo, 123 - Centro, São Paulo - SP',
  phone: '(11) 99999-9999',
  hours: 'Seg a Sáb, 09:00 às 20:00',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976588060726!2d-46.65342!3d-23.56168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQyLjEiUyA0NsKwMzknMTIuMyJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000',
  professionals: [
    {
      name: 'Bruno',
      role: 'Barbeiro Especialista',
      bio: 'Com mais de 8 anos de experiência, Bruno é especialista em cortes modernos e degradês impecáveis. Apaixonado por transformar o visual dos clientes.',
      specialties: ['Degradê', 'Corte Social', 'Pigmentação', 'Design de Barba'],
      whatsapp: '5511999999999',
      initial: 'B',
    },
    {
      name: 'Paulo',
      role: 'Barbeiro & Barberista',
      bio: 'Paulo traz 6 anos de experiência e é referência em barba completa e acabamentos de precisão. Seu foco é a excelência em cada detalhe.',
      specialties: ['Barba Completa', 'Corte Executivo', 'Hidratação', 'Navalha'],
      whatsapp: '5511988888888',
      initial: 'P',
    },
  ],
};
