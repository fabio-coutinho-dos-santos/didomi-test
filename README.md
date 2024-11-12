# API-RESTful

Api RESTful desenvolvida para o cadastro de produtores rurais e suas fazendas como teste técnico para desenvolvedor back end na VERX.

## Principais elementos utilizados no desenvolvimento

- node v20.9.0
- express
- typescript
- postgres
- typeORM
- jest
- supertest
- eslint
- swagger
- docker
- docker compose
- kubernetes

## Principais design patterns adotados

- Clean Code
- Single Responsability Principle (SRP)
- Don't repeat yourself (DRY)
- Keep it simple, stupid (KISS),
- You aren't gonna need it (YAGNY)
- Repository
- Dependency Injection
- Dependency Inversion
- Interface Segregation

## Arquitetura e Design do código

Toda a construção da api assim como a hierarquia de pastas foram definidos aplicando práticas de modelagem do Domain Driven Design (DDD) em conjunto com Clean Architecture. Dessa forma, a arquitetura proteje as regras de negócio, com as entidades referentes ao dominio principal da aplicação no nucleo, matendo as partes agregadas ao negócio nas extremidades da arquitetura, como sugerem as arquiteturas limpa e hexagonal.

Como parte das práticas do DDD, destaca-se a criação das entidades de domínio contendo suas respectivas validações oriundas das regras de negócio, assim como a construção de value objects quando se fez necessário. Além disso, toda a estrutura da hierarquia de pastas adotada mantendo uma linguagem ubiqua.

Por outro lado, destaca-se como práticas referentes a arquitetura limpa a criação de camadas anticorrupção entre os elementos de dominio e as partes agregadas da aplicação, possibilitando tanto a injeçao de dependências quanto a inversão dessas dependencias, tornando o código mais desacoplado.

Além disso, também foi utilizado arquitetura orientada a eventos em uma das features implementadas.

## Descrição

A Api elaborada possui duas entidades de domínio, Users e Events.
Como convensão para escopo do desenvolvimento do teste foi definido que um Users pode ter várias Events, contudo um Event pode pertencer apenas a um User.

Alé disso há tabela, events_history, que grava todos os eventos registrados para um usuário. Assim a tabela de events registra apenas os eventos mais recentes do usuário, mantendo apenas o status atual dos eventos para aquele usuário.

Para realizar as tarefas de CRUD destas entidades e suas respectivas regras de negócio elas foram modeladas para o Banco de dados postgres da seguinte forma:

- Tabelas:

  ![Alt text](docs/database/image.png)

Para realizar a atualização do status na tabela de events, foi utilizado o conceito de arquitetura orientada a eventos. Assim, quando um evento chega pelo controller, dentro do use case ele é gravado da tabela de events_history e em seguida é disparado um evento. Este evento é capturado e então é feita a atualização na tabela de events do status do consentimento do usuário.

O nível de maturidade adotado para elaboração da API foi o 2, já tornando-a RESTful e combinando o verbos HTTP com seus respectivos significados semânticos, assim como utilizando de forma expressiva os recursos a ações a serem executadas nas rotas da aplicação.

Todo o desenvolvimento foi guiado por testes em que foram elaborados testes automatizados de unidade para os pontos mais críticos da aplicação. Além disso, também foram desenvolvidos testes de integração para todas as rotas da aplicação, para o qual foi utilizado ou outro banco de dados exclusivo para testes.

- Cobertura de Testes da aplicação

![Alt text](docs/assets/test-coverage.png)

## Detalhes de implementação

- Altíssima cobertura de testes. Para verificar basta executar o comando **npm run test:cov** após configurar o projeto localmente.
- Utilizalção de git flow e conventional commits.
- Utilização de arquitetura orientada a eventos.
- Utilização de logs estruturados em formato JSON para facilitar o scrap de ferramentas de observabilidade

### Devido ao escopo ser uma aplicação de teste não foram adotadas:

- Instrumentação de métricas, traces e logs para observabilidade.
- Esteira completa de ci-cd para deploy da aplicação em produção.

## Ci-Cd

- Como prática de Devops abrangendo construções e entregas contínuas, para escopo deste teste foi criado um pipeline de ci com github actions que realiza o build do projeto, executa a ferramenta de lint para conferência de errors estáticos do código e também executa os testes unitário da aplicação.

- Por outro lado, como entrega contínua, a aplicação é implantada no serviço Cloud Run do GCP que é vinculado ao repositório do projeto e, quando ocorre uma atualização no branch main é construída uma nova versão a partir da imagem docker, descrita no Dockerfile e, essa nova versão já fica disponível em produção.

- Para proteção do deploy utilizando essa estratégia basta configurar o repositório no github para não aceitar push diretamente no branch main, sendo que isso śo poderá ocorrer via aprovação de PR e, também configurar que a PR só porderá ser aprovada após a execução do pipeline. Por questões de agilidade, e por se tratar de uma aplicação com escopo de teste, não foram aplicadas essas configurações

- Outra estratégia, que não foi adotada devido a envolver custos e escopo, é a integração do pipeline de ci com o sonarqube onde podem ser inferidas regras para barrar códigos mal escritos e com baixa porcentagem de cobertura de testes.

- Para execução da aplicação são necessários 2 bancos de dados, um para os dados da aplicação e o outro para a execução dos testes de integração. Localmente o arquivo docker compose já constrói esses dois bancos, entretando para produção apenas o banco da aplicação foi criado em um seviço do provedor Render.

- Foi elaborado também os arquivo de deployment.yaml, secrets.yaml e service.yamol para que e aplicação seja implantada em um cluster kubernetes apenas configurando as variáveis de ambiente corretamente.

