import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div className="w-10 h-10 relative animate-spin">
        <Image alt="Logo" src="/logo to be used" fill />
      </div>
      <p className="text-sm text-muted-foreground">Askky is thinking...</p>
    </div>
  );
};

export default Loading;
