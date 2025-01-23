import React, { useContext } from "react";
import moment from "moment"; // Import moment for date formatting
//optional import react icons
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../AuthContext";

const ReviewCard = ({ review }) => {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  if (!review) {
    return <div className="p-4 text-gray-500">No review data provided.</div>;
  }

  const { rating, comment, reviewer, createdAt } = review;
  const [user, setUser] = useState(null);
  useEffect(async () => {
    const response = await axios.get(`${api}/getUser/${reviewer}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    setUser(response.data.data);
  });
  const formattedDate = moment(createdAt).format("MMM DD, YYYY");

  const generateStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`inline-block ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">
            {user?.name || "Anonymous User"}
          </h3>
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>
        <div className="flex gap-1">{generateStars(rating)}</div>
      </div>
      <p className="text-gray-700 italic">{comment}</p>
    </div>
  );
};

export default ReviewCard;
