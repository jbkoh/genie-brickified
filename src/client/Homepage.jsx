import PropTypes from "prop-types";
import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import {
  Button,
  Container,
  Divider,
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
  Label,
} from "semantic-ui-react";

import "./css/Homepage.css";

import logo from "../static/img/genie_logo.png";
import synergy_logo from "../static/img/synergylog_noletter_trans.png"
import mesl_logo from "../static/img/mesllogo_noletter_trans.png"
import cse_logo from "../static/img/CSELogo_globe_color_trans.png"
import ucsd_logo from "../static/img/ucsd-logo.png"

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
    <Button basic inverted size="huge">
      Get Started
      <Icon name="right arrow" />
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
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth} >
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
                "border-width": 0
              }}
            >
              <Container>
                <Menu.Item as="a" active>
                  Home
                </Menu.Item>
                <Menu.Item as="a">
                  Contact
                </Menu.Item>
                <Menu.Item as="a">
                  About
                </Menu.Item>
                <Menu.Item position="right">
                  <Button as="a" inverted={!fixed}>
                    Log in
                  </Button>
                  <Button
                    as="a"
                    inverted={!fixed}
                    primary={fixed}
                    style={{ marginLeft: "0.5em" }}
                  >
                    Sign Up
                  </Button>
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>

    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  state = {};

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
  };

  handleToggle = () =>
    this.setState({ sidebarOpened: !this.state.sidebarOpened });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="uncover"
            inverted
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as="a" active>Home</Menu.Item>
            <Menu.Item as="a">Contact</Menu.Item>
            <Menu.Item as="a">About</Menu.Item>
            <Menu.Item as="a">Log in</Menu.Item>
            <Menu.Item as="a">Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: "100vh" }}
          >
            <Segment
              inverted
              textAlign="center"
              style={{ minHeight: 350, padding: "1em 0em" }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as="a" inverted>
                      Log in
                    </Button>
                    <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading mobile />
            </Segment>

            {children}
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

const HomepageLayout = () => (
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
            <Image.Group>
              <a href="http://synergy.ucsd.edu/">
                <Image circular bordered src={synergy_logo} style={{height: "120px",width: "120px",}} />
              </a>
              <a href="http://synergy.ucsd.edu/">
                <Image circular bordered src={mesl_logo} style={{height: "120px",width: "120px",}} />
              </a>
              <a href="http://cse.ucsd.edu/">
                <Image circular bordered src={cse_logo} style={{height: "120px",width: "120px",}} />
              </a>
              <a href="http://ucsd.edu/">
                <Image circular bordered src={ucsd_logo} style={{height: "120px",width: "120px",}} />
              </a>
            </Image.Group>
            <Label.Group>
              <a href="http://synergy.ucsd.edu/">
                <Label style={{width: 110, marginRight: 7.5, marginLeft: 7.5, textAlign: "center", 
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",}} content="SYNERGY" />
              </a>
              <a href="http://synergy.ucsd.edu/">
                <Label style={{width: 110, marginRight: 7.5, marginLeft: 7.5, textAlign: "center", 
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",}} content="MESL" />
              </a>
              <a href="http://cse.ucsd.edu/">
                <Label style={{width: 110, marginRight: 7.5, marginLeft: 7.5, textAlign: "center", 
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",}} content="UCSD CSE" />
              </a>
              <a href="http://ucsd.edu/">
                <Label style={{width: 110, marginRight: 7.5, marginLeft: 7.5, textAlign: "center", 
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",}} content="UC San Diego" />
              </a>
            </Label.Group>
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
    <Segment inverted vertical textAlign="center" style={{ padding: "5em 0em" }} className="masthead bg14">
      <Container>
        <Header as="h4" inverted
        style={{
          fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
          fontWeight: "normal",
        }}>
          UC San Diego 9500 Gilman Dr. La Jolla, CA 92093 ©2013 Regents of the University of California. All rights reserved.
        </Header>
        <Header as="h4" inverted
        style={{
          fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif",
          fontWeight: "normal",
        }}>
          Designed and built by synergy team, based on django and bootstrap        </Header>
      </Container>
    </Segment>
  </ResponsiveContainer>
);

export default HomepageLayout;
