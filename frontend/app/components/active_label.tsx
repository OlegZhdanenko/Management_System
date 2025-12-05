import css from "./active_label.module.css";

export interface ActiveLabelInterface {
  children: React.ReactNode;
}

export default function ActiveLabel({ children }: ActiveLabelInterface) {
  return <span className={css.label}>{children}</span>;
}
