import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen place-items-center bg-black px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Page not found
        </h1>
        <p className="mt-6 text-base text-white/60 sm:text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="shadow-[0_0_10px_rgba(147,51,234,0.3)]"
          >
            Go back home
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;