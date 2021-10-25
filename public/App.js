var Router = ReactRouterDOM.HashRouter;
var Switch = ReactRouterDOM.Switch;
var Route = ReactRouterDOM.Route;
var Redirect = ReactRouterDOM.Redirect;
var Link = ReactRouterDOM.Link;
var useParams = ReactRouterDOM.useParams;
const grid_row = 5;
const grid_col = 5;
const slots = grid_row * grid_col;
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d'); // recover the timestamp to a js Date() object

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    return new Date(value);
  }

  return value;
} // WaitlistPlatform: top level container that contains all the blocks


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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    let newWaitlist = new Array(slots);
    let number = 0;

    for (let customer of result.data.waitlist) {
      newWaitlist[customer.serialNo - 1] = customer;
      number++;
    }

    this.setState({
      waitlist: newWaitlist,
      freeslots: slots - number
    });
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {
            customer
          }
        })
      });
      alert(`Successfully added customer ${customer.name} (contact: ${customer.phone}) to slot ${serialNo}!`);
      this.loadData();
    }
  }

  async deleteFromWaitlist(serialNo) {
    const newWaitlist = this.state.waitlist.slice();

    if (isNaN(serialNo)) {
      alert("Sorry, please enter a valid serial No. to indicate a customer.");
    } else if (serialNo <= 0 || serialNo > slots) {
      alert(`Sorry, please ensure the serial No. is between 1 and ${slots}!`);
    } else if (newWaitlist[serialNo - 1] == null) {
      alert(`Sorry, serial No. ${serialNo} is already empty!`);
    } else {
      const query = `mutation deleteCustomer($reference: DeletionInputs!) {
                deleteCustomer(reference: $reference) {
                    message
                }
            }`;
      const reference = {
        serialNo: serialNo
      };
      const result = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {
            reference
          }
        })
      });
      const textResult = await result.json();
      alert(textResult.data.deleteCustomer.message);
      this.loadData();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DisplayHomepage, null), /*#__PURE__*/React.createElement(DisplayFreeslots, {
      freeslots: this.state.freeslots
    }), /*#__PURE__*/React.createElement(WaitlistGridTable, {
      waitlist: this.state.waitlist
    }), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
      path: "/add"
    }, /*#__PURE__*/React.createElement(AddCustomer, {
      addToWaitlist: this.addToWaitlist
    })), /*#__PURE__*/React.createElement(Route, {
      path: "/delete"
    }, /*#__PURE__*/React.createElement(DeleteCustomer, {
      deleteFromWaitlist: this.deleteFromWaitlist
    })), /*#__PURE__*/React.createElement(Route, {
      path: "/"
    }, /*#__PURE__*/React.createElement(Toolbar, null)))));
  }

} // DisplayHomepage: block for homepage


function DisplayHomepage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "block_homepage"
  }, /*#__PURE__*/React.createElement("h1", null, " Welcome to the Hotel California~ "));
} // DisplayFreeslots: block displaying all the empty slots


function DisplayFreeslots(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "block_freeslots"
  }, "There remains ", /*#__PURE__*/React.createElement("b", null, props.freeslots), " empty slots in the waitlist.");
} // toolbar block that supports redirection to adding/deleting a customer page


function Toolbar() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
    to: "/add"
  }, /*#__PURE__*/React.createElement(MyButtons, {
    buttonType: "button_add"
  }, "Add a New Customer")), /*#__PURE__*/React.createElement(Link, {
    to: "/delete"
  }, /*#__PURE__*/React.createElement(MyButtons, {
    buttonType: "button_delete"
  }, "Remove a Customer")));
} // block that renders the waitlist as a grid table


function WaitlistGridTable(props) {
  const waitlist = props.waitlist;
  var rows = new Array(grid_row);

  for (var i = 0; i < grid_row; i++) {
    rows[i] = /*#__PURE__*/React.createElement(WaitlistGridRow, {
      key: i,
      waitlist: waitlist,
      start: grid_col * i
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "block_table"
  }, /*#__PURE__*/React.createElement("table", {
    className: "grid_table"
  }, /*#__PURE__*/React.createElement("tbody", null, rows)), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "/show/:topicId"
  }, /*#__PURE__*/React.createElement(DetailedInfo, {
    waitlist: waitlist
  }))));
} // DetailedInfo shows the detail of a customer in the waitlist


