import { describe, it, expect } from "vitest";

import { parseImage } from "../parse-image";

const smallImage = {
  url: "https://images.thegardenofnow.co.uk/image1",
  width: 240,
  height: 200,
}

const mediumImage = {
  url: "https://images.thegardenofnow.co.uk/image2",
  width: 480,
  height: 400,
}

const largeImage = {
  url: "https://images.thegardenofnow.co.uk/image3",
  width: 720,
  height: 600,
}

const longImageDataArray = [smallImage, mediumImage, largeImage];
const mediumImageDataArray = [smallImage, largeImage];
const shortImageDataArray = [mediumImage];

describe("parseImage", () => {
  it.each([
    { input: longImageDataArray, output: mediumImage },
    { input: mediumImageDataArray, output: smallImage },
    { input: shortImageDataArray, output: mediumImage},
    { input: [], output: null }
  ])('should return "$output" for "$input"', ({input, output}) => {
    expect(parseImage(input)).toBe(output);
  })
})