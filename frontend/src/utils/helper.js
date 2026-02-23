export const DOTS = "dots";

export function getPaginationRange(totalPages, currentPage, siblingCount = 1) {
  const totalPageNumbers = siblingCount * 2 + 5;
  // 5 = first + last + current + 2 dots

  // যদি page কম থাকে, সব দেখাও
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  // শুধু ডানদিকে dots
  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1
    );
    return [...leftRange, DOTS, lastPageIndex];
  }

  // শুধু বামদিকে dots
  if (showLeftDots && !showRightDots) {
    const rightRangeStart = totalPages - (3 + siblingCount * 2) + 1;
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => rightRangeStart + i
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  // দুইদিকে dots
  if (showLeftDots && showRightDots) {
    const middleRange = Array.from(
      { length: siblingCount * 2 + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

export const COLOR_MAP = {
  "#000": "Black",
  "#fff": "White",
  "#192252": "Navy Blue",
  "#636b2f": "Olive Green",
  "#895129": "Brown",
  "#4cbb17": "Bright Green",
  "#708090": "Slate Gray",
  "#24357a": "Royal Blue",
  "#4f3065": "Purple",
  "#595855": "Dark Gray",
  "#669f51": "Light Green",
  "#c1daf7": "Baby Blue",
  "#f7a5bb": "Pink",
};

