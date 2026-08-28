// src/index.ts
import app from './app';
import { initScheduler } from './scheduler';
import { env } from './config/env';

const PORT = env.PORT;

(async () => {
  try {
    await initScheduler();
    app.listen(PORT, () => {
      console.log('==================================================');
      console.log('?? DevPulse Backend Server is running!');
      console.log(?? Listening on: http://localhost:);
      console.log(?? Health Check: http://localhost:/api/v1/health);
      console.log(??  Environment: );
      console.log('==================================================');
    });
  } catch (err) {
    console.error('Failed to start scheduler or server', err);
    process.exit(1);
  }
})();
