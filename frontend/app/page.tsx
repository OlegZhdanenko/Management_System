import ActiveLabel from "./components/active_label";
import NotActiveLabel from "./components/not_active_label";

export default function Home() {
  return (
    <main>
      <h1 className="text-xl">Home Page</h1>
      <ActiveLabel>Active</ActiveLabel>
      <NotActiveLabel>Not Active</NotActiveLabel>
    </main>
  );
}
