const fs = require('fs');
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');


/**
 * part i: sample data and scalar data types
 */
// sample data for a waitlist
const sample_list = [
    {
    serialNo: 1, name: 'Ravan', phone: "12345678",
    timestamp: new Date('2019-01-15 00:01:02'),
    },
    {
    serialNo: 12, name: 'Eddie', phone: "11110000",
    timestamp: new Date('2019-01-16 06:05:04'),
    },
];

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

function waitlist() {
    return sample_list
}

function createCustomer(_, { customer }) {
    customer.timestamp = new Date(Date.now());
    sample_list.push(customer);
    return customer;
}

function deleteCustomer(_, { serialNo }) {
    target = parseInt(serialNo);
    for (let i = 0; i < sample_list.length; i++) {
        if (sample_list[i].serialNo == target) {
            sample_list.splice(i,1);
            return `Deleted customer No.${target} successfully!`;
        }
    }
    return `Deletion failed.`;
}


/**
 * part iii: server setups
 */
const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schemas.graphql', 'utf-8'),
    resolvers,
});

const app = express();

app.use("/", express.static("public"));

server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function() {
    console.log("Application started on port 3000.");
});