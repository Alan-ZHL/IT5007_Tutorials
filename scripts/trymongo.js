const { MongoClient } = require("mongodb");


url = "mongodb://localhost/tutorial_IT5007";


async function testWithAsync() {
    console.log("\n-------------Testing callbacks on MongoDB operations-------------\n");
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        await client.connect();
        console.log('\nConnected to MongoDB');
        const db = client.db();
        const collection = db.collection('waitlist');
        
        const customer = { serial_no: 1, name: 'A. Callback', phone: "12345678", timestamp: "2021-10-23" };
        const result = await collection.insertOne(customer);
        console.log('\nResult of insert:\n', result.insertedId);

        const match = await collection.find({ _id: result.insertedId}).toArray();
        console.log('\nResult of find:\n', match);
    } catch(err) {
        console.log("Error: " + err);
    } finally {
        client.close();
    }
}

testWithAsync();