import axios from "axios";
import { Link, useRouteError } from "react-router-dom";

const DashboardErrorElement = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen w-screen bg-gray-100 flex items-center">
    <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
      {children}
    </div>
  </div>
);

const DashboardNotFoundError = () => (
  <DashboardErrorElement>
    <div className="max-w-md">
      <div className="text-5xl font-dark font-bold">404</div>
      <p className="text-2xl md:text-3xl font-light leading-normal">
        Sorry we couldn't find this page.
      </p>
      <p className="mb-8">
        But dont worry, you can find plenty of other things on our homepage.
      </p>

      <Link
        to="/"
        className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 active:bg-blue-600 hover:bg-blue-700"
      >
        back to homepage
      </Link>
    </div>
    <div className="max-w-lg">
      <img fetchPriority="high" loading="eager" alt="404 error banner" src="/404.png" />
    </div>
  </DashboardErrorElement>
);

const DashboardInternalError = () => (
  <DashboardErrorElement>
    <div className="text-center">
      <h1 className="text-8xl font-extrabold text-red-500">500</h1>
      <p className="text-4xl font-medium text-gray-800">
        Internal Server Error
      </p>
      <p className="text-xl text-gray-800 mt-4">
        We apologize for the inconvenience. Please try again later.
      </p>
    </div>
  </DashboardErrorElement>
);

export const DashboardErrorBoundary = () => {
  const error = useRouteError() as Error;

  if (axios.isAxiosError(error)) {
    if (error.status === 500) {
      return <DashboardInternalError />;
    }

    if (error.status === 404) {
      return <DashboardNotFoundError />;
    }

    return (
      <DashboardErrorElement>
        <div className="text-center">
          <h1 className="text-8xl font-extrabold text-red-500">
            {error.response?.status}
          </h1>
          <p className="text-4xl font-medium text-gray-800">
            {error.response?.statusText}
          </p>
          <p className="text-xl text-gray-800 mt-4">
            {error.response?.data?.data && <p>{error.response?.data.data}</p>}
          </p>
        </div>
      </DashboardErrorElement>
    );
  }

  return (
    <DashboardErrorElement>
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-red-500">Oops!</h1>
        <p className="text-4xl font-medium text-gray-800 mt-8">
          An unknown error occured!
        </p>
      </div>
    </DashboardErrorElement>
  );
};