- **OBS**: A escolha de hospedagem da aplicação no GCP e do banco de dados no provedor Render foi devido a ter a disponibilidade destes recursos de forma gŕatis com algumas limitações, mas sendo suficiente para testar a aplicação em um ambiente de produção e serverless. Outras estratégias poderiam ser utilizadas aqui, como construção das pipelines de Ci diretamente nos cloud providers via Code Pipeline (AWS) ou Cloud Build (GCP), combinando estratégias de contrução da imagem docker e gravação desta no artifact registry (GCP) ou ECR (AWS) e posterior implantação como serverless no Cloud Run(GCP) ou Fargate(AWS). Estas estratégias assim como outras possíveis não foram adotadas pois envolvem custos.

## Documentação OpenApi e Aplicação de produção

- Url de prdução no serviço do Cloud Run do GCP = https://didomi-app-test-370724019807.us-central1.run.app

- Foi elaborado a documentação da api em formato OpenApi que está contido em docs/api.yaml. Neste arquivo estão descritas todas as rotas da aplicação.

- Para visualizar essa documentação assim como executar as requisições, foi utilizado o swagger podendo ser configurado para executar as requisições tanto no ambiente local, quanto em produção.

- A documentação swagger está disponível em: [https://didomi-app-test-370724019807.us-central1.run.app/api/v1/doc/](https://didomi-app-test-370724019807.us-central1.run.app/api/v1/doc/)

## Arquitetura aplicada

![Alt text](docs/architecture/v1.png)

## Melhorias arquiteturais

- Pensando que poderia haver a necessidade de escalar esta aplicação algumas melhorias arquiteturais poderiam ser adotadas visando aspectos como escalabilidade, elasticidade, disponibilidade e agilidade, são elas:

- Arquitetar o sistema com arquitura de microsserviços com straming de eventos, criando um ms para gerenciamento de usuários e atualização/criação dos consentimentos, mantendo no banco apenas o estado atual dos consentimentos e, o outro, de auditoria para receber requisições que podem ser mais custosas para o sistema para geração de relatório e outras demandas. Assim, seriam 2 microsserviços, com bancos de dados destintos e se comunicando via mensageria utilizando SQS, Kafka, RabbitMQ, PubSub ... etc.

- Deploy automatizado a partir de uma pipeline completa executando os testes unitários e de integração antes além de descrever os recusos computacionais que devem ser alocados para os serviços. Em seguida criação de Load Balancer e Auto Scale Group para permitir que a aplicação escale conforme a carga de requisições. Outra estratégia neste contexto que poderia ser adotada é o deploy em um cluster kubernetes configurando uma HPA adequada para realização de escala horizontal dos pods e adequação da aplicação à carga recebida.

- Como estratégias de autenticação e autorização poderiam ser utilizadas soluções gerenciadas como o Cognito(AWS) ou o Keycloak para serem os servidores de identidade da aplicação.

![Alt text](docs/architecture/v2.png)

## Execução local

### Utilizando docker compose

- Para executar o código localmente utilizando docker compose basta clonar o repositório e seguir os seguintes passos:

  - Criar um arquivo .env na raiz do projeto.
  - Configurar as seguintes variáveis de ambiente neste arquivo .env:
  - DB_URL_CONNECTION=postgres://user:password@svc-db:5432/postgres
  - DB_TEST_URL_CONNECTION=postgres://user:password@svc-db-test:5432/postgres
  - API_VERSION=v1
  - PORT=3000
  - Essas variáveis estão descritas no arquivo env-example.txt
  - Criar a rede interna do docker para conectar os containers executando o comando: **docker network create didomi-net**
  - Na raiz do projeto, executar o comando **docker-compose up**

- Seguindo esses passos os container dos bancos de dados e da aplicação serão criados e a aplicação será iniciada automáticamente.

### Utilizando node instalado

Para executar o código localmente basta clonar o repositório e seguir os seguintes passos:

- Criar um arquivo .env na raiz do projeto.
- Configurar as seguintes variáveis de ambiente neste arquivo .env:
- POSTGRES_URL_CONNECTION=production-database-url
- POSTGRES_TEST_URL_CONNECTION=production-database-test-url
- API_VERSION=v1
- PORT=3000
- Na raiz do projeto, executar os comandos:
- **npm install**
- **npm run start:dev**

**_OBS_**  Caso tenha o postgres também instalado localmente basta criar dois bancos distintos e configurar as variáveis de ambiente no seguinte padrão:

- postgres://user:password@host:5432/dbName

## Deploy no kubernetes

- Foi elaborado um arquivo de deployment, um de cervice e um de secret para realizar o deploy da aplicação em um cluster kubernetes.
- Para isso devem ser seguidos os seguintes passos: considerando um ambiente local com kubectl e minikube instalados:
  - Realizar o build da imagem docker, executando o comando: **docker build -t didomi-app-image .** . Estando na raiz do projeto
  - Copiar a imagem gerada para o repositório interno de imagens do minikube, executando o comando: **minikube image load didomi-app-image:latest**
  - Atualizar o arquivo secrets.yaml com as strings de conexão com os bancos de produção convertido para base64
  - na raiz do projeto executar o comando **kubectl apply -f cd/k8s/secrets.yaml**
  - na raiz do projeto executar o comando **kubectl apply -f cd/k8s/service.yaml**
  - na raiz do projeto executar o comando **kubectl apply -f cd/k8s/deployment.yaml**
  - Após isso pode ser feito um port forward do container dentro do kubernetes para que vc possa fazer requisições para ele utilizando sua rede local, executando o comando:
    - **kubectl port-forward <service-name> <localPort>:<servicePort>**
    - Exemplo: **kubectl port-forward didomi-service 3000:3000**
  - Assim, ao eviar requisições para http://localhost:3000/ vc estará acessando o pod dentro do k8s
