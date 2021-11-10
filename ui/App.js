import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


const SLOTS = 25;


function App() {
    // wait list state
    const [waitlist, setWaitlist] = useState(Array(SLOTS))
    // input states
    const [input_serialNo, setSerialNo] = useState(null);
    const [input_name, setName] = useState("");
    const [input_phone, setPhone] = useState("");

    async function addCustomer() {
        if (isNaN(input_serialNo)) {
            Alert.alert("Error: Invalid Serial No.", "Please provide a number as the Serial No.!");
        } else if (input_serialNo < 1 || input_serialNo > 25) {
            Alert.alert("Error: Invalid Serial No.", "Sorry, you must provide a serial No. between 1 and 25!");
        } else if (input_name == "") {
            Alert.alert("Error: Customer Name required", "Sorry, you must provide the name of the customer!");
        } else if (input_phone == "") {
            Alert.alert("Error: Phone Number required", "Sorry, you must provide a phone number of the customer!");
        } else {
            const customer = {serialNo: input_serialNo, name: input_name, phone: input_phone};
            const query = `mutation createCustomer($customer: CreationInputs!) {
                createCustomer(customer: $customer) {
                    serialNo
                }
            }`;

            const response = await fetch("http://10.0.2.2:5000/graphql", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({query, variables:{customer}})
            });
            const body_str = await response.text();
            const resultNo = JSON.parse(body_str).data.createCustomer.serialNo;
            if (resultNo == -1) {
                Alert.alert("Error: Invalid Serial No.", `Sorry, serial No. ${customer.serialNo} is already occupied!`);
            } else {
                Alert.alert("Creation Succeeds", `Successfully added customer to slot ${resultNo}!`);
                setSerialNo(null);
                setName("");
                setPhone("");
            }
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Add New Customer</Text>
            <TextInput
                placeholder="Choose a slot between 1 and 25."
                value={input_serialNo}
                onChangeText={setSerialNo}
                keyboardType="numeric"
                style={styles.input}
            ></TextInput>
            <TextInput
                placeholder="Enter the name of the customer."
                value={input_name}
                onChangeText={setName}
                style={styles.input}
            ></TextInput>
            <TextInput
                placeholder="Enter a valid phone number."
                value={input_phone}
                onChangeText={setPhone}
                style={styles.input}
            ></TextInput>
            <View style={styles.button}>
                <Button
                    title="Add New Customer"
                    onPress={addCustomer}
                    color="#2196F3"
                ></Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#454545",
        textAlign: "center",
        backgroundColor: "#eeeeee"
    },
    input: {
        backgroundColor: '#e0e0e0',
        margin: 20,
        marginBottom: 0,
        paddingLeft: 10,
        borderRadius: 15,
        fontSize: 16
    },
    button: {
        margin: 20,
        marginBottom: 45
    }
});

export default App;