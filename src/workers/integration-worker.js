const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

const CLIENTFLOW_API_URL = process.env.CLIENTFLOW_API_URL;
const CLIENTFLOW_API_KEY = process.env.CLIENTFLOW_API_KEY;
const MAX_RETRIES = 3;

async function processIntegrationQueue() {
  console.log('🔄 Processing integration queue...');

  try {
    const pendingEvents = await prisma.integrationQueue.findMany({
      where: {
        status: 'pending',
        retries: { lt: MAX_RETRIES },
      },
      take: 10,
      orderBy: { createdAt: 'asc' },
    });

    if (pendingEvents.length === 0) {
      console.log('✅ No pending events');
      return;
    }

    console.log(`📊 Found ${pendingEvents.length} pending events`);

    for (const queueItem of pendingEvents) {
      try {
        const event = JSON.parse(queueItem.payload);

        const response = await axios.post(
          `${CLIENTFLOW_API_URL}/api/external/barbershop/events`,
          event,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${CLIENTFLOW_API_KEY}`,
              'X-API-Key': CLIENTFLOW_API_KEY,
            },
            timeout: 10000,
          }
        );

        // Sucesso
        await prisma.integrationQueue.update({
          where: { id: queueItem.id },
          data: { status: 'sent', lastAttempt: new Date() },
        });

        console.log(`✅ Event sent: ${event.event_type}`);
      } catch (error) {
        const newRetries = queueItem.retries + 1;

        await prisma.integrationQueue.update({
          where: { id: queueItem.id },
          data: {
            retries: newRetries,
            lastAttempt: new Date(),
            status: newRetries >= MAX_RETRIES ? 'failed' : 'pending',
            error: error.message,
          },
        });

        console.error(`❌ Failed retry ${newRetries}/${MAX_RETRIES}: ${queueItem.eventType}`);
      }
    }
  } catch (error) {
    console.error('❌ Error processing queue:', error);
  }
}

async function processReminders() {
  console.log('🔔 Processing reminders...');

  try {
    const now = new Date();

    const pendingReminders = await prisma.reminder.findMany({
      where: {
        status: 'pending',
        scheduledFor: { lte: now },
      },
      include: {
        appointment: {
          include: {
            customer: true,
            barber: true,
            service: true,
          },
        },
      },
      take: 20,
    });

    if (pendingReminders.length === 0) {
      console.log('✅ No reminders to send');
      return;
    }

    console.log(`📨 Found ${pendingReminders.length} reminders to send`);

    for (const reminder of pendingReminders) {
      try {
        // Aqui você integraria com WhatsApp API ou SMS
        console.log(`📱 Sending ${reminder.type} to ${reminder.appointment.customer.name}`);
        console.log(`   Phone: ${reminder.appointment.customer.phone}`);
        
        if (reminder.type === 'review_request') {
          console.log(`   Review link: ${process.env.NEXT_PUBLIC_APP_URL}/review?appointment=${reminder.appointmentId}`);
        } else {
          console.log(`   Appointment: ${reminder.appointment.barber.name} - ${reminder.appointment.date} ${reminder.appointment.time}`);
        }

        // Marca como enviado
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        });

        console.log(`✅ Reminder sent: ${reminder.type}`);
      } catch (error) {
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: {
            status: 'failed',
            error: error.message,
          },
        });

        console.error(`❌ Failed to send reminder: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Error processing reminders:', error);
  }
}

async function cleanExpiredWaitlist() {
  console.log('🧹 Cleaning expired waitlist...');

  try {
    const now = new Date();

    const result = await prisma.waitlist.deleteMany({
      where: {
        notified: true,
        expiresAt: { lt: now },
      },
    });

    if (result.count > 0) {
      console.log(`🗑️  Removed ${result.count} expired waitlist entries`);
    } else {
      console.log('✅ No expired entries');
    }
  } catch (error) {
    console.error('❌ Error cleaning waitlist:', error);
  }
}

// Executa a cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('\n⏰ Running scheduled tasks...');
  await processIntegrationQueue();
  await processReminders();
  await cleanExpiredWaitlist();
  console.log('✅ Scheduled tasks completed\n');
});

console.log('🚀 Integration Worker started');
console.log('📅 Running every 5 minutes');
console.log('⏸️  Press Ctrl+C to stop\n');

// Executa imediatamente ao iniciar
processIntegrationQueue();
processReminders();
cleanExpiredWaitlist();
