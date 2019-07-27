import React from 'react';
import { Button } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Copy extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { copied: false };
  }

  render() {
    let { value } = this.props;
    if (!value) return null;

    let color = 'primary';
    let buttonText = 'Copy';
    if (this.state.copied) {
      color = 'secondary';
      buttonText = 'Copied';
    }

    return (
      <React.Fragment>
        <CopyToClipboard
          text={value}
          onCopy={() => this.setState({ copied: true })}
        >
          <Button size="sm" color={color}>
            {buttonText}
          </Button>
        </CopyToClipboard>
        {' ' + value}
      </React.Fragment>
    );
  }
}

export default Copy;
