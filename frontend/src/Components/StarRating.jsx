import Icon from "./Icon.jsx";

export default function StarRating({ count, rating, total = 5, size = "20px", ariaLabel }) {
    const value = Number(count ?? rating ?? 0);
    return (
        <div
            className="star-rating"
            style={{ "--star-size": size }}
            role={ariaLabel ? "img" : undefined}
            aria-label={ariaLabel}
            aria-hidden={ariaLabel ? undefined : "true"}
        >
            {Array.from({ length: total }).map((_, i) => {
                const filled = i < Math.floor(value);
                const half = !filled && i < value;
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
