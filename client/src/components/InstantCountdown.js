import React from 'react';
import Countdown from 'react-countdown';

const InstantCountdown = ({ dateTime, duration, isStarted }) => {
    return (
        isStarted && (
            <div id='countdown-instant-container'>
                <Countdown
                    date={
                        new Date(dateTime).getTime() + duration * 60 * 60 * 1000
                    }
                    onComplete={() => (isStarted = false)}
                />
            </div>
        )
    );
};

export default InstantCountdown;
