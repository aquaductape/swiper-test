import { For, onMount } from "solid-js";
import Card from "./Card";
import { createStore } from "solid-js/store";
import { animate } from "motion";
import Button from "./Button";

export type TCard = {
  url: string;
  scale: boolean;
  flip: boolean;
  filterColor: { filterStyle: string };
};

const Cards = () => {
  const [cards, setCards] = createStore<TCard[]>(
    [
      {
        url: "https://images.pokemontcg.io/sm115/7_hires.png",
        scale: false,
        flip: false,
      },
      {
        url: "https://images.pokemontcg.io/sm10/33_hires.png",
        scale: false,
        flip: false,
      },
      {
        url: "https://images.pokemontcg.io/sm35/1_hires.png",
        scale: false,
        flip: false,
      },
      {
        url: "https://images.pokemontcg.io/swsh9/120_hires.png",
        scale: false,
        flip: false,
      },
      // {
      //   url: "https://images.pokemontcg.io/swsh12/116_hires.png",
      //   scale: false,
      //   flip: false,
      // },
      {
        url: "https://images.pokemontcg.io/swsh12/85_hires.png",
        scale: false,
        flip: false,
      },
    ].map((item, idx) => ({ ...item, filterColor: applyFilterByIndex(idx) }))
  );

  const pokemon = [];
  let cardOuterContainer!: HTMLDivElement;
  let cardInnerContainer!: HTMLDivElement;
  let cardIdx = cards.length;
  const cardWidth = 151;
  const gap = 32;

  const addCard = (type: "append" | "prepend") => {
    cardIdx++;
    const url = `https://images.pokemontcg.io/swsh45sv/SV${cardIdx
      .toString()
      .padStart(3, "0")}_hires.png`;

    if (type === "append") {
      setCards((items) => [
        ...items,
        {
          url,
          scale: false,
          flip: false,
          filterColor: applyFilterByIndex(cardIdx),
        },
      ]);
    }
    if (type === "prepend") {
      setCards((items) => [
        {
          url,
          scale: false,
          flip: false,
          filterColor: applyFilterByIndex(cardIdx),
        },
        ...items,
      ]);

      console.log({ cardLiveTranslateX });
      cardLiveTranslateX = cardLiveTranslateX - cardWidth - gap;
      cardInnerContainer.style.transform = `translateX(${cardLiveTranslateX}px)`;
    }
  };

  const moveCardToCenter = (idx: number) => {
    // if (Math.round(cardLiveTranslateX) === 0 || idx === 0) return;
    // if (
    //   Math.abs(Math.round(cardLiveTranslateX)) >=
    //   cardContentWidth - getParentSize()
    // )
    //   return;
    const containerRect = cardOuterContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const cards = [...cardInnerContainer.children];
    const card = cards[idx];

    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const delta = containerCenter - cardCenter;
    const { transform } = window.getComputedStyle(cardInnerContainer);

    let currentX = 0;
    if (transform && transform !== "none") {
      currentX = new DOMMatrixReadOnly(transform).m41;
    }
    const newX = Math.max(
      Math.min(currentX + delta, 0),
      -(cardContentWidth - getParentSize())
    );
    cardLiveTranslateX = newX;

    animate(cardInnerContainer, { x: [currentX, newX] }, { duration: 0.4 });
  };

  const centerNearestCard = () => {
    if (Math.round(cardLiveTranslateX) === 0) return;
    if (
      Math.abs(Math.round(cardLiveTranslateX)) >=
      cardContentWidth - getParentSize()
    )
      return;
    const cards = [...cardInnerContainer.children];

    const containerRect = cardOuterContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    if (closestCard) {
      const cardRect = closestCard.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const delta = containerCenter - cardCenter;
      console.log({ cardLiveTranslateX });

      // const { transform } = window.getComputedStyle(cardInnerContainer);

      // let currentX = 0;
      // if (transform && transform !== "none") {
      //   currentX = new DOMMatrixReadOnly(transform).m41;
      // }

      // const newX = cardLiveTranslateX + delta;
      const newX = Math.max(
        Math.min(cardLiveTranslateX + delta, 0),
        -(cardContentWidth - getParentSize())
      );

      animate(
        cardInnerContainer,
        { x: [cardLiveTranslateX, newX] },
        { duration: 0.4 }
      );
      cardLiveTranslateX = newX;
    }
  };

  let cardLiveTranslateX = 0;
  const parentBorder = 2;
  const parentPadding = 32;
  let parentWidth = 500;
  let cardContentWidth;
  const getParentSize = () =>
    parentWidth - parentBorder * 2 - parentPadding * 2;

  onMount(() => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let cardCurrentTranslateX = 0;

    const onDownEvent = (e: MouseEvent) => {
      isDown = true;
      cardInnerContainer.classList.add("active");
      startX = e.pageX - cardOuterContainer.offsetLeft;
      cardContentWidth = cardInnerContainer.clientWidth;
      parentWidth = cardOuterContainer.clientWidth;
      console.log({ parentWidth });
      const { transform } = window.getComputedStyle(cardInnerContainer);
      cardCurrentTranslateX = new DOMMatrixReadOnly(transform).m41 * -1;
      cardLiveTranslateX = cardCurrentTranslateX * -1;

      document.addEventListener("mousemove", onMove);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", onMove);
          cardInnerContainer.style.userSelect = "";

          centerNearestCard();
          // getClosestItemToHorizontalCenter();
        },
        { once: true }
      );
    };
    cardOuterContainer.addEventListener("mousedown", onDownEvent);

    // Touch events for mobile
    cardInnerContainer.addEventListener("touchstart", (e) => {
      isDown = true;
      startX = e.touches[0].pageX - cardOuterContainer.offsetLeft;
      cardContentWidth = cardInnerContainer.clientWidth;
      parentWidth = cardOuterContainer.clientWidth;
      console.log({ parentWidth });
      const { transform } = window.getComputedStyle(cardInnerContainer);
      cardCurrentTranslateX = new DOMMatrixReadOnly(transform).m41 * -1;
      cardLiveTranslateX = cardCurrentTranslateX * -1;

      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener(
        "touchend",
        () => {
          document.removeEventListener("touchmove", onTouchMove);
          cardInnerContainer.style.userSelect = "";
          document.documentElement.style.overflow = "";

          centerNearestCard();
        },
        { once: true }
      );
    });
    const onMove = (e) => {
      e.preventDefault();
      cardInnerContainer.style.userSelect = "none";
      const x = e.pageX - cardOuterContainer.offsetLeft;
      const walk = x - startX;
      cardLiveTranslateX = -Math.max(
        Math.min(
          cardCurrentTranslateX - walk,
          cardContentWidth - getParentSize()
        ),
        0
      );
      cardInnerContainer.style.transform = `translateX(${cardLiveTranslateX}px)`;
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      document.documentElement.style.overflow = "hidden";
      cardInnerContainer.style.userSelect = "none";
      const x = e.touches[0].pageX - cardOuterContainer.offsetLeft;
      const walk = x - startX;
      cardLiveTranslateX = -Math.max(
        Math.min(
          cardCurrentTranslateX - walk,
          cardContentWidth - getParentSize()
        ),
        0
      );
      cardInnerContainer.style.transform = `translateX(${cardLiveTranslateX}px)`;
    };
  });

  return (
    <div class="p-4">
      <div class="flex flex-col py-8 gap-3 w-full max-w-[500px] overflow-clip mx-auto">
        <div
          class="p-8 w-full border-2 border-transparent bg-slate-800 rounded-lg"
          ref={cardOuterContainer}
        >
          <div class="flex gap-8 w-max" ref={cardInnerContainer}>
            <For each={cards}>
              {(props, idx) => (
                <Card
                  {...props}
                  onClick={() => {
                    const { scale: prevScale, flip: prevFlip } = cards[idx()];
                    setCards(
                      { from: 0, to: cards.length - 1 },
                      { flip: false, scale: false }
                    );

                    if (prevScale) {
                      setCards(idx(), { flip: true, scale: true });
                      return;
                    }
                    setCards(idx(), { scale: true });
                    moveCardToCenter(idx());
                  }}
                />
              )}
            </For>
          </div>
        </div>
        <div class="flex justify-center gap-4">
          {/* <button
            class="relative h-12 overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
            onClick={() => addCard("prepend")}
          >
            <span class="relative">Prepend Slide</span>
          </button> */}
          <Button onClick={() => addCard("prepend")}>
            <span class="relative">Prepend Card</span>
          </Button>
          <Button onClick={() => addCard("append")}>
            <span class="relative">Append Card</span>
          </Button>
          {/* <button
            class="relative h-12 overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2"
            onClick={() => addCard("append")}
          >
            <span class="relative">Append Slide</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

const applyFilterByIndex = (index: number) => {
  index = index % 10;

  const brightness = 1 + index * 0.05;
  const contrast = 1 + index * 0.05;
  const hue = index * 36;

  return {
    filterStyle: `brightness(${brightness}) contrast(${contrast}) hue-rotate(${hue}deg)`,
  };
};

export default Cards;
