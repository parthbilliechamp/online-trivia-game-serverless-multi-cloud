import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountdownTimer = ({ startDate }) => {
  console.log('stratdate',startDate)
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = moment();
    const targetDate = moment(startDate, 'YYYY-MM-DD hh:mm:ss A Z');

    if (targetDate.isSameOrBefore(now)) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const duration = moment.duration(targetDate.diff(now));

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
     
      <div>
         <span><b> Time Remaining : </b></span>
       {timeRemaining.days===0?'': <span><b>{timeRemaining.days} days</b></span>}
        {timeRemaining.hours===0?'':<span> <b>{timeRemaining.hours} hours</b></span>}
       {timeRemaining.minutes===0?'': <span> <b>{timeRemaining.minutes} minutes</b></span>}
        {timeRemaining.seconds===0?'':<span> <b>{timeRemaining.seconds} seconds</b></span>}
      </div>
    </div>
  );
};

export default CountdownTimer;
