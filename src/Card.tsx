import { Component, createEffect, onMount } from "solid-js";
import { TCard } from "./Cards";
import { animate } from "motion";
import tcgCardBackImg from "./assets/tcg-card-back-2x.jpg";

const Card: Component<TCard & { onClick: () => void }> = (props) => {
  let card!: HTMLButtonElement;
  let cardInner!: HTMLDivElement;
  let shadowBackEl!: HTMLDivElement;
  let shadowFrontEl!: HTMLDivElement;

  createEffect(() => {
    if (props.scale) {
      animate(cardInner, { scale: 1.15 }, { duration: 0.4 });
      return;
    }
    animate(cardInner, { scale: 1 }, { duration: 0.4 });
  });
  createEffect(() => {
    if (props.flip) {
      animate(cardInner, { rotateY: 180 }, { duration: 0.4 });
      return;
    }
    animate(cardInner, { rotateY: 0 }, { duration: 0.4 });
  });

  onMount(() => {
    card.addEventListener("pointermove", (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const tiltX = -((y / height - 0.5) * 30);
      const tiltY = (x / width - 0.5) * 30;

      const rotateX = -((y / height - 0.5) * 30);
      const rotateY = (x / width - 0.5) * 30;

      const shadowOffsetX = -(tiltY * 0.4);
      const shadowOffsetY = -(tiltX * 0.4);

      animate(
        card,
        {
          rotateX,
          rotateY,
        },
        {
          duration: 0.3,
        }
      );

      animate(
        [shadowBackEl, shadowFrontEl],
        {
          x: shadowOffsetX,
          y: shadowOffsetY,
        },
        {
          duration: 0.3,
        }
      );
    });

    card.addEventListener("pointerleave", () => {
      animate(
        card,
        {
          rotateX: 0,
          rotateY: 0,
        },
        {
          duration: 0.5,
        }
      );

      animate(
        [shadowBackEl, shadowFrontEl],
        {
          x: 0,
          y: 0,
        },
        {
          duration: 0.5,
        }
      );
    });
  });

  return (
    <div class="perspective-near transform-3d">
      <button
        class="block relative transform-3d h-[210px] w-[151px]"
        ref={card}
        onClick={props.onClick}
      >
        <div class="h-full transform-3d" ref={cardInner}>
          <div class="relative h-full translate-z-[-1px] rotate-y-180">
            <img
              class="relative z-[1] overflow-hidden rounded-lg"
              style={
                {
                  // "box-shadow": "0px 3px 10px 1px #000",
                  // "box-shadow": "0px 3px 8px 1px #001437",
                }
              }
              src={props.url}
              alt=""
              draggable={false}
            />
            <div
              class="absolute inset-0 pointer-events-none rounded-lg h-[calc(100%_-_3px)] bg-[#000]"
              style={{
                "box-shadow": "0px 0px 10px 1px #000",
                // "box-shadow": "0px 3px 8px 1px #001437",
              }}
              ref={shadowFrontEl}
            ></div>
            {/* <img
            class="absolute inset-0 blur-sm opacity-50 scale-105 translate-y-1 overflow-hidden rounded-lg z-[-1]"
            src={props.url}
            draggable={false}
          /> */}
          </div>
          <div
            class="absolute inset-0 h-full backface-hidden"
            style={{
              filter: props.filterColor.filterStyle,
            }}
          >
            <img
              class="relative z-[1] overflow-hidden rounded-lg"
              style={
                {
                  // "box-shadow": "0px 5px 8px 3px #001437",
                  // "box-shadow": "0px 3px 8px 1px #001437",
                }
              }
              src={tcgCardBackImg}
              draggable={false}
            />
            <div
              class="absolute inset-0 pointer-events-none"
              ref={shadowBackEl}
            >
              <div
                class="absolute inset-0 rounded-lg bg-[#001437] translate-y-[5px] h-[calc(100%_-_5px)]"
                style={{
                  "box-shadow": "0px 0px 8px 3px #001437",
                }}
              ></div>
              <img
                class="absolute inset-0 blur-sm scale-105 translate-y-1 overflow-hidden rounded-lg z-[-1]"
                src={tcgCardBackImg}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Card;
