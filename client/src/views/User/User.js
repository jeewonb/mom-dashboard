import React, { Component } from "react";
import MaterialTable from "material-table";

// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";

// @material-ui/icons
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

const useStyles = theme => ({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 150,
      height: 30
    }
  }
});

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.tableRef = React.createRef();
  }

  getData() {
    fetch("http://localhost:9000/user")
      .then(response => response.json())
      .then(data => this.setState({ data }))
      .catch(function(err) {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>사용자 현황</h4>
                <p className={classes.cardCategoryWhite}></p>
              </CardHeader>
              <CardBody>
                <MaterialTable
                  title="사용자 테이블"
                  columns={[
                    { title: "ID", field: "ID", editable: "onAdd" },
                    { title: "이름", field: "NAME" },
                    { title: "이메일", field: "EMAIL" },
                    { title: "연락처", field: "CONTACTS" },
                    { title: "가입일자", field: "DATE", type: "datetime" },
                    {
                      title: "라이센스 구매",
                      field: "LICENSE",
                      lookup: { YES: "YES", NO: "NO" }
                    }
                  ]}
                  data={this.state.data}
                  editable={{
                    onRowAdd: newData =>
                      new Promise((resolve, reject) => {
                        fetch("http://localhost:9000/user/add", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(newData)
                        })
                          .then(function(response) {
                            if (response.status >= 400) {
                              throw new Error("Bad response from server");
                            }
                            return response.json();
                          })
                          .then(() => {
                            resolve();
                            this.setState(prevState => {
                              const data = [...prevState.data];
                              data.push(newData);
                              return { ...prevState, data };
                            });
                          })
                          .catch(function(err) {
                            reject();
                            console.log(err);
                          });
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve, reject) => {
                        fetch("http://localhost:9000/user/edit", {
                          method: "POST",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(newData)
                        })
                          .then(function(response) {
                            if (response.status >= 400) {
                              throw new Error("Bad response from server");
                            }
                            return response.json();
                          })
                          .then(() => {
                            resolve();
                            if (oldData) {
                              this.setState(prevState => {
                                const data = [...prevState.data];
                                data[data.indexOf(oldData)] = newData;
                                return { ...prevState, data };
                              });
                            }
                          })
                          .catch(function(err) {
                            reject();
                            console.log(err);
                          });
                      }),
                    onRowDelete: oldData =>
                      new Promise((resolve, reject) => {
                        fetch("http://localhost:9000/user/delete", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(oldData)
                        })
                          .then(function(response) {
                            if (response.status >= 400) {
                              throw new Error("Bad response from server");
                            }
                            return response.json();
                          })
                          .then(() => {
                            resolve();
                            this.setState(prevState => {
                              const data = [...prevState.data];
                              data.splice(data.indexOf(oldData), 1);
                              return { ...prevState, data };
                            });
                          })
                          .catch(function(err) {
                            reject();
                            console.log(err);
                          });
                      })
                  }}
                  actions={[
                    {
                      icon: "refresh",
                      tooltip: "Refresh Data",
                      isFreeAction: true,
                      onClick: () => this.getData()
                    }
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(useStyles)(User);
