export default class Slider {
  constructor(container, { data, speed, responsive }) {
    this.container = container;
    this.data = data;
    this.speed = speed; // 슬라이드 동작 속도 (ms)
    this.responsive = responsive; // 반응형 옵션
    this.focusIndex = 0; // 현재 슬라이드 화면에서 맨 좌측 요소의 인덱스
    this.lastIndex = data.length - 1; // 슬라이드 맨 우측 요소의 인덱스
    this.bundleSize = 5; // 리스트에서 한번에 보여줄 카드 개수
    this.cardWidth = 100 / this.bundleSize; // 카드 가로 길이 (%)
    this.totalMoveDistance = 0; // 총 이동 거리 (%)
    this.enableClick = true;

    this.init();
  }

  init() {
    this.create();

    window.addEventListener("resize", () => {
      const isChangedBundleSize = this.resize();
      isChangedBundleSize && this.rearrange();
    });
    this.resize();
    this.rearrange();
  }

  create() {
    for (const item of this.data) {
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
      this.container.appendChild(li);
    }
  }

  prev() {
    if (!this.enableClick || this.focusIndex === 0) return;
    this.enableClick = false;
    this.handleClickable();

    const nextFocusIndex = this.focusIndex - this.bundleSize;
    const remainingCardCnt = this.focusIndex;

    if (remainingCardCnt >= this.bundleSize) {
      this.focusIndex = nextFocusIndex;
      this.totalMoveDistance += 100;
      this.container.style.transitionDuration = `${this.speed}ms`;
    } else {
      this.focusIndex = 0;
      this.totalMoveDistance += remainingCardCnt * this.cardWidth;
      this.container.style.transitionDuration = `${(remainingCardCnt / this.bundleSize) * this.speed}ms`;
    }

    this.container.style.transform = `translateX(${this.totalMoveDistance}%)`;
  }

  next() {
    if (!this.enableClick || this.focusIndex === this.lastIndex) return;
    this.handleClickable();

    const nextFocusIndex = this.focusIndex + this.bundleSize;
    if (nextFocusIndex > this.lastIndex) return;

    const remainingCardCnt = this.lastIndex - nextFocusIndex + 1;

    if (remainingCardCnt >= this.bundleSize) {
      this.focusIndex = nextFocusIndex;
      this.totalMoveDistance -= 100;
      this.container.style.transitionDuration = `${this.speed}ms`;
    } else {
      this.focusIndex = this.lastIndex - this.bundleSize + 1;
      this.totalMoveDistance -= remainingCardCnt * this.cardWidth;
      this.container.style.transitionDuration = `${(remainingCardCnt / this.bundleSize) * this.speed}ms`;
    }

    this.container.style.transform = `translateX(${this.totalMoveDistance}%)`;
  }

  resize() {
    for (const option of this.responsive) {
      if (option.condition(window.innerWidth) && this.bundleSize !== option.bundleSize) {
        this.bundleSize = option.bundleSize;
        this.cardWidth = 100 / option.bundleSize;
        return true;
      }
    }

    return false;
  }

  rearrange() {
    if (this.lastIndex - this.focusIndex + 1 >= this.bundleSize) {
      this.totalMoveDistance = -(this.focusIndex * this.cardWidth);
      this.container.style.transform = `translateX(${this.totalMoveDistance}%)`;
    } else {
      this.focusIndex = this.lastIndex - this.bundleSize + 1;
      this.totalMoveDistance = -(this.focusIndex * this.cardWidth);
      this.container.style.transform = `translateX(${this.totalMoveDistance}%)`;
    }
  }

  handleClickable() {
    this.enableClick = false;
    setTimeout(() => {
      this.enableClick = true;
      this.container.style.transitionDuration = "0s";
    }, this.speed);
  }
}
