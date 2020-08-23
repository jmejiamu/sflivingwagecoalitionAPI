const newPost = async (req, res, db) => {
    try {
        const { aboutinfo } = req.body;
        const data = await db.insert({
            aboutinfo: aboutinfo
        }).into('about')
        res.status(200).send({ post: 'INSERTED' })
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    newPost
}