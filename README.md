# My API Consumer Client

Cliente TypeScript para consumo de API externa.

## Instalação

```bash
npm install my-api-consumer-client
```

## Uso

```typescript
import { ApiClient } from 'my-api-consumer-client';

const client = new ApiClient('https://api.exemplo.com', 'seu-api-key');

// Exemplo de uso
async function exemplo() {
  try {
    const response = await client.getData();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

## Scripts Disponíveis

- `npm run build`: Compila o projeto
- `npm run lint`: Executa o ESLint
- `npm run format`: Formata o código com Prettier
- `npm test`: Executa os testes

## Licença

MIT
