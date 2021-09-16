import { Request, Response } from "express";
import express = require('express');
import { graphqlHTTP } from "express-graphql";
import schema from './graphql/graphql.index'

//express initialization
const app = express();

//PORT
const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});


app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

//localhost setup
app.listen(PORT, () => {
  console.log("Graphql server now up at port ", PORT)
});