import css from "./not_active_label.module.css";

export interface NotActiveLabelInterface {
  children: React.ReactNode;
}

export default function NotActiveLabel({ children }: NotActiveLabelInterface) {
  return <span className={css.label}>{children}</span>;
}
