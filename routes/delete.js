const deleteEvent = async (req, res, db) => {
    try {
        const { event_id } = req.params;
        const deleteData = await db('calendar').where({ id: event_id }).del()
        res.status(200).send({ data: 'DELETED' })
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    deleteEvent
}