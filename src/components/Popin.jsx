import React from 'react';
import '../styles/Popin.css';

class Popin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }

    }

    render() {

        const { toggleOpen } = this.props;

        return (
            <div className='overlay'>
                <div className='popin'>
                    <button className='close' onClick={toggleOpen}>Close</button>
                    <h2>Ceci est la popin</h2>
                </div>
            </div>
        );
    }
}

export default Popin;
