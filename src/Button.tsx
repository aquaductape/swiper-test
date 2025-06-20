import { ParentComponent } from "solid-js";

const Button: ParentComponent<{ onClick: () => void }> = (props) => {
  return (
    <button class="button-82-pushable" role="button" onClick={props.onClick}>
      <span class="button-82-shadow"></span>
      <span class="button-82-edge"></span>
      <span class="button-82-front text">{props.children}</span>
    </button>
  );
};

export default Button;
