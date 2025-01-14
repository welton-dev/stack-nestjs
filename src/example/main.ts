import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		snapshot: true,
		logger: ['error', 'warn', 'log', 'debug', 'verbose'],
	});

	// Manipuladores de processo para encerramento gracioso
	process.on('SIGTERM', async () => {
		await app.close();
		process.exit(0);
	});

	process.on('SIGINT', async () => {
		await app.close();
		process.exit(0);
	});

	process.on('SIGUSR1', async () => {
		await app.close();
		process.exit(0);
	});

	await app.listen(3001, () => {
		console.log('Server started on port 3001');
	});
}

bootstrap();
