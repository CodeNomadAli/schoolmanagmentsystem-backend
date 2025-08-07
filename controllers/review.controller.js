import Remedy from "../models/remedy.model.js";


export const addOrUpdateReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { Id } = req.params;
    const { rating, message } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const remedy = await Remedy.findById(Id);
      console.log  
    if (!remedy) return res.status(404).json({ message: "Remedy not found" });
     
    const existingIndex = remedy.reviews.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingIndex >= 0) {
      // Update review
      remedy.reviews[existingIndex].rating = rating;
      remedy.reviews[existingIndex].message = message;
      remedy.reviews[existingIndex].createdAt = new Date();
    } else {
      // Add new review
      remedy.reviews.push({ user: userId, rating, message });
    }

    // Recalculate average rating
    const total = remedy.reviews.reduce((sum, r) => sum + r.rating, 0);
  const   Rating = total / remedy.reviews.length;
      remedy.averageRating=Rating.toFixed(1)
await remedy.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Review added/updated",
      averageRating: remedy.averageRating.toFixed(1),
      reviews: remedy.reviews
    });
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET - Fetch reviews for a remedy
export const getRemedyReviews = async (req, res) => {
  try {
    const { remedyId } = req.params;

    const remedy = await Remedy.findById(remedyId)
      .populate("reviews.user", "name email");

    if (!remedy) return res.status(404).json({ message: "Remedy not found" });

    res.status(200).json({
      reviews: remedy.reviews,
      averageRating: remedy.averageRating
    });
  } catch (error) {
    console.error("Fetch reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



