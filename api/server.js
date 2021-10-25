const fs = require('fs');
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');


const url = "mongodb://localhost/tutorial_IT5007";
var db;


/**
 * part i: sample data and scalar data types
 */

// customed scalar type for Javascript Date()
const GraphQLDate = new GraphQLScalarType({
    name: 'GraphQLDate',
    description: "Date() type in GraphQL as a scalar",
    serialize(value) {
        return value.toISOString();
    },
    parseValue(value) {
        return new Date(value);
    },
    parseLiteral(ast) {
        return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
    },
});


/**
 * part ii: resolvers and their implementations
 */
const resolvers = {
    Query: {
        waitlist,
    },
    Mutation: {
        createCustomer,
        deleteCustomer,
    },
    GraphQLDate,
};

async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();

    const count = await db.collection("waitlist").countDocuments();
    console.log('Initiated the database with ', count, ' customers.\n');

    db.collection("waitlist").createIndex({ serialNo: 1 }, { unique: true });
    db.collection("waitlist").createIndex({ name: 1 });
    db.collection("waitlist").createIndex({ phone: 1 });
}

async function waitlist() {
    const waitlist = await db.collection("waitlist").find({}).toArray();
    return waitlist
}

async function createCustomer(_, { customer }) {
    try {
        customer.timestamp = new Date(Date.now());
        const insertResult = await db.collection("waitlist").insertOne(customer);
        const confirmedCustomer = await db.collection("waitlist").findOne({_id: insertResult.insertedId});
        return confirmedCustomer;
    } catch(e) {
        console.log(e);
        return customer
    }
}

async function deleteCustomer(_, { reference }) {
    target = parseInt(reference.serialNo);

    try {
        await db.collection("waitlist").deleteOne({serialNo: target});
        return {message: `Deleted customer No.${target} successfully!`};
    } catch(e) {
        console.log(e);
        return {message: "Deletion failed due to mismatch at the database."};
    }
}


/**
 * part iii: server setups
 */
const server = new ApolloServer({
    typeDefs: fs.readFileSync('schemas.graphql', 'utf-8'),
    resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

(async function () {
    try {
    await connectToDb();
    app.listen(5000, function () {
        console.log('API server started on port 5000');
    });
    } catch (err) {
        console.log('ERROR:', err);
    }
})();