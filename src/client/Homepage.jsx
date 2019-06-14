import PropTypes from "prop-types";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";

import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Card
} from "semantic-ui-react";

import "./css/Homepage.css";

import logo from "../static/img/genie_logo.png";
import synergy_logo from "../static/img/synergylog_noletter_trans.png";
import mesl_logo from "../static/img/mesllogo_noletter_trans.png";
import cse_logo from "../static/img/CSELogo_globe_color_trans.png";
import ucsd_logo from "../static/img/ucsd-logo.png";

import Contact from "./Contactpage";

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text >
    <Header
      as="h1"
      inverted
      style={{
        marginTop: mobile ? "3em" : "6em",
      }}
    >
      <Image src={logo} style={{
        width: mobile ? "1.5em" : "3em",
        height: mobile ? "1.5em" : "3em",
      }} />
      <Header.Content style={{
          fontSize: mobile ? "1.5em" : "3em",
          fontWeight: "normal"
        }}>Genie
      </Header.Content>
    </Header>
    <Header
      as="h2"
      content="Personalize Your Office Environment"
      inverted
      style={{
        marginTop: mobile ? "0.5em" : "1em",
        marginBottom: mobile ? "1em" : "2em",
        fontSize: mobile ? "1em" : "2em",
        fontWeight: "normal"
      }}
    />
    <Link to={"/main"}>
      <Button basic inverted size="huge">
        Get Started
        <Icon name="right arrow" />
      </Button>
    </Link>
  </Container>
);

