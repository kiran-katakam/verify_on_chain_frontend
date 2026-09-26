export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await collection.findOne({
            _id: new ObjectId(id)
        });

        if (!product) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        await collection.deleteOne({
            _id: new ObjectId(id)
        });

        return res.status(200).json(product);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};