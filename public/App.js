// actually not a very good way to import at the front-end without webpack...
var Router = ReactRouterDOM.HashRouter;
var Switch = ReactRouterDOM.Switch;
var Route = ReactRouterDOM.Route;
var Redirect = ReactRouterDOM.Redirect;
var Link = ReactRouterDOM.Link;
var useParams = ReactRouterDOM.useParams;
const grid_row = 5;
const grid_col = 5;
const slots = grid_row * grid_col; // WaitlistPlatform: top level container that contains all the blocks

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

  addToWaitlist(customer) {
    const newWaitlist = this.state.waitlist.slice();
    const serialNo = customer.id - 1;

    if (newWaitlist[serialNo] != null) {
      alert(`Sorry, slot ${serialNo + 1} is already occupied!`);
    } else if (customer.serialNo == "") {
      alert("Sorry, you must provide a serial No. for the new customer!");
    } else if (customer.serialNo <= 0 || customer.serialNo > slots) {
      alert(`Sorry, please ensure the serial No. is between 1 and ${slots}!`);
    } else if (customer.name == "") {
      alert("Sorry, you must provide the name of the customer!");
    } else if (customer.phone == "") {
      alert("Sorry, you must provide a phone number of the customer!");
    } else {
      newWaitlist[serialNo] = customer;
      this.setState({
        freeslots: this.state.freeslots - 1,
        waitlist: newWaitlist
      });
      alert(`Successfully added customer ${customer.name} (${customer.phone}) to slot ${serialNo + 1}!`);
    }
  }

  deleteFromWaitlist(serialNo) {
    const newWaitlist = this.state.waitlist.slice();

    if (serialNo == -Number.MAX_VALUE) {
      alert("Sorry, please enter a serial No. to indicate a customer.");
    } else if (serialNo < 0 || serialNo >= slots) {
      alert(`Sorry, please ensure the serial No. is between 1 and ${slots}!`);
    } else if (newWaitlist[serialNo] == null) {
      alert(`Sorry, serial No. ${serialNo + 1} is already empty!`);
    } else {
      newWaitlist[serialNo] = null;
      this.setState({
        freeslots: this.state.freeslots + 1,
        waitlist: newWaitlist
      });
      alert(`Successfully deleted customer No. ${serialNo + 1}!`);
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
    path: "/:topicId"
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
      to: `/${props.id}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "cell_vacant"
    }, props.children)));
  } else {
    return /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Link, {
      to: `/${props.id}`
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
      id: info.input_id.value,
      serialNo: info.input_id.value,
      name: info.input_name.value,
      phone: info.input_phone.value,
      timestamp: new Date(Date.now())
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

    if (info.input_serialNo.value == "") {
      this.props.deleteFromWaitlist(-Number.MAX_VALUE);
    } else {
      this.props.deleteFromWaitlist(parseInt(info.input_serialNo.value) - 1);
    }

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