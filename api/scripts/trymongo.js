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
    console.log("\n-------------CRUD operation tests with MongoDB-------------\n");
    const client = new MongoClient(url, { useNewUrlParser: true });

    try {
        // test 1: test connection to mongoBD (locally)
        console.log("\n-----------Test 1: connection to MongoDB--------------");
        await client.connect();
        console.log('Connected to MongoDB.\n');
        const db = client.db();
        const collection = db.collection('waitlist');

        // test 2: clear the documents in the waitlist and test from an empty state
        console.log("\n-------------Test 2: Clearing the collection \"waitlist\"--------------");
        await collection.deleteMany({});
        const empty_content = await collection.find({}).toArray();
        console.log("Documents remained in the collection: \n", empty_content);
        
        // test 3: insertion test: insert multiple documents to collection "waitlist"
        console.log("\n-------------Test 3: Inserting documents to the waitlist--------------");
        const inserts = await collection.insertMany(sample_list);
        console.log('Inserted IDs:\n', inserts.insertedIds);

        // test 4: reading the waitlist with inserted documents
        console.log("\n-------------Test 4: Reading documents from the waitlist--------------");
        const match = await collection.find({}).toArray();
        console.log('Result of find:\n', match);

        //test 5: updating information of a document
        console.log("\n-------------Test 5: Updating data in a document----------------");
        const updates = await collection.updateOne({name: "Eddie"}, {$set: {phone: "01010101"}})
        const updatedCustomer = await collection.find({name: "Eddie"}).toArray();
        console.log("Resulting of updating the phone of customer \"Eddie\":", updatedCustomer);

        // test 6: deleting the documents from the waitlist, and recover an empty collection
        console.log("\n-------------Test 6: Deleting documents in the waitlist--------------");
        const deletes = await collection.deleteOne({name: "Eddie"});
        console.log("Result of deletion (on customer \"Eddie\"): ", deletes.acknowledged);
        var remainings = await collection.find({}).toArray();
        console.log("Remaining documents:\n", remainings);
        
        // Finalize: clear the collection
        console.log("\nCongratulations! You have passed all the tests!");
        await collection.deleteMany({});
        remainings = await collection.find({}).toArray();
        console.log("\nRecovering the collection with:\n", remainings);

    } catch(err) {
        console.log("Error: " + err);
    } finally {
        client.close();
    }
}

testWithAsync();