const AboutpageHeading = ({ mobile }) => (
  <Container text >
    <Header
      as="h1"
      inverted
      style={{
        marginTop: mobile ? "1em" : "2em",
      }}
    >
      <Image src={logo} style={{
        width: mobile ? "1.5em" : "3em",
        height: mobile ? "1.5em" : "3em",
      }} />
      <Header.Content style={{
          fontSize: mobile ? "1.5em" : "3em",
          fontWeight: "normal"
        }}>Genie
      </Header.Content>
    </Header>
    <Header
      as="h2"
      content="About this project"
      inverted
      style={{
        fontSize: mobile ? "1em" : "2em",
        fontWeight: "normal"
      }}
    />
    <Header
      as="h2"
      content="Genie is a project of the MESL/Synergy Lab at UCSD. 
      Genie assists occupants of the Computer Science and Engineering 
      building to improve their environment. You can use it to change 
      your temperature settings, set your schedule and turn HVAC on/off 
      when you need. You can also view history of sensor measurements, 
      and send us your feedback using this interface. The goal of this 
      project is to make HVAC energy efficient while meeting the comfort
       requirements of the occupant. Please use Genie, feel free to send 
       us your suggestions, feedback or maintenance requests, and improve your environment!
      "
      inverted
      style={{
        marginTop: mobile ? "0.5em" : "1em",
        marginBottom: mobile ? "1em" : "2em",
        fontSize: mobile ? "10px" : "20px",
        fontWeight: "normal"
      }}
    />
    <Button href="https://genie.ucsd.edu/tips" basic inverted size="huge">
      How HVAC works
    </Button>
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool
};

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {
    activeItem: "home",
    redirect: false
  };


  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/login' />
    }
  }

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed, contact, about, activeItem } = this.state;
    const heading = (about) ? <AboutpageHeading /> : <HomepageHeading />;

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth} >
	{this.renderRedirect()}
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            className="masthead bg14"
            inverted
            textAlign="center"
            style={{ minHeight: 600, padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
              style={{
                borderWidth: 0
              }}
            >
              <Container>
                <Menu.Item name="home" as="a" onClick={() => this.setState({about: false, activeItem: "home"})} active={activeItem === "home"}>
                  Home
                </Menu.Item>
                <Menu.Item name="contact" as="a" onClick={() => this.setState({contact: true, about: false, activeItem: "contact"})} active={activeItem === "contact"}>
                  Contact
                </Menu.Item>
                <Menu.Item name="about" as="a" onClick={() => this.setState({about: true, activeItem: "about"})} active={activeItem === "about"}>
                  About
                </Menu.Item>
                <Menu.Item position="right">
                  <Button as="a" inverted={!fixed} onClick={this.setRedirect}>
                    Log in
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            {heading}
          </Segment>
        </Visibility>
        {children}
        <Contact open={contact} onClose={() => this.setState({contact: false, about: false})} />
      </Responsive>

    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  state = {
    activeItem: "home",
    redirect: false
  };


  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/login' />
    }
  }

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
  };

  handleToggle = () =>
    this.setState({ sidebarOpened: !this.state.sidebarOpened });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;
    const { contact, about, activeItem } = this.state;
    const heading = (about) ? <AboutpageHeading mobile /> : <HomepageHeading mobile />;

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
	{this.renderRedirect()}
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="uncover"
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item name="home" as="a" 
              onClick={() => this.setState({about: false, activeItem: "home", 
              sidebarOpened: !this.state.sidebarOpened})} active={activeItem === "home"}>
              Home
            </Menu.Item>
            <Menu.Item name="contact" as="a" 
              onClick={() => this.setState({contact: true, about: false, activeItem: "contact", 
              sidebarOpened: !this.state.sidebarOpened})} active={activeItem === "contact"}>
              Contact
            </Menu.Item>
            <Menu.Item name="about" as="a" 
              onClick={() => this.setState({about: true, activeItem: "about", 
              sidebarOpened: !this.state.sidebarOpened})} active={activeItem === "about"}>
              About
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: "100vh" }}
          >
            <Segment
              className="masthead bg14"
              inverted
              textAlign="center"
              style={{ minHeight: 350, padding: "1em 0em" }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size="large" style={{
                  borderWidth: 0
                }}>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as="a" inverted onClick={this.setRedirect}>
                      Log in
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
              {heading}
            </Segment>

            {children}
            <Contact open={contact} onClose={() => this.setState({contact: false, about: false})} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

class HomepageLayout extends Component {
  render() {
    return(
      <ResponsiveContainer>
        <Segment style={{ padding: "8em 0em" }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={8}>
                <header style={{ fontSize: "2em", 
                fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                fontWeight: "normal",
                color: "rgba(0,0,0,.87)",
                paddingBottom: "16px"}}>
                  Related Organizations
                </header>
                <Grid container>
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <a href="http://synergy.ucsd.edu/">
                        <Card
                          className={"hover"}
                          image={synergy_logo}
                          style={{textAlign: "center"}}
                        />
                      </a>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <a href="http://synergy.ucsd.edu/">
                        <Card
                          className={"hover"}
                          image={mesl_logo}
                          style={{textAlign: "center"}}
                        />
                      </a>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <a href="http://cse.ucsd.edu/">
                        <Card
                          className={"hover"}
                          image={cse_logo}
                          style={{textAlign: "center"}}
                        />
                      </a>
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <a href="http://ucsd.edu/">
                        <Card
                          className={"hover"}
                          image={ucsd_logo}
                          style={{textAlign: "center", backgroundColor: "white"}}
                        />
                      </a>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column floated="right" width={8}>
                <header style={{ fontSize: "2em", 
                fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                fontWeight: "normal",
                color: "rgba(0,0,0,.87)",
                paddingBottom: "16px"}}>
                  Related Sites
                </header>
                <List style={{ fontSize: "1.33em",
                fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
                fontWeight: "normal", }}>
                  <List.Item>
                    <a href='https://facilities.ucsd.edu/default.htm'>
                      Facilities Information System
                    </a>
                  </List.Item>
                  <List.Item>
                    <a href='http://172.21.59.229/Ion/'>
                      ION Energy Monitoring System
                    </a>
                    </List.Item>
                  <List.Item>
                    <a href='http://energy.ucsd.edu/'>
                      Energy Dashboard
                    </a>
                  </List.Item>
                  <List.Item>
                    <a href='https://genie.ucsd.edu/'>
                      Genie - Personal Environment Control
                    </a>
                  </List.Item>
                  <List.Item>
                    <a href='https://brickschema.org/'>
                      Brick Schema
                    </a>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment inverted vertical textAlign="center" style={{ padding: "2em 0em" }} className="masthead bg14">
          <Container>
            <Header as="h5" inverted
            style={{
              fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
              fontWeight: "normal",
            }}>
              UC San Diego 9500 Gilman Dr. La Jolla, CA 92093 ©2013 Regents of the University of California. All rights reserved.
            </Header>
            <Header as="h5" inverted
            style={{
              fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
              fontWeight: "normal",
            }}>
              Designed and built by synergy team, based on django and bootstrap        </Header>
          </Container>
        </Segment>
      </ResponsiveContainer>
    );
  }
}

export default HomepageLayout;
