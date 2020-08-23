const updateEvent = async (req, res, db) => {
    try {
        const { event_id } = req.params;
        const {
            description,
            notes,
            location,
            duration,
            start_date,
            end_date
        } = req.body;

        const updateData = await db('calendar').update({
            description,
            notes,
            location,
            duration,
            start_date,
            end_date
        }).where({ id: event_id })
        res.status(200).send({ data: "UPDATE" })
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    updateEvent
}