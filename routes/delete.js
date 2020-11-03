const deleteEvent = async (req, res, db) => {
    try {
        const { event_id } = req.params;
        const deleteData = await db('calendar').where({ id: event_id }).del()
        res.status(200).send({ data: 'Event Deleted' })
    } catch (error) {
        console.error(error.message);
    }
}

const deleteArt = async (req, res, db) => {
    try {
        const { art_id } = req.params;
        const deleteData = await db('art').where({ id: art_id }).del()
        res.status(200).send({ data: 'delete' })
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    deleteEvent,
    deleteArt
}