import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { Request, Response } from 'express';
import express = require('express');
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/graphql.index';

//PORT
const PORT = 4000;

// configure the server here
const serverConfig: ApolloServerExpressConfig = {
  schema,
  playground: {
    settings: {
      'editor.theme': 'dark',
      'editor.cursorShape': 'line',
    },
  },
};

//express initialization
const server = new ApolloServer(serverConfig);

const app = express();
server.applyMiddleware({ app });

app.get('/', (req: Request, res: Response) => {
  res.send('go to http://localhost:4000//graphql');
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
