var Router = ReactRouterDOM.HashRouter;
var Switch = ReactRouterDOM.Switch;
var Route = ReactRouterDOM.Route;
var Redirect = ReactRouterDOM.Redirect;
var Link = ReactRouterDOM.Link;
var useParams = ReactRouterDOM.useParams;


const grid_row = 5;
const grid_col = 5;
const slots = grid_row * grid_col;
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

// recover the timestamp to a js Date() object
function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) {
        return new Date(value);
    }
    return value;
}


// WaitlistPlatform: top level container that contains all the blocks
class WaitlistPlatform extends React.Component {
    constructor() {
        super();
        this.state = {
            freeslots: slots,
            waitlist: new Array(slots)
        };
        this.addToWaitlist = this.addToWaitlist.bind(this);
        this.deleteFromWaitlist = this.deleteFromWaitlist.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            waitlist {
                serialNo name phone timestamp
            }
        }`;
    
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        });
        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);
        let newWaitlist = new Array(slots);
        let number = 0;
        for (let customer of result.data.waitlist) {
            newWaitlist[customer.serialNo - 1] = customer;
            number ++;
        }
        this.setState({ waitlist: newWaitlist, freeslots: slots - number });
    }

    async addToWaitlist(customer) {
        const newWaitlist = this.state.waitlist.slice();
        const serialNo = parseInt(customer.serialNo);
        
        if (newWaitlist[serialNo - 1] != null) {
            alert(`Sorry, slot ${serialNo} is already occupied!`);
        } else if (isNaN(serialNo)) {
            alert("Sorry, you must provide a valid serial No. for the new customer!");
        } else if (serialNo <= 0 || serialNo > slots) {
            alert(`Sorry, please ensure the serial No. is between 1 and ${slots}!`);
        } else if (customer.name == "") {
            alert("Sorry, you must provide the name of the customer!");
        } else if (customer.phone == "") {
            alert("Sorry, you must provide a phone number of the customer!");
        } else {
            const query = `mutation createCustomer($customer: CreationInputs!) {
                createCustomer(customer: $customer) {
                    serialNo
                }
            }`;

            await fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ query, variables: { customer } })
            });
            alert(`Successfully added customer ${customer.name} (${customer.phone}) to slot ${serialNo}!`);
            this.loadData();
        }
    }

    async deleteFromWaitlist(serialNo) {
        const newWaitlist = this.state.waitlist.slice();
        
        if (isNaN(serialNo)) {
            alert("Sorry, please enter a valid serial No. to indicate a customer.");
        } else if (serialNo <= 0 || serialNo > slots) {
            alert(`Sorry, please ensure the serial No. is between 1 and ${slots}!`);
        } else if (newWaitlist[serialNo-1] == null) {
            alert(`Sorry, serial No. ${serialNo} is already empty!`);
        } else {
            const query = `mutation deleteCustomer($reference: DeletionInputs!) {
                deleteCustomer(reference: $reference) {
                    message
                }
            }`;
            const reference = {serialNo: serialNo};

            const result = await fetch('/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ query, variables: { reference } })
            });
            const textResult = await result.json();
            alert(textResult.data.deleteCustomer.message);
            this.loadData();
        }
    }
    
    render() {
        return (
            <Router>
                <div>
                    <DisplayHomepage/>
                    <DisplayFreeslots freeslots={this.state.freeslots}/>
                    <WaitlistGridTable waitlist={this.state.waitlist}/>

                    <Switch>
                        <Route path="/add">
                            <AddCustomer addToWaitlist={this.addToWaitlist}/>
                        </Route>
                        <Route path="/delete">
                            <DeleteCustomer deleteFromWaitlist={this.deleteFromWaitlist}/>
                        </Route>
                        <Route path="/">
                            <Toolbar />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}


// DisplayHomepage: block for homepage
function DisplayHomepage() {
    return (
        <div className="block_homepage">
            <h1> Welcome to the Hotel California~ </h1>
        </div>
    );
}


// DisplayFreeslots: block displaying all the empty slots
function DisplayFreeslots(props) {
    return (
        <div className="block_freeslots">
            There remains <b>{props.freeslots}</b> empty slots in the waitlist.
        </div>
    );
}


// toolbar block that supports redirection to adding/deleting a customer page
function Toolbar() {
    return (
        <React.Fragment>
            <Link to="/add">
                <MyButtons buttonType="button_add">Add a New Customer</MyButtons>
            </Link>
            <Link to="/delete">
                <MyButtons buttonType="button_delete">Remove a Customer</MyButtons>
            </Link>
        </React.Fragment>
    );
}


// block that renders the waitlist as a grid table
function WaitlistGridTable(props) {
    const waitlist = props.waitlist;
    
    var rows = new Array(grid_row);
    for (var i = 0; i < grid_row; i++) {
        rows[i] = <WaitlistGridRow key={i} waitlist={waitlist} start={grid_col*i} />;
    }

    return (
        <div className="block_table">
            <table className="grid_table">
                <tbody>
                    {rows}
                </tbody>
            </table>

            <Switch>
                <Route path="/show/:topicId">
                    <DetailedInfo waitlist={waitlist} />
                </Route>
            </Switch>
        </div>
    );
}


// DetailedInfo shows the detail of a customer in the waitlist
function DetailedInfo(props) {
    let { topicId } = useParams();
    const customer = props.waitlist[parseInt(topicId) - 1];

    if (customer == null) {
        return (
            <div></div>
        );
    } else {
        return (
            <div>
                <Link to="/"><MyButtons buttonType="button_close">X</MyButtons></Link>
                <h3> Details: Customer No. {topicId} </h3>
                <table>
                    <tbody>
                        <tr>
                            <td><b>Name:</b></td>
                            <td>{customer.name}</td>
                        </tr>
                        <tr>
                            <td><b>Phone Number:</b></td>
                            <td>{customer.phone}</td>
                        </tr>
                        <tr>
                            <td><b>Registration Timestamp:</b></td>
                            <td>{customer.timestamp.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}


// (child component of WaitlistGridTable) WaitlistGridRow: generates a row of the grid table of waitlist
function WaitlistGridRow(props) {
    const waitlist = props.waitlist;
    const start = props.start;

    var cells = new Array(grid_col);
    for (var i = 0; i < grid_col; i++) {
        const vacant = waitlist[start+i] == null ? 0 : 1;
        cells[i] = <WaitlistCell key={start+i+1} id={start+i+1} vacant={waitlist[start+i] == null ? 1 : 0}>
                {start + i + 1}
            </WaitlistCell>;
    }

    return (
        <tr>
            {cells}
        </tr>
    );
}


// (child component of WaitlistGridRow) WaitlistCell: generates a cell of the grid table
function WaitlistCell(props) {
    if (props.vacant) {
        return (
            <td>
                <Link to={`/show/${props.id}`}>
                    <button className="cell_vacant">
                        {props.children}
                    </button>
                </Link>
            </td>
        );
    } else {
        return (
            <td>
                <Link to={`/show/${props.id}`}>
                    <button className="cell_occupied">
                        {props.children}
                    </button>
                </Link>
            </td>
        );
    }
}


// MyButtons: add the unique features of a button in its parent component!
function MyButtons(props) {
    const buttonType = props.buttonType;

    return (
        <div className="block_button">
            <button className={buttonType}>
                {props.children}
            </button>
        </div>
    );
}


// AddCustomer: block that adds a customer to the waitlist
class AddCustomer extends React.Component {
    constructor() {
        super();
        this.createCustomer = this.createCustomer.bind(this);
    }
    
    createCustomer(e) {
        e.preventDefault();
        const info = document.forms.add_customer;
        
        const customer = {
            serialNo: info.input_id.value, name: info.input_name.value, 
            phone: info.input_phone.value
        };
        this.props.addToWaitlist(customer);
        info.input_id.value = "";
        info.input_name.value = "";
        info.input_phone.value = "";
    }

    render() {
        return (
            <div className="block_add">
                <form name="add_customer" onSubmit={this.createCustomer}>
                    <h2> Adding a customer </h2>
                    <label htmlFor="input_id"> Serial No.: </label>
                    <input name="input_id"
                        placeholder="please enter the serialNo of the customer"></input>
                    <label htmlFor="input_name"> Name: </label>
                    <input name="input_name"
                        placeholder="please enter the name of the customer"></input>
                    <br />
                    <label htmlFor="input_phone"> Phone Number: </label>
                    <input name="input_phone"
                        placeholder="please enter a phone number of the customer"></input>
                    <MyButtons buttonType="button_add">Add to Waitlist</MyButtons>
                </form>
                <Link to="/">
                    <MyButtons buttonType="button_home">Return to Homepage</MyButtons>
                </Link>
            </div>
        );
    }
}


// DeleteCustomer: block that deletes one customer in the waitlist
class DeleteCustomer extends React.Component {
    constructor() {
        super();
        this.removeCustomer = this.removeCustomer.bind(this);
    }

    removeCustomer(e) {
        e.preventDefault();
        const info = document.forms.delete_customer;
        this.props.deleteFromWaitlist(parseInt(info.input_serialNo.value));
        // if (info.input_serialNo.value == "") {
        //     this.props.deleteFromWaitlist(-Number.MAX_VALUE);
        // } else {
        //     this.props.deleteFromWaitlist(parseInt(info.input_serialNo.value) - 1);
        // }
        info.input_serialNo.value = "";
    }

    render() {
        return (
            <div className="block_delete">
                <form name="delete_customer" onSubmit={this.removeCustomer}>
                    <h2> Deleting a customer </h2>
                    <label htmlFor="input_serialNo">Serial Number: </label>
                    <input name="input_serialNo" 
                            placeholder="please enter a Serial No. for deletion"></input>
                    <MyButtons buttonType="button_delete">Delete from Waitlist</MyButtons>
                </form>
                <Link to="/">
                    <MyButtons buttonType="button_home">Return to Homepage</MyButtons>
                </Link>
            </div>
        );
    }
}


const waitlist = <WaitlistPlatform />

ReactDOM.render(waitlist, document.querySelector(".appFrame"));