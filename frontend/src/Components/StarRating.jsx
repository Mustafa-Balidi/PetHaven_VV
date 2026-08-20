import Icon from "./Icon.jsx";

export default function StarRating({ count, total = 5, size = "20px" }) {
    return (
        <div className="star-rating" style={{ "--star-size": size }}>
            {Array.from({ length: total }).map((_, i) => {
                const filled = i < Math.floor(count);
                const half = !filled && i < count;
                return (
                    <Icon
                        key={i}
                        name={half ? "star_half" : filled ? "star" : "star_border"}
                        filled={filled || half}
                    />
                );
            })}
        </div>
    );
}