function DetailedInfo(props) {
  let {
    topicId
  } = useParams();
  const customer = props.waitlist[parseInt(topicId) - 1];

  if (customer == null) {
    return /*#__PURE__*/React.createElement("div", null);
  } else {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Link, {
      to: "/"
    }, /*#__PURE__*/React.createElement(MyButtons, {
      buttonType: "button_close"
    }, "X")), /*#__PURE__*/React.createElement("h3", null, " Details: Customer No. ", topicId, " "), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "Name:")), /*#__PURE__*/React.createElement("td", null, customer.name)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "Phone Number:")), /*#__PURE__*/React.createElement("td", null, customer.phone)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("b", null, "Registration Timestamp:")), /*#__PURE__*/React.createElement("td", null, customer.timestamp.toLocaleString())))));
  }
} // (child component of WaitlistGridTable) WaitlistGridRow: generates a row of the grid table of waitlist


function WaitlistGridRow(props) {
  const waitlist = props.waitlist;
  const start = props.start;
  var cells = new Array(grid_col);

  for (var i = 0; i < grid_col; i++) {
    const vacant = waitlist[start + i] == null ? 0 : 1;
    cells[i] = /*#__PURE__*/React.createElement(WaitlistCell, {
      key: start + i + 1,
      id: start + i + 1,
      vacant: waitlist[start + i] == null ? 1 : 0
    }, start + i + 1);
  }

  return /*#__PURE__*/React.createElement("tr", null, cells);
} // (child component of WaitlistGridRow) WaitlistCell: generates a cell of the grid table


function WaitlistCell(props) {
  if (props.vacant) {
    return /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Link, {
      to: `/show/${props.id}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "cell_vacant"
    }, props.children)));
  } else {
    return /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Link, {
      to: `/show/${props.id}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "cell_occupied"
    }, props.children)));
  }
} // MyButtons: add the unique features of a button in its parent component!


function MyButtons(props) {
  const buttonType = props.buttonType;
  return /*#__PURE__*/React.createElement("div", {
    className: "block_button"
  }, /*#__PURE__*/React.createElement("button", {
    className: buttonType
  }, props.children));
} // AddCustomer: block that adds a customer to the waitlist


class AddCustomer extends React.Component {
  constructor() {
    super();
    this.createCustomer = this.createCustomer.bind(this);
  }

  createCustomer(e) {
    e.preventDefault();
    const info = document.forms.add_customer;
    const customer = {
      serialNo: info.input_id.value,
      name: info.input_name.value,
      phone: info.input_phone.value
    };
    this.props.addToWaitlist(customer);
    info.input_id.value = "";
    info.input_name.value = "";
    info.input_phone.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "block_add"
    }, /*#__PURE__*/React.createElement("form", {
      name: "add_customer",
      onSubmit: this.createCustomer
    }, /*#__PURE__*/React.createElement("h2", null, " Adding a customer "), /*#__PURE__*/React.createElement("label", {
      htmlFor: "input_id"
    }, " Serial No.: "), /*#__PURE__*/React.createElement("input", {
      name: "input_id",
      placeholder: "please enter the serialNo of the customer"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "input_name"
    }, " Name: "), /*#__PURE__*/React.createElement("input", {
      name: "input_name",
      placeholder: "please enter the name of the customer"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "input_phone"
    }, " Phone Number: "), /*#__PURE__*/React.createElement("input", {
      name: "input_phone",
      placeholder: "please enter a phone number of the customer"
    }), /*#__PURE__*/React.createElement(MyButtons, {
      buttonType: "button_add"
    }, "Add to Waitlist")), /*#__PURE__*/React.createElement(Link, {
      to: "/"
    }, /*#__PURE__*/React.createElement(MyButtons, {
      buttonType: "button_home"
    }, "Return to Homepage")));
  }

} // DeleteCustomer: block that deletes one customer in the waitlist


class DeleteCustomer extends React.Component {
  constructor() {
    super();
    this.removeCustomer = this.removeCustomer.bind(this);
  }

  removeCustomer(e) {
    e.preventDefault();
    const info = document.forms.delete_customer;
    this.props.deleteFromWaitlist(parseInt(info.input_serialNo.value));
    info.input_serialNo.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "block_delete"
    }, /*#__PURE__*/React.createElement("form", {
      name: "delete_customer",
      onSubmit: this.removeCustomer
    }, /*#__PURE__*/React.createElement("h2", null, " Deleting a customer "), /*#__PURE__*/React.createElement("label", {
      htmlFor: "input_serialNo"
    }, "Serial Number: "), /*#__PURE__*/React.createElement("input", {
      name: "input_serialNo",
      placeholder: "please enter a Serial No. for deletion"
    }), /*#__PURE__*/React.createElement(MyButtons, {
      buttonType: "button_delete"
    }, "Delete from Waitlist")), /*#__PURE__*/React.createElement(Link, {
      to: "/"
    }, /*#__PURE__*/React.createElement(MyButtons, {
      buttonType: "button_home"
    }, "Return to Homepage")));
  }

}

const waitlist = /*#__PURE__*/React.createElement(WaitlistPlatform, null);
ReactDOM.render(waitlist, document.querySelector(".appFrame"));