import userModel from "../Models/userModel.js";

export const addToWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  console.log('Add to wishlist request:', { productId, userId });

  try {
    const user = await userModel.findOne({ _id: userId });
    
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if product already in wishlist
    const productIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (productIndex > -1) {
      console.log('Product already in wishlist');
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();
    
    console.log('Added to wishlist successfully');
    res.status(200).json({ message: "Added to wishlist successfully" });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { productId, userId } = req.body;

  console.log('Remove from wishlist request:', { productId, userId });

  try {
    const user = await userModel.findOne({ _id: userId });
    
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    
    await user.save();
    console.log('Removed from wishlist successfully');
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: "Failed to remove from wishlist", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  const { userId } = req.body;

  console.log('Get wishlist request:', { userId });

  try {
    const user = await userModel
      .findOne({ _id: userId })
      .populate("wishlist");
    
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Wishlist fetched:', user.wishlist.length, 'items');
    res.status(200).json({ 
      message: "Wishlist fetched successfully", 
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};
