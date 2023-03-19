const list = [
  { image: "https://via.placeholder.com/640x480", text: 1 },
  { image: "https://via.placeholder.com/640x480", text: 2 },
  { image: "https://via.placeholder.com/640x480", text: 3 },
  { image: "https://via.placeholder.com/640x480", text: 4 },
  { image: "https://via.placeholder.com/640x480", text: 5 },
  { image: "https://via.placeholder.com/640x480", text: 6 },
  { image: "https://via.placeholder.com/640x480", text: 7 },
  { image: "https://via.placeholder.com/640x480", text: 8 },
  { image: "https://via.placeholder.com/640x480", text: 9 },
  { image: "https://via.placeholder.com/640x480", text: 10 },
  { image: "https://via.placeholder.com/640x480", text: 11 },
  { image: "https://via.placeholder.com/640x480", text: 12 },
  { image: "https://via.placeholder.com/640x480", text: 13 },
  // { image: "https://via.placeholder.com/640x480", text: 14 },
  // { image: "https://via.placeholder.com/640x480", text: 15 },
  // { image: "https://via.placeholder.com/640x480", text: 16 },
  // { image: "https://via.placeholder.com/640x480", text: 17 },
  // { image: "https://via.placeholder.com/640x480", text: 18 },
  // { image: "https://via.placeholder.com/640x480", text: 19 },
  // { image: "https://via.placeholder.com/640x480", text: 20 },
  // { image: "https://via.placeholder.com/640x480", text: 21 },
  // { image: "https://via.placeholder.com/640x480", text: 22 },
  // { image: "https://via.placeholder.com/640x480", text: 23 },
  // { image: "https://via.placeholder.com/640x480", text: 24 },
  // { image: "https://via.placeholder.com/640x480", text: 25 },
  // { image: "https://via.placeholder.com/640x480", text: 26 },
  // { image: "https://via.placeholder.com/640x480", text: 27 },
];

const ul = document.querySelector("ul");
const [prevBtn, nextBtn] = document.querySelectorAll(".btns button");

const lastIndex = list.length - 1;

let speed = 500;
let enableClick = true;
let focusIndex = 0; // 보고있는 리스트에서 맨 좌측 카드
let bundleSize = 5; // 리스트에서 한번에 보여줄 카드 개수
let cardWidth = 100 / bundleSize; // 카드 가로 길이 %
let totalMoveDistance = 0; // 총 이동 거리 %

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
window.addEventListener("resize", resize);

create();
resize({ target: window });

function resize(e) {
  const { innerWidth } = e.target;
  if (innerWidth > 1000) {
    if (bundleSize === 5) return;
    bundleSize = 5;
  } else if (innerWidth > 800 && innerWidth <= 1000) {
    if (bundleSize === 4) return;
    bundleSize = 4;
  } else if (innerWidth > 600 && innerWidth <= 800) {
    if (bundleSize === 3) return;
    bundleSize = 3;
  } else if (innerWidth > 400 && innerWidth <= 600) {
    if (bundleSize === 2) return;
    bundleSize = 2;
  } else {
    if (bundleSize === 1) return;
    bundleSize = 1;
  }
  cardWidth = 100 / bundleSize;
  reset();
}

function reset() {
  if (lastIndex - focusIndex + 1 >= bundleSize) {
    totalMoveDistance = -(focusIndex * cardWidth);
    ul.style.transform = `translateX(${totalMoveDistance}%)`;
  } else {
    focusIndex = lastIndex - bundleSize + 1;
    totalMoveDistance = -(focusIndex * cardWidth);
    ul.style.transform = `translateX(${totalMoveDistance}%)`;
  }
}

function prev() {
  if (!enableClick || focusIndex === 0) return;
  enableClick = false;
  setTimeout(() => {
    enableClick = true;
    ul.style.transitionDuration = "0s";
  }, speed);

  const nextFocusIndex = focusIndex - bundleSize;
  const remainingCardCnt = focusIndex;

  if (remainingCardCnt >= bundleSize) {
    focusIndex = nextFocusIndex;
    totalMoveDistance += 100;
    ul.style.transitionDuration = `${speed}ms`;
  } else {
    focusIndex = 0;
    totalMoveDistance += remainingCardCnt * cardWidth;
    ul.style.transitionDuration = `${(remainingCardCnt / bundleSize) * speed}ms`;
  }

  ul.style.transform = `translateX(${totalMoveDistance}%)`;
}

function next() {
  if (!enableClick || focusIndex === lastIndex) return;
  enableClick = false;

  setTimeout(() => {
    enableClick = true;
    ul.style.transitionDuration = "0s";
  }, speed);

  const nextFocusIndex = focusIndex + bundleSize;
  if (nextFocusIndex > lastIndex) return;

  const remainingCardCnt = lastIndex - nextFocusIndex + 1;

  if (remainingCardCnt >= bundleSize) {
    focusIndex = nextFocusIndex;
    totalMoveDistance -= 100;
    ul.style.transitionDuration = `${speed}ms`;
  } else {
    focusIndex = lastIndex - bundleSize + 1;
    totalMoveDistance -= remainingCardCnt * cardWidth;
    ul.style.transitionDuration = `${(remainingCardCnt / bundleSize) * speed}ms`;
  }

  ul.style.transform = `translateX(${totalMoveDistance}%)`;
}

function create() {
  for (const item of list) {
    const li = document.createElement("li");
    li.innerHTML = `
    <div class='wrapper'>
      <div class='img'>
        <img alt='' src=${item.image} />
      </div>
      <div class='content'>
        ${item.text}
      </div>
    </div>
    `;
    ul.appendChild(li);
  }
}
