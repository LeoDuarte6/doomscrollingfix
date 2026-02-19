import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">
        This page doesn't exist. Maybe that's a sign to scroll less.
      </p>
      <Link to="/">
        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-6 h-auto text-lg font-semibold">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
