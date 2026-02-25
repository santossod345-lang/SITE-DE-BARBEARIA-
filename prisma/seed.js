const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Limpa dados existentes
  await prisma.review.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.barbershop.deleteMany();
  await prisma.integrationQueue.deleteMany();

  const barbershop = await prisma.barbershop.create({
    data: {
      name: 'Barbearia Luxo Dubai',
      slug: 'barbearia-luxo-dubai',
      logo: null,
      whatsappNumber: '+5511999999999',
    },
  });

  // Cria barbeiros
  const bruno = await prisma.barber.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Bruno',
      description: 'Especialista em cortes modernos e clássicos',
      defaultStartTime: '09:00',
      defaultEndTime: '18:00',
      isActive: true,
    },
  });

  const paulinho = await prisma.barber.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Paulinho',
      description: 'Mestre em barbas e degradês',
      defaultStartTime: '10:00',
      defaultEndTime: '19:00',
      isActive: true,
    },
  });

  console.log('✅ Barbeiros criados:', bruno.name, paulinho.name);

  // Cria serviços
  const corteTradicional = await prisma.service.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Corte Tradicional',
      description: 'Corte clássico com acabamento impecável',
      duration: 45,
      price: 80.00,
      isActive: true,
    },
  });

  const cortePremium = await prisma.service.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Corte Premium',
      description: 'Corte moderno com técnicas avançadas',
      duration: 60,
      price: 120.00,
      isActive: true,
    },
  });

  const barbaCompleta = await prisma.service.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Barba Completa',
      description: 'Modelagem e tratamento de barba',
      duration: 40,
      price: 70.00,
      isActive: true,
    },
  });

  const combo = await prisma.service.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Combo Luxo',
      description: 'Corte + Barba + Tratamento Capilar',
      duration: 90,
      price: 180.00,
      isActive: true,
    },
  });

  console.log('✅ Serviços criados');

  // Cria clientes de exemplo
  const cliente1 = await prisma.customer.create({
    data: {
      barbershopId: barbershop.id,
      name: 'João Silva',
      phone: '+55 11 99999-1111',
      email: 'joao@example.com',
    },
  });

  const cliente2 = await prisma.customer.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Carlos Santos',
      phone: '+55 11 99999-2222',
      email: 'carlos@example.com',
    },
  });

  const cliente3 = await prisma.customer.create({
    data: {
      barbershopId: barbershop.id,
      name: 'Pedro Oliveira',
      phone: '+55 11 99999-3333',
    },
  });

  await prisma.gallery.createMany({
    data: [
      {
        barbershopId: barbershop.id,
        imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
        caption: 'Ambiente premium',
      },
      {
        barbershopId: barbershop.id,
        imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
        caption: 'Cortes modernos',
      },
    ],
  });

  console.log('✅ Clientes de exemplo criados');

  // Cria agendamentos de exemplo
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const appointment1 = await prisma.appointment.create({
    data: {
      barbershopId: barbershop.id,
      barberId: bruno.id,
      serviceId: cortePremium.id,
      customerId: cliente1.id,
      date: tomorrow,
      time: '10:00',
      status: 'confirmed',
      notes: 'Cliente preferencial',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      barbershopId: barbershop.id,
      barberId: paulinho.id,
      serviceId: combo.id,
      customerId: cliente2.id,
      date: tomorrow,
      time: '14:00',
      status: 'confirmed',
    },
  });

  // Cria um agendamento concluído para poder avaliar
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const completedAppointment = await prisma.appointment.create({
    data: {
      barbershopId: barbershop.id,
      barberId: bruno.id,
      serviceId: corteTradicional.id,
      customerId: cliente3.id,
      date: yesterday,
      time: '15:00',
      status: 'completed',
    },
  });

  console.log('✅ Agendamentos de exemplo criados');

  // Cria avaliações de exemplo (já aprovadas)
  await prisma.review.create({
    data: {
      appointmentId: completedAppointment.id,
      rating: 5,
      comment: 'Excelente atendimento! O Bruno é um profissional excepcional. Super recomendo!',
      approved: true,
      token: 'example-token-1',
    },
  });

  console.log('✅ Avaliações de exemplo criadas');

  // Cria disponibilidade customizada (exemplo: Bruno não trabalha no próximo domingo)
  const nextSunday = new Date();
  nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7));
  nextSunday.setHours(0, 0, 0, 0);

  await prisma.availability.create({
    data: {
      barberId: bruno.id,
      date: nextSunday,
      isAvailable: false,
      notes: 'Dia de folga',
    },
  });

  console.log('✅ Disponibilidade customizada criada');

  console.log('\n🎉 Seed concluído com sucesso!\n');
  console.log('📊 Resumo:');
  console.log(`   - ${await prisma.barber.count()} barbeiros`);
  console.log(`   - ${await prisma.service.count()} serviços`);
  console.log(`   - ${await prisma.customer.count()} clientes`);
  console.log(`   - ${await prisma.appointment.count()} agendamentos`);
  console.log(`   - ${await prisma.review.count()} avaliações`);
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
