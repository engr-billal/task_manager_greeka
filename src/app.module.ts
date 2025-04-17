import { Module, OnModuleInit } from '@nestjs/common';
import { pool } from './db';
import { TaskModule } from './task/task.module';

@Module({
  imports: [TaskModule],
})
export class AppModule implements OnModuleInit {
  // Lifecycle hook that runs when the module is initialized
  async onModuleInit() {
    try {
      // Test if the connection works
      const result = await pool.query('SELECT NOW()'); // A simple query to check the connection
      console.log('Database connection successful:', result.rows);
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}
