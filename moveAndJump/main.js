function getTranslateXValue(element) {
  return parseFloat(
    getComputedStyle(element)
      .getPropertyValue("transform")
      .match(/(-?[0-9\.]+)/g)?.[4]
  );
}

class MoveAndJump {
  #parentElement;
  #blockNum;
  #blockArr = [];
  #blockWidth = 140;
  #jumpStartingXPoint = 0;

  constructor(parentElement, blockNum) {
    this.#parentElement = parentElement;
    this.#blockNum = blockNum;

    this.init();
  }

  init() {
    for (let i = 0; i < this.#blockNum; i++) {
      const newBlock = document.createElement("div");
      newBlock.classList.add("block");
      newBlock.style.transform = `matrix(1, 0, 0, 1, ${(this.#blockWidth + 20) * i}, 0)`;
      this.#blockArr.push(newBlock);
      this.#parentElement.appendChild(newBlock);
    }

    this.#jumpStartingXPoint = parseInt(window.innerWidth * (2 / 3));
    window.addEventListener("resize", (e) => {
      this.#jumpStartingXPoint = parseInt(e.target.innerWidth * (2 / 3));
    });
  }

  run() {
    for (let i = 0; i < this.#blockArr.length; i++) {
      this.registerAnimation(this.#blockArr[i]);
    }
  }

  registerAnimation(element) {
    let moveReq;
    let jumpReq;

    const move = () => {
      const xValue = getTranslateXValue(element);
      const nextXValue = xValue - 1;
      element.style.transform = `matrix(1, 0, 0, 1, ${nextXValue}, 0)`;

      if (nextXValue >= -this.#blockWidth) {
        moveReq = requestAnimationFrame(move);
      } else {
        cancelAnimationFrame(moveReq);
        this.removeBlock(element);
        this.addBlock();
        return;
      }
    };

    let isTouchPeek = false;
    const jump = () => {
      const yValue = parseFloat(getComputedStyle(element).getPropertyValue("bottom"));
      let nextYValue;

      if (!isTouchPeek && yValue < 100) {
        nextYValue = yValue + 2;
      } else if (yValue > 0) {
        isTouchPeek = true;
        nextYValue = yValue - 2;
      }

      const xValue = getTranslateXValue(element);
      if (xValue > this.#jumpStartingXPoint - 200 && xValue <= this.#jumpStartingXPoint) {
        element.style.bottom = `${nextYValue}px`;
      } else {
        element.style.bottom = `${0}px`;
        cancelAnimationFrame(jumpReq);
      }

      jumpReq = requestAnimationFrame(jump);
    };

    moveReq = requestAnimationFrame(move);
    jumpReq = requestAnimationFrame(jump);
  }

  removeBlock(element) {
    const deleteIndex = this.#blockArr.findIndex((n) => n === element);
    this.#blockArr.splice(deleteIndex, 0);
    element.remove();
  }

  addBlock() {
    const newBlock = document.createElement("div");
    newBlock.classList.add("block");

    const xValue = getTranslateXValue(this.#blockArr[this.#blockArr.length - 1]) + 160;

    newBlock.style.transform = `matrix(1, 0, 0, 1, ${xValue}, 0)`;
    this.#blockArr.push(newBlock);
    this.#parentElement.appendChild(newBlock);
    this.registerAnimation(newBlock);
  }
}
