const { MongoClient } = require("mongodb");


const url = "mongodb://localhost/tutorial_IT5007";

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


async function testWithAsync() {
    console.log("\n-------------Testing callbacks on MongoDB operations-------------\n");
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        await client.connect();
        console.log('\nConnected to MongoDB.');
        const db = client.db();
        const collection = db.collection('waitlist');
        
        const result = await collection.insertMany(sample_list);
        console.log('\nResult of insert:\n', result.insertedIds);

        const match = await collection.find({ _id: result.insertedIds}).toArray();
        console.log('\nResult of find:\n', match);
    } catch(err) {
        console.log("Error: " + err);
    } finally {
        client.close();
    }
}

testWithAsync();