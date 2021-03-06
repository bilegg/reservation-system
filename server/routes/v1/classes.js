const express = require('express');
const router = express.Router();
const { getClasses, addClass } = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const classes = await getClasses();

        res.status(200).send({ message: 'Success', classes: classes });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.post('/', async function (req, res) {
    try {
        let { userID, title, startTime, endTime } = req.body;
        console.log(userID, title, startTime, endTime);
        try {
            function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
                if (a_start <= b_start && b_start <= a_end) return true;
                if (a_start <= b_end && b_end <= a_end) return true;
                if (b_start < a_start && a_end < b_end) return true;
                return false;
            }

            const classes = await getClasses();
            let i = 0;
            let len = classes.length;
            let datesOverlap = false;
            while (i < len) {
                let a_start = new Date(startTime).getTime();
                let a_end = new Date(endTime).getTime();
                let b_start = new Date(classes[i].start_time).getTime();
                let b_end = new Date(classes[i].end_time).getTime();

                if (dateRangeOverlaps(a_start, a_end, b_start, b_end)) {
                    datesOverlap = true;
                    break;
                }
                i++;
            }

            if (datesOverlap) { // ? Shouldn't happen but is safe
                return res.status(200).send({ message: 'Class exists' });
            } else {
                await addClass(userID, title, startTime, endTime);
                return res.status(200).send({ message: 'Class added' });
            }
        } catch (error) {
            console.log(error);
            return res.status(200).send({ message: 'Something went wrong' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
