// @flow
import React, {Component} from 'react';
import Portal from './react-preact-portal';
import bevis from 'bevis';

const b = bevis('react-preact-modal');
export const PORTAL_CLASSNAME = b('portal');

type Props = {
    children: string,
    theme?: 'normal',
    size?: 'm',
    className?: string,
    isOpen: boolean,
    position?: PopupPosition,
    closeTimeoutMS?: number,
};

type State = {
    contentVisible: boolean,
    afterOpen: boolean,
    beforeClose: boolean,
};

export type PopupPosition = {
    top?: number,
    left?: number,
    right?: number,
    bottom?: number,
};

export default class Popup extends Component<Props, State> {
    closeTimer: number | void;

    constructor(props) {
        super(props);

        this.state = {
            contentVisible: false,
            afterOpen: false,
            beforeClose: false,
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.open();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOpen !== this.props.isOpen) {
            if (nextProps.isOpen) {
                this.open();
            } else {
                this.close();
            }
        }
    }

    open() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.cleanUp();
        }

        this.setState({
            contentVisible: true,
        }, () => {
            this.setState({
                afterOpen: true,
            });
        });
    }

    close() {
        const {closeTimeoutMS} = this.props;

        this.setState({
            beforeClose: true,
        });

        if (closeTimeoutMS) {
            this.closeTimer = setTimeout(this.cleanUp.bind(this), closeTimeoutMS);
        } else {
            this.cleanUp();
        }
    }

    cleanUp() {
        this.setState({
            contentVisible: false,
            afterOpen: false,
            beforeClose: false,
        });
    }

    render() {
        const {
            contentVisible,
            afterOpen,
            beforeClose,
        } = this.state;
        const {
            children,
            theme = 'normal',
            size = 'm',
            className,
            position,
        } = this.props;
        const popupClassName = b({
            theme,
            size,
            'after-open': afterOpen,
            'before-close': beforeClose,
        })
        + (className ? ` ${className}` : '');

        return (
            contentVisible
                ? (
                    <Portal className={PORTAL_CLASSNAME}>
                        <div
                            className={popupClassName}
                            style={position}
                        >
                            { children }
                        </div>
                    </Portal>
                )
                : null
        );
    }
}
