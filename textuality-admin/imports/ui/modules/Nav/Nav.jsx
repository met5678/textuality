import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Route, Link } from 'react-router-dom';

const RouterNavItem = ({ to, children }) => (
  <Route
    path={to}
    children={({ match }) => (
      <NavItem active={!!match}>
        <NavLink tag={Link} to={to} className={!!match ? 'active' : ''}>
          {children}
        </NavLink>
      </NavItem>
    )}
  />
);

const RouterDropdownItem = ({ to, children }) => (
  <Route
    path={to}
    children={({ match }) => (
      <DropdownItem tag={Link} to={to} className={!!match ? 'active' : ''}>
        {children}
      </DropdownItem>
    )}
  />
);

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <Navbar dark expand="md" color="primary" className="mb-4">
        <NavbarBrand tag={Link} to="/">
          {/*          <img
            src="/rupaul-icon-white-120.png"
            width="26"
            height="26"
            style={{
              transform: 'scale(1.8)',
              marginRight: '18px',
              marginLeft: '6px'
            }}
            className="d-inline-block align-top"
          />*/}
          Textuality Admin
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <RouterNavItem to="/texts">Texts</RouterNavItem>
            <RouterNavItem to="/media">Media</RouterNavItem>
            <RouterNavItem to="/unlocks">Unlocks</RouterNavItem>
            <RouterNavItem to="/players">Players</RouterNavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Scripting
              </DropdownToggle>
              <DropdownMenu right>
                <RouterDropdownItem to="/achievements">
                  Achievements
                </RouterDropdownItem>
                <RouterDropdownItem to="/checkpoints">
                  Checkpoints
                </RouterDropdownItem>
                <RouterDropdownItem to="/missions">Missions</RouterDropdownItem>
                <RouterDropdownItem to="/autoTexts">
                  Auto Texts
                </RouterDropdownItem>
                <RouterDropdownItem to="/aliases">Aliases</RouterDropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <RouterNavItem to="/events">Events</RouterNavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
