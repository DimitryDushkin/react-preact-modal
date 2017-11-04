// @flow
import React, {Component} from 'react';
import {render} from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Redirect rendering of descendants into the given CSS selector.
 * Preact and react compatible
 * Mostly @copy-paste from https://github.com/developit/preact-portal/blob/master/src/preact-portal.js
 */
const IS_PREACT = process.env.REACT_ENV === 'preact';

type Props = {
    className?: string,
};

export default class Portal extends Component<Props> {
    componentDidUpdate(props) {
        for (let i in props) {
            if (props[i] !== this.props[i]) {
                return this.renderLayer();
            }
        }
    }

    componentDidMount() {
        const {className} = this.props;

        this.into = document.createElement('div');
        if (className) {
            this.into.classList.add(className);
        }

        document.body.appendChild(this.into);

        this.renderLayer();
    }

    componentWillUnmount() {
        this.renderLayer(false);

        // for preact
        if (this.remote && this.remote.parentNode) {
            this.remote.parentNode.removeChild(this.remote);
        }

        if (this.into) {
            document.body.removeChild(this.into);
        }
    }

    renderLayer(show = true) {
        this.remote = render(
            (
                <PortalProxy context={this.context}>
                    { show && this.props.children || null }
                </PortalProxy>
            ),
            this.into,
            IS_PREACT ? this.remote : () => {}
        );
    }

    render() {
        return null;
    }
}


// high-order component that renders its first child if it exists.
// used as a conditional rendering proxy.
class PortalProxy extends Component {
    static childContextTypes = {
        context: PropTypes.any,
    };

    getChildContext = () => {
        return this.props.context;
    };

    render() {
        let content = null;

        if (this.props.children) {
            content = this.props.children;
        }

        if (this.props.children && this.props.children[0]) {
            content = this.props.children[0];
        }

        return content;
    }
}
