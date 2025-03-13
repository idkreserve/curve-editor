function Point({ x, y, size = ".5%", ...props }) {
    return <circle fill="gold" cx={x} cy={y} r={size} {...props} />
}

export default Point;
