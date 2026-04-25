import { HelloCard } from "@/features/hello/HelloCard";

export const HomePage = (): React.ReactElement => {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <HelloCard />
    </div>
  );
};
