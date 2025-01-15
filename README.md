[![Pull Request Checks](https://github.com/{seu-usuario}/{seu-repo}/actions/workflows/pull-request.yml/badge.svg)](https://github.com/{seu-usuario}/{seu-repo}/actions/workflows/pull-request.yml)
[![codecov](https://codecov.io/gh/{seu-usuario}/{seu-repo}/branch/main/graph/badge.svg)](https://codecov.io/gh/{seu-usuario}/{seu-repo})
[![Known Vulnerabilities](https://snyk.io/test/github/{seu-usuario}/{seu-repo}/badge.svg)](https://snyk.io/test/github/{seu-usuario}/{seu-repo})

# My API Consumer Client

Módulo NestJS para consumo de API externa.

## Instalação

```bash
yarn add my-api-consumer-client
```

## Uso

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ApiClientModule } from 'my-api-consumer-client';

@Module({
	imports: [
		ApiClientModule.register({
			baseURL: 'https://api.exemplo.com',
			apiKey: 'seu-api-key',
		}),
	],
})
export class AppModule {}

// seu-servico.service.ts
import { Injectable } from '@nestjs/common';
import { ApiClientService } from 'my-api-consumer-client';

@Injectable()
export class SeuServico {
	constructor(private readonly apiClient: ApiClientService) {}

	async buscarDados() {
		try {
			const response = await this.apiClient.getData();
			return response;
		} catch (error) {
			throw error;
		}
	}
}
```

## Scripts Disponíveis

- `yarn build`: Compila o projeto
- `yarn lint`: Executa o ESLint
- `yarn format`: Formata o código com Prettier
- `yarn test`: Executa os testes

## Licença

MIT
