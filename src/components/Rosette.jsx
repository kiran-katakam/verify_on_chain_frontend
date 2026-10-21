import React, { useMemo } from "react";

const TAU = Math.PI * 2;
const STEPS = 360;

// Each ring is a band of phase-shifted waves around a circle; the hash bytes
// pick petal count, amplitude and twist, so one changed byte redraws the rosette.
function ringPaths(bytes, ring) {
    const b = (i) => bytes[(ring * 5 + i) % bytes.length];
    const base = [78, 56, 32][ring];
    const petals = 5 + (b(0) % 14);
    const amp = 5 + (b(1) % 9);
    const lines = 9 + (b(2) % 6);
    const twist = 1 + (b(3) % 3);
    const phase = (b(4) / 255) * TAU;

    const paths = [];
    for (let k = 0; k < lines; k++) {
        const shift = phase + (k / lines) * (TAU / petals) * twist;
        let d = "";
        for (let s = 0; s <= STEPS; s++) {
            const t = (s / STEPS) * TAU;
            const r = base + amp * Math.sin(petals * t + shift) + (amp / 3) * Math.sin(2 * petals * t - shift);
            const x = (100 + r * Math.cos(t)).toFixed(2);
            const y = (100 + r * Math.sin(t)).toFixed(2);
            d += (s === 0 ? "M" : "L") + x + " " + y;
        }
        paths.push(d + "Z");
    }
    return paths;
}

export default function Rosette({ hash, color = "currentColor", animate = false, title }) {
    const rings = useMemo(() => {
        const hex = (hash || "0x" + "0".repeat(64)).replace(/^0x/, "");
        const bytes = hex.match(/../g).map((h) => parseInt(h, 16));
        return [0, 1, 2].map((ring) => ringPaths(bytes, ring));
    }, [hash]);

    return (
        <svg viewBox="0 0 200 200" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
            <circle cx="100" cy="100" r="97" fill="none" stroke={color} strokeWidth="0.8" />
            <circle cx="100" cy="100" r="94" fill="none" stroke={color} strokeWidth="0.4" />
            {rings.map((paths, ring) =>
                paths.map((d, i) => (
                    <path
                        key={`${hash}-${ring}-${i}`}
                        d={d}
                        stroke={color}
                        fill="none"
                        strokeWidth="0.55"
                        pathLength="1"
                        strokeDasharray={animate ? 1 : undefined}
                        style={animate ? { "--len": 1, animationDelay: `${ring * 120 + i * 18}ms` } : undefined}
                    />
                ))
            )}
            <circle cx="100" cy="100" r="18" fill="none" stroke={color} strokeWidth="0.6" />
        </svg>
    );
}
