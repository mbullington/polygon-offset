/**
 * @param  {Array.<Number>} p1
 * @param  {Array.<Number>} p2
 * @return {Boolean}
 */
export function equals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

/**
 * @param  {*} arr
 * @return {Boolean}
 */
const isNonEmptyArray = arr => Array.isArray(arr) && arr.length;

/**
 * @param  {*}       coordinates
 * @param  {Number=} depth
 * @return {*}
 */
export function orientRings(coordinates, isHole) {
  // Coords.
  const isRing =
    isNonEmptyArray(coordinates) && typeof coordinates[0][0] === "number";
  // Rings -> Coords.
  const isPolygon =
    isNonEmptyArray(coordinates) &&
    isNonEmptyArray(coordinates[0]) &&
    typeof coordinates[0][0][0] === "number";
  // Polygons -> Rings -> Coords.
  const isMultiPolygon =
    isNonEmptyArray(coordinates) &&
    isNonEmptyArray(coordinates[0]) &&
    isNonEmptyArray(coordinates[0][0]) &&
    typeof coordinates[0][0][0][0] === "number";

  if (isRing) {
    let area = 0;
    let ring = coordinates;

    for (let i = 0; i < ring.length; i++) {
      let pt1 = ring[i];
      let pt2 = ring[(i + 1) % ring.length];
      area = area + pt1[0] * pt2[1];
      area = area - pt2[0] * pt1[1];
    }

    if ((!isHole && area > 0) || (isHole && area < 0)) {
      ring.reverse();
    }
  } else if (isPolygon) {
    for (let i = 0; i < coordinates.length; i++) {
      orientRings(coordinates[i], i > 0);
    }

    // Make sure first polygon last coord == first coord.
    const [x, y] = coordinates[0][0];
    coordinates[0].pop();
    coordinates[0].push([x, y]);
  } else if (isMultiPolygon) {
    for (let i = 0; i < coordinates.length; i++) {
      orientRings(coordinates[i], false);
    }
  }

  return coordinates;
}
