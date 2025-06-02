export const hexToRgb = (hex: string): [number, number, number] => {
	const value = parseInt(hex.substring(1), 16)
	return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export const rgbToHex = (r: number, g: number, b: number): string => {
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export const interpolateColor = (color1: string, color2: string, ratio: number): string => {
	const [r1, g1, b1] = hexToRgb(color1)
	const [r2, g2, b2] = hexToRgb(color2)

	return rgbToHex(
		Math.round(r1 + (r2 - r1) * ratio),
		Math.round(g1 + (g2 - g1) * ratio),
		Math.round(b1 + (b2 - b1) * ratio),
	)
}

export const lightenColor = (color: string, amount: number): string => {
	const [r, g, b] = hexToRgb(color)
	return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